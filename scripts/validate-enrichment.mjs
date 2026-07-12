// Validates the additive enrichment layer for one surface against its catalog:
// every endpoint should have an enrichment/<operationId>.json that parses and
// carries the matching operationId. Reports missing + invalid so a targeted
// re-run can fill gaps. Enrichment is OPTIONAL, so this never blocks the server
// — it's a coverage/quality report for the Phase 2 fleet.
//
// Usage: node scripts/validate-enrichment.mjs <pve|pdm>
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const surface = process.argv[2];
if (!["pve", "pdm"].includes(surface)) {
  console.error("Usage: node scripts/validate-enrichment.mjs <pve|pdm>");
  process.exit(1);
}

const catalogDir = join(root, "src", `catalog-${surface}`);
const index = JSON.parse(readFileSync(join(catalogDir, "index.json"), "utf8"));
const enrichDir = join(catalogDir, "enrichment");

const missing = [];
const invalid = [];
let valid = 0;
let withExamples = 0;
let destructiveWithReason = 0;
let destructiveTotal = 0;

for (const e of index.endpoints) {
  if (e.destructive) destructiveTotal++;
  const file = join(enrichDir, `${e.operationId}.json`);
  if (!existsSync(file)) {
    missing.push(e.operationId);
    continue;
  }
  let obj;
  try {
    obj = JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    invalid.push(`${e.operationId}: parse error (${err.message})`);
    continue;
  }
  if (obj.operationId !== e.operationId) {
    invalid.push(`${e.operationId}: operationId mismatch ("${obj.operationId}")`);
    continue;
  }
  if (!obj.usageNotes && !obj.examples && !obj.tips) {
    invalid.push(`${e.operationId}: empty enrichment (no usageNotes/examples/tips)`);
    continue;
  }
  valid++;
  if (Array.isArray(obj.examples) && obj.examples.length) withExamples++;
  if (e.destructive && obj.destructiveReason) destructiveWithReason++;
}

// Stray enrichment files with no matching endpoint?
const known = new Set(index.endpoints.map((e) => e.operationId));
const stray = existsSync(enrichDir)
  ? readdirSync(enrichDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).filter((id) => !known.has(id))
  : [];

console.log(`surface:            ${surface}`);
console.log(`endpoints:          ${index.endpoints.length}`);
console.log(`valid enrichment:   ${valid}`);
console.log(`with examples:      ${withExamples}`);
console.log(`destructive w/ reason: ${destructiveWithReason}/${destructiveTotal}`);
console.log(`missing (${missing.length}):`);
if (missing.length) console.log("  " + missing.join(" "));
console.log(`invalid (${invalid.length}):`);
for (const i of invalid.slice(0, 40)) console.log(`  - ${i}`);
if (invalid.length > 40) console.log(`  ... and ${invalid.length - 40} more`);
console.log(`stray (${stray.length}): ${stray.slice(0, 20).join(" ")}`);

// Emit machine-readable gap list for a targeted re-run.
const gaps = [...missing, ...invalid.map((s) => s.split(":")[0])];
if (gaps.length) {
  console.log(`\nGAPS_JSON=${JSON.stringify(gaps)}`);
  process.exitCode = 1;
} else {
  console.log(`\n✅ Full enrichment coverage for ${surface} (${valid}/${index.endpoints.length}).`);
}
