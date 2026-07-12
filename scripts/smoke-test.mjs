// Boots the built server over stdio and exercises the catalog-backed tools
// WITHOUT any Proxmox credentials: verifies tool registration, catalog reads
// (list/describe), and the read-only write gate. No network calls succeed by
// design — we only assert the server's own validation/gating behavior.
//
// Usage: node scripts/smoke-test.mjs
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const server = spawn("node", [join(root, "dist", "index.js")], { stdio: ["pipe", "pipe", "pipe"] });

let buf = "";
const pending = new Map();
server.stdout.on("data", (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  }
});
server.stderr.on("data", (d) => process.stderr.write(`[server] ${d}`));

let nextId = 1;
function rpc(method, params) {
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    server.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
}
function notify(method, params) {
  server.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}
const textOf = (res) => res.result.content[0].text;
const parse = (res) => JSON.parse(textOf(res));

let failures = 0;
function check(label, cond, detail = "") {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
  if (!cond) failures++;
}

const init = await rpc("initialize", {
  protocolVersion: "2024-11-05",
  capabilities: {},
  clientInfo: { name: "smoke", version: "0" },
});
check("initialize", init?.result?.serverInfo?.name === "Proxmox MCP Server", init?.result?.serverInfo?.name);
notify("notifications/initialized", {});

const tools = (await rpc("tools/list", {})).result.tools.map((t) => t.name).sort();
const expected = [
  "pve_list_endpoints", "pve_describe_endpoint", "pve_call_endpoint",
  "pdm_list_endpoints", "pdm_describe_endpoint", "pdm_call_endpoint",
].sort();
check("6 tools registered", tools.length === 6 && JSON.stringify(tools) === JSON.stringify(expected), tools.join(", "));

// PVE list (reads only)
const pveList = parse(await rpc("tools/call", { name: "pve_list_endpoints", arguments: { params: { reads_only: true, limit: 3 } } }));
check("pve_list totals", pveList.totalEndpoints === 675 && pveList.readCount === 340, `total=${pveList.totalEndpoints} read=${pveList.readCount}`);
check("pve_list returns entries", Array.isArray(pveList.endpoints) && pveList.endpoints.length === 3);

// PDM list
const pdmList = parse(await rpc("tools/call", { name: "pdm_list_endpoints", arguments: { params: { limit: 1 } } }));
check("pdm_list totals", pdmList.totalEndpoints === 318 && pdmList.writeCount === 119, `total=${pdmList.totalEndpoints} write=${pdmList.writeCount}`);

// Describe a known read endpoint
const desc = parse(await rpc("tools/call", { name: "pve_describe_endpoint", arguments: { params: { operation_id: "get_version" } } }));
check("pve_describe get_version", desc.method === "GET" && desc.path === "/version", `${desc.method} ${desc.path}`);

// Describe with full structure on a parametered endpoint
const descVm = parse(await rpc("tools/call", { name: "pve_describe_endpoint", arguments: { params: { operation_id: "get_nodes_node_qemu_vmid_status_current" } } }));
check("pve_describe nested pathParams", Array.isArray(descVm.pathParams) && descVm.pathParams.some((p) => p.name === "vmid"), `pathParams=${descVm.pathParams?.map((p) => p.name).join(",")}`);

// Enrichment merges into describe output (additive layer)
check("pve_describe merges enrichment", !!desc.enrichment && typeof desc.enrichment.usageNotes === "string" && desc.enrichment.usageNotes.length > 0, `usageNotes len=${desc.enrichment?.usageNotes?.length}`);

// Destructive endpoint carries destructiveReason from enrichment
const descDel = parse(await rpc("tools/call", { name: "pve_describe_endpoint", arguments: { params: { operation_id: "delete_nodes_node_qemu_vmid_snapshot_snapname" } } }));
check("destructive enrichment reason", descDel.destructive === true && !!descDel.enrichment?.destructiveReason, descDel.enrichment?.destructiveReason?.slice(0, 60) || "missing");

// PDM enrichment also merges
const descPdm = parse(await rpc("tools/call", { name: "pdm_describe_endpoint", arguments: { params: { operation_id: "get_version" } } }));
check("pdm_describe merges enrichment", !!descPdm.enrichment && (typeof descPdm.enrichment.usageNotes === "string" || Array.isArray(descPdm.enrichment.tips)), descPdm.enrichment ? "present" : "missing");

// Write gate: a write must be refused without enabling writes (gate runs before any network call)
const gated = textOf(await rpc("tools/call", { name: "pve_call_endpoint", arguments: { params: { operation_id: "post_nodes_node_qemu", path_params: { node: "pve1" }, params: { vmid: 100 } } } }));
check("write gate blocks write", /writes are disabled/i.test(gated), gated.slice(0, 80));

// Unknown-op suggestion path ("get_node" overlaps real ids like get_nodes, get_nodes_node)
const unknown = textOf(await rpc("tools/call", { name: "pve_call_endpoint", arguments: { params: { operation_id: "get_node" } } }));
check("unknown op suggests", /Unknown endpoint/i.test(unknown) && /Did you mean/i.test(unknown), unknown.slice(0, 90));

server.kill();
console.log(failures === 0 ? "\nALL SMOKE CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
