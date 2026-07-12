// Assembles the shippable catalog for one Proxmox surface from the faithful raw
// specs produced by _source/extract.mjs. Deterministic — no LLM, no field loss.
//
//   reads   _source/raw-<surface>/<operationId>.json   (faithful extraction)
//   writes  src/catalog-<surface>/endpoints/<operationId>.json   (shippable spec)
//   writes  src/catalog-<surface>/index.json                     (aggregate index)
//
// Adds only DERIVED fields (resource, category, destructive, requestSample,
// required flags, param routing) on top of the authoritative schema data.
//
// Usage: node scripts/assemble-catalog.mjs <pve|pdm>
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const surface = process.argv[2];
if (!["pve", "pdm"].includes(surface)) {
  console.error("Usage: node scripts/assemble-catalog.mjs <pve|pdm>");
  process.exit(1);
}

const rawDir = join(root, "_source", `raw-${surface}`);
const outDir = join(root, "src", `catalog-${surface}`);
const endpointsOut = join(outDir, "endpoints");

const SURFACE_META = {
  pve: {
    product: "Proxmox VE",
    defaultBaseUrl: "https://PVE_HOST:8006/api2/json",
    authScheme: "PVEAPIToken",
  },
  pdm: {
    product: "Proxmox Datacenter Manager",
    defaultBaseUrl: "https://PDM_HOST:8443/api2/json",
    authScheme: "PDMAPIToken",
  },
};

// Friendly category by the path's first segment. Falls back to Title-cased segment.
const CATEGORY_BY_SEGMENT = {
  access: "Access & Auth",
  cluster: "Cluster",
  nodes: "Nodes & Guests",
  pools: "Pools",
  storage: "Storage",
  version: "System",
  // PDM-leaning segments:
  config: "Configuration",
  remotes: "Remotes",
  resources: "Resources",
  pve: "PVE Remotes",
  pbs: "PBS Remotes",
  sdn: "SDN",
  metrics: "Metrics",
};

function titleCase(seg) {
  return seg.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function resourceOf(path) {
  return path.replace(/^\//, "").split("/")[0] || "root";
}
function categoryOf(path) {
  const seg = resourceOf(path);
  return CATEGORY_BY_SEGMENT[seg] || titleCase(seg);
}

// Destructive = data-loss / disruptive. All DELETE, plus write paths that stop,
// reset, shut down, migrate, roll back, wipe, or destroy. Advisory metadata;
// the enrichment pass refines `destructiveReason`.
const DESTRUCTIVE_WRITE = /(\/|^)(stop|shutdown|reset|reboot|suspend|rollback|destroy|wipedisk|wipe_disk|migrate|delete|remove|stopall)(\/|$)/i;
function isDestructive(method, path) {
  if (method === "DELETE") return true;
  if (method === "POST" || method === "PUT") return DESTRUCTIVE_WRITE.test(path);
  return false;
}

// A Proxmox param is required unless explicitly marked optional.
function normalizeParam(p) {
  const out = {
    name: p.name,
    type: p.type ?? "string",
    required: !p.optional,
  };
  for (const k of ["description", "format", "enum", "default", "minimum", "maximum", "minLength", "maxLength", "typetext", "pattern"]) {
    if (p[k] !== undefined) out[k] = p[k];
  }
  return out;
}

// Where do non-path params go? GET/DELETE -> query string; POST/PUT -> JSON body.
function paramLocation(method) {
  return method === "POST" || method === "PUT" ? "body" : "query";
}

function buildRequestSample(spec, baseUrl, authScheme) {
  const example = (p) => {
    if (p.enum && p.enum.length) return p.enum[0];
    if (p.type === "integer" || p.type === "number") return p.format === "pve-vmid" ? "100" : "0";
    if (p.type === "boolean") return "1";
    return `<${p.name}>`;
  };
  let path = spec.path;
  for (const pp of spec.pathParams) path = path.replace(`{${pp.name}}`, example(pp));
  const headers = `-H 'Authorization: ${authScheme}=USER@REALM!TOKENID=SECRET'`;
  if (spec.method === "GET" || spec.method === "DELETE") {
    const qs = spec.params
      .filter((p) => p.required)
      .map((p) => `${p.name}=${example(p)}`)
      .join("&");
    const url = `${baseUrl}${path}${qs ? `?${qs}` : ""}`;
    return `curl -k -X ${spec.method} ${headers} '${url}'`;
  }
  const bodyObj = {};
  for (const p of spec.params.filter((x) => x.required)) bodyObj[p.name] = example(p);
  return `curl -k -X ${spec.method} ${headers} -H 'Content-Type: application/json' \\\n  -d '${JSON.stringify(bodyObj)}' '${baseUrl}${path}'`;
}

// --- Build ---
const meta = SURFACE_META[surface];
const files = readdirSync(rawDir).filter((f) => f.endsWith(".json"));

rmSync(endpointsOut, { recursive: true, force: true });
mkdirSync(endpointsOut, { recursive: true });

const indexEntries = [];
const problems = [];

for (const f of files) {
  const raw = JSON.parse(readFileSync(join(rawDir, f), "utf8"));
  const operationId = f.replace(/\.json$/, "");
  if (raw.operationId !== operationId) problems.push(`${operationId}: operationId mismatch (${raw.operationId})`);

  // Path params are defined by the path's {placeholders} — the authoritative
  // source. Proxmox (esp. PDM) often omits parent placeholders from a leaf's
  // `parameters`, so we enrich from schema where present and stub where absent;
  // call_endpoint needs a value for every placeholder to build the URL.
  const placeholders = [...raw.path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  const rawByName = new Map();
  for (const p of [...(raw.pathParams || []), ...(raw.params || [])]) rawByName.set(p.name, p);
  const pathParams = placeholders.map((name) => {
    const src = rawByName.get(name);
    if (src) return normalizeParam({ ...src, name });
    return {
      name,
      type: "string",
      required: true,
      description: "Path parameter (no further detail in Proxmox schema; inherited from parent resource).",
    };
  });
  const params = (raw.params || [])
    .filter((p) => !placeholders.includes(p.name))
    .map(normalizeParam);
  const location = paramLocation(raw.method);

  const spec = {
    operationId,
    surface,
    resource: resourceOf(raw.path),
    category: categoryOf(raw.path),
    name: raw.proxmoxName || operationId,
    method: raw.method,
    path: raw.path,
    description: raw.description || "",
    writeOperation: raw.writeOperation,
    destructive: isDestructive(raw.method, raw.path),
    protected: !!raw.protected,
    allowtoken: raw.allowtoken !== 0,
    paramLocation: location, // "query" or "body" for non-path params
    pathParams,
    params,
    returns: raw.returns || null,
    permissions: raw.permissions || null,
    requestSample: "", // filled below (needs spec.params/pathParams)
  };
  spec.requestSample = buildRequestSample(spec, meta.defaultBaseUrl, meta.authScheme);

  // Structural sanity: pathParams now covers every placeholder by construction.
  for (const ph of placeholders) {
    if (!pathParams.some((p) => p.name === ph)) problems.push(`${operationId}: path placeholder {${ph}} has no pathParam`);
  }

  writeFileSync(join(endpointsOut, `${operationId}.json`), JSON.stringify(spec, null, 2) + "\n");

  indexEntries.push({
    operationId,
    resource: spec.resource,
    category: spec.category,
    name: spec.name,
    method: spec.method,
    path: spec.path,
    description: spec.description,
    writeOperation: spec.writeOperation,
    destructive: spec.destructive,
  });
}

indexEntries.sort(
  (a, b) =>
    a.category.localeCompare(b.category) ||
    a.path.localeCompare(b.path) ||
    a.method.localeCompare(b.method)
);

const categories = [...new Set(indexEntries.map((e) => e.category))].sort();
const index = {
  surface,
  product: meta.product,
  generatedFrom: `${surface}-apidoc.js`,
  defaultBaseUrl: meta.defaultBaseUrl,
  authScheme: meta.authScheme,
  endpointCount: indexEntries.length,
  readCount: indexEntries.filter((e) => !e.writeOperation).length,
  writeCount: indexEntries.filter((e) => e.writeOperation).length,
  categories,
  endpoints: indexEntries,
};

writeFileSync(join(outDir, "index.json"), JSON.stringify(index, null, 2) + "\n");

// --- Report ---
const byCat = {};
for (const e of indexEntries) byCat[e.category] = (byCat[e.category] || 0) + 1;
console.log(`surface:       ${surface} (${meta.product})`);
console.log(`endpoints:     ${indexEntries.length}  (read ${index.readCount} / write ${index.writeCount})`);
console.log(`categories:    ${JSON.stringify(byCat)}`);
console.log(`destructive:   ${indexEntries.filter((e) => e.destructive).length}`);
console.log(`problems:      ${problems.length}`);
for (const p of problems.slice(0, 20)) console.log(`  - ${p}`);
if (problems.length > 20) console.log(`  ... and ${problems.length - 20} more`);
console.log(`wrote -> src/catalog-${surface}/endpoints/ + index.json`);
if (problems.length) process.exitCode = 1;
