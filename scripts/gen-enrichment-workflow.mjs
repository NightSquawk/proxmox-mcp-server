// Generates a self-contained Workflow script for the additive enrichment pass of
// one surface, with the full operationId list baked in as a literal (the Workflow
// runtime has no filesystem access, so the data must be embedded, not read).
//
//   reads   src/catalog-<surface>/index.json
//   writes  _source/workflow-enrich-<surface>.mjs
//
// Then: Workflow({ scriptPath: "<abs>/_source/workflow-enrich-<surface>.mjs" })
//
// Usage: node scripts/gen-enrichment-workflow.mjs <pve|pdm>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const surface = process.argv[2];
if (!["pve", "pdm"].includes(surface)) {
  console.error("Usage: node scripts/gen-enrichment-workflow.mjs <pve|pdm>");
  process.exit(1);
}

const index = JSON.parse(readFileSync(join(root, "src", `catalog-${surface}`, "index.json"), "utf8"));
const opIds = index.endpoints.map((e) => e.operationId);
const product = index.product;

// POSIX-style absolute root for the workflow (forward slashes are safe on Windows fs APIs).
const catalogRoot = join(root, "src", `catalog-${surface}`).replace(/\\/g, "/");

const script = `export const meta = {
  name: 'enrich-${surface}',
  description: 'Additive enrichment for all ${product} endpoints (one Sonnet agent per endpoint)',
  phases: [{ title: 'Enrich', detail: '${opIds.length} endpoints: Read spec -> compose additive docs -> Write enrichment JSON' }],
};

const ROOT = ${JSON.stringify(catalogRoot)};
const SURFACE = ${JSON.stringify(surface)};
const PRODUCT = ${JSON.stringify(product)};
const ITEMS = ${JSON.stringify(opIds)};

const SCHEMA = {
  type: "object",
  properties: {
    operationId: { type: "string" },
    wrote: { type: "boolean", description: "true if the enrichment JSON file was written" },
    destructive: { type: "boolean" },
    summary: { type: "string", description: "one-line note on the enrichment written" },
  },
  required: ["operationId", "wrote"],
  additionalProperties: false,
};

function buildPrompt(opId) {
  return [
    "You are enriching ONE " + PRODUCT + " API endpoint with ADDITIVE documentation.",
    "",
    "operationId: " + opId,
    "Structural spec file to READ: " + ROOT + "/endpoints/" + opId + ".json",
    "",
    "That spec already holds the authoritative method, path, params, types, returns, and permissions. DO NOT restate or modify any of those. Add only practical, accurate, additive documentation.",
    "",
    "Steps:",
    "1. Read the spec file above.",
    "2. Compose an enrichment object (omit any field you cannot fill confidently — never invent param names/values that conflict with the spec):",
    "   - operationId: \\"" + opId + "\\"",
    "   - usageNotes: 1-3 sentences — when/why to use this, prerequisites, key gotchas (e.g. returns a task UPID for async ops, node must be online, requires a specific privilege).",
    "   - examples: array with ONE realistic example { summary, path_params, params } using plausible values consistent with the spec's param types/formats.",
    "   - destructiveReason: ONLY if the spec has \\"destructive\\": true — one sentence on exactly what data/service is lost or disrupted.",
    "   - tips: array of short strings for non-obvious operational notes (optional).",
    "   - relatedOperations: array of sibling operationIds likely used together (optional).",
    "3. Write that object as pretty-printed JSON (2-space indent) to: " + ROOT + "/enrichment/" + opId + ".json",
    "4. Return your StructuredOutput status (operationId, wrote, destructive, summary).",
    "",
    "Be concise and correct. Accuracy over verbosity.",
  ].join("\\n");
}

phase('Enrich');
log(SURFACE.toUpperCase() + ": enriching " + ITEMS.length + " endpoints (one Sonnet agent each)");

const results = await pipeline(
  ITEMS,
  (opId) => agent(buildPrompt(opId), { label: opId, phase: 'Enrich', model: 'sonnet', schema: SCHEMA })
);

const done = results.filter(Boolean);
const wrote = done.filter((r) => r.wrote).length;
log(SURFACE.toUpperCase() + ": wrote " + wrote + "/" + ITEMS.length + " enrichment files");
return { surface: SURFACE, total: ITEMS.length, returned: done.length, wrote };
`;

mkdirSync(join(root, "_source"), { recursive: true });
const out = join(root, "_source", `workflow-enrich-${surface}.mjs`);
writeFileSync(out, script);
console.log(`wrote ${out}`);
console.log(`  surface=${surface}  endpoints=${opIds.length}`);
console.log(`  launch: Workflow({ scriptPath: ${JSON.stringify(out.replace(/\\/g, "/"))} })`);
