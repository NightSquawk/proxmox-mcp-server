#!/usr/bin/env node
// Generates the README "API coverage" section from both shipped catalogs.
// Usage: node scripts/generate-api-coverage.mjs > coverage.md
// Reads src/catalog-pve/index.json and src/catalog-pdm/index.json and emits
// markdown: total count, a summary table of counts by category per surface,
// then one collapsible <details> block per category listing every endpoint.
// Regenerate (and re-embed in README.md) whenever the catalog changes.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const SURFACES = [
  { key: "pve", label: "PVE", product: "Proxmox VE" },
  { key: "pdm", label: "PDM", product: "Proxmox Datacenter Manager" },
];

const catalogs = SURFACES.map((s) => ({
  ...s,
  index: JSON.parse(readFileSync(join(root, "src", `catalog-${s.key}`, "index.json"), "utf8")),
}));

function byCategory(index) {
  const map = new Map();
  for (const cat of index.categories) map.set(cat, []);
  for (const ep of index.endpoints) {
    if (!map.has(ep.category)) map.set(ep.category, []);
    map.get(ep.category).push(ep);
  }
  return map;
}

const out = [];
const total = catalogs.reduce((n, c) => n + c.index.endpoints.length, 0);
const parts = catalogs.map((c) => `${c.index.endpoints.length} ${c.product} (${c.label})`);
out.push(`${total} operations covered: ${parts.join(" + ")}.`);
out.push("");
out.push("| Surface | Category | Operations |");
out.push("|---|---|---|");
for (const c of catalogs) {
  for (const [cat, eps] of byCategory(c.index)) {
    out.push(`| ${c.label} | ${cat} | ${eps.length} |`);
  }
}
out.push("");

for (const c of catalogs) {
  out.push(`### ${c.product} (${c.index.endpoints.length} operations)`);
  out.push("");
  for (const [cat, eps] of byCategory(c.index)) {
    out.push("<details>");
    out.push(`<summary><strong>${c.label}: ${cat}</strong> (${eps.length} operations)</summary>`);
    out.push("");
    out.push("| Method | Path | Operation ID |");
    out.push("|---|---|---|");
    for (const ep of eps) {
      out.push(`| ${ep.method} | \`${ep.path}\` | \`${ep.operationId}\` |`);
    }
    out.push("");
    out.push("</details>");
    out.push("");
  }
}

process.stdout.write(out.join("\n"));
