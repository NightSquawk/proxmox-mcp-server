// Deterministic extractor: flattens a Proxmox apidoc.js `apiSchema` tree into one
// faithful raw spec per (method, path) endpoint. Zero field loss.
//
//   reads   _source/<surface>-apidoc.js      (download from Proxmox; see README)
//   writes  _source/raw-<surface>/<operationId>.json
//   writes  _source/manifest-<surface>.json
//
// Then run scripts/assemble-catalog.mjs to build the shippable src/catalog-<surface>.
//
// Usage: node scripts/extract.mjs <pve|pdm>
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDir = join(root, "_source");
const surface = process.argv[2];
if (!["pve", "pdm"].includes(surface)) {
  console.error("Usage: node scripts/extract.mjs <pve|pdm>");
  process.exit(1);
}

const text = readFileSync(join(sourceDir, `${surface}-apidoc.js`), "utf8");

// Extract the `apiSchema = [ ... ]` array literal via string-aware bracket matching.
function extractArrayLiteral(src) {
  const m = src.match(/apiSchema\s*=\s*\[/);
  if (!m) throw new Error("Could not find `apiSchema = [`");
  const start = src.indexOf("[", m.index);
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error("Unbalanced brackets in apiSchema array");
}

const schema = JSON.parse(extractArrayLiteral(text));

function makeOperationId(method, path) {
  const p = path
    .replace(/\{([^}]+)\}/g, "$1")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  return `${method.toLowerCase()}_${p}`;
}
function pathPlaceholders(path) {
  return [...path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
}
function paramsToList(parameters) {
  if (!parameters || !parameters.properties) return [];
  return Object.entries(parameters.properties).map(([name, def]) => ({ name, ...def }));
}

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"];
const endpoints = [];

function walk(node) {
  if (node && node.info) {
    for (const method of HTTP_METHODS) {
      const info = node.info[method];
      if (!info) continue;
      const path = node.path || info.path || "";
      const placeholders = pathPlaceholders(path);
      const allParams = paramsToList(info.parameters);
      endpoints.push({
        operationId: makeOperationId(method, path),
        surface,
        method,
        path,
        proxmoxName: info.name || node.text || "",
        description: info.description || "",
        writeOperation: method !== "GET",
        protected: info.protected ? 1 : 0,
        allowtoken: info.allowtoken === undefined ? 1 : info.allowtoken,
        pathParams: allParams.filter((p) => placeholders.includes(p.name)),
        params: allParams.filter((p) => !placeholders.includes(p.name)),
        returns: info.returns || null,
        permissions: info.permissions || null,
      });
    }
  }
  if (node && Array.isArray(node.children)) for (const c of node.children) walk(c);
}
for (const top of schema) walk(top);

const seen = new Map();
const collisions = [];
for (const e of endpoints) {
  if (seen.has(e.operationId)) collisions.push(`${e.operationId}`);
  else seen.set(e.operationId, true);
}

const rawDir = join(sourceDir, `raw-${surface}`);
rmSync(rawDir, { recursive: true, force: true });
mkdirSync(rawDir, { recursive: true });
for (const e of endpoints) {
  writeFileSync(join(rawDir, `${e.operationId}.json`), JSON.stringify(e, null, 2) + "\n");
}

const manifest = endpoints
  .map((e) => ({
    operationId: e.operationId,
    surface,
    method: e.method,
    path: e.path,
    writeOperation: e.writeOperation,
    proxmoxName: e.proxmoxName,
    description: e.description,
    pathParamCount: e.pathParams.length,
    paramCount: e.params.length,
    hasReturns: !!e.returns,
  }))
  .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
writeFileSync(join(sourceDir, `manifest-${surface}.json`), JSON.stringify(manifest, null, 2) + "\n");

const byMethod = {};
for (const e of endpoints) byMethod[e.method] = (byMethod[e.method] || 0) + 1;
console.log(`surface ${surface}: ${endpoints.length} endpoints  ${JSON.stringify(byMethod)}  collisions=${collisions.length}`);
if (collisions.length) { for (const c of collisions) console.log(`  collision: ${c}`); process.exitCode = 1; }
