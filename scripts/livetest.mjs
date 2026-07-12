// Live read-only test harness for the Proxmox MCP server. Drives the COMPILED
// client + catalog from dist/ against a real PVE host, so it tests the actual
// shipping code (catalog paths, param routing, auth, TLS) — not a reimplementation.
//
// Creds come from _source/.livetest.json (gitignored). READ-ONLY: only GET
// endpoints are ever issued; writes are never attempted.
//
// Subcommands:
//   node scripts/livetest.mjs discover                 -> _source/livetest-context.json
//   node scripts/livetest.mjs plan [buckets]           -> _source/livetest-plan.json (+ buckets)
//   node scripts/livetest.mjs sweep <casesFile> <out>  -> run cases, write results
//   node scripts/livetest.mjs call <opId> [argsJson]   -> one call, print result
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDir = join(root, "_source");
const cfg = JSON.parse(readFileSync(join(sourceDir, ".livetest.json"), "utf8"));

process.env.PVE_BASE_URL = cfg.baseUrl;
process.env.PVE_TOKEN_ID = cfg.tokenId;
process.env.PVE_TOKEN_SECRET = cfg.tokenSecret;
process.env.PVE_TLS_REJECT_UNAUTHORIZED = "false";
// Writes stay disabled — this harness only issues GETs regardless.

const distUrl = (p) => pathToFileURL(join(root, "dist", p)).href;
const { loadEndpointSpec, loadIndex } = await import(distUrl("catalog/endpoint-spec.js"));
const { ProxmoxClient } = await import(distUrl("clients/proxmox-client.js"));
const client = new ProxmoxClient("pve");

async function callOp(opId, args = {}) {
  const spec = loadEndpointSpec("pve", opId);
  if (!spec) return { opId, ok: false, error: "unknown operationId" };
  if (spec.method !== "GET") return { opId, ok: false, error: `refused non-GET (${spec.method})` };
  const res = await client.request(spec, { pathParams: args.path_params, params: args.params });
  const data = res.result?.data;
  return {
    opId,
    method: spec.method,
    path: spec.path,
    ok: !res.isError,
    error: res.isError ? res.error : null,
    rows: Array.isArray(data) ? data.length : data === undefined || data === null ? 0 : 1,
    data: args._keepData ? data : undefined,
  };
}

async function pool(items, worker, concurrency = 8) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await worker(items[idx], idx);
      }
    })
  );
  return results;
}

const cmd = process.argv[2];

// ── discover ─────────────────────────────────────────────────────────────────
if (cmd === "discover") {
  const get = (opId, args) => callOp(opId, { ...args, _keepData: true });
  const ctx = { discoveredAt: new Date().toISOString(), errors: [] };

  const nodesRes = await get("get_nodes");
  const nodes = (nodesRes.data || []).map((n) => n.node);
  ctx.nodes = nodes;
  ctx.node = nodes[0];

  const resRes = await get("get_cluster_resources");
  const resources = resRes.data || [];
  const guests = resources.filter((r) => r.type === "qemu" || r.type === "lxc");
  ctx.qemu = guests.filter((g) => g.type === "qemu").map((g) => ({ node: g.node, vmid: g.vmid }));
  ctx.lxc = guests.filter((g) => g.type === "lxc").map((g) => ({ node: g.node, vmid: g.vmid }));
  ctx.storages = resources.filter((r) => r.type === "storage").map((r) => ({ node: r.node, storage: r.storage }));

  // Fallback storage discovery per node if cluster-resources lacked storages.
  if (!ctx.storages.length && ctx.node) {
    const st = await get("get_nodes_node_storage", { path_params: { node: ctx.node } });
    ctx.storages = (st.data || []).map((s) => ({ node: ctx.node, storage: s.storage }));
  }

  const pools = await get("get_pools");
  ctx.pools = (pools.data || []).map((p) => p.poolid);

  // Access-realm IDs
  ctx.realms = ((await get("get_access_domains")).data || []).map((d) => d.realm);
  ctx.users = ((await get("get_access_users")).data || []).map((u) => u.userid);
  ctx.roles = ((await get("get_access_roles")).data || []).map((r) => r.roleid);
  ctx.groups = ((await get("get_access_groups")).data || []).map((g) => g.groupid);

  const q = ctx.qemu[0];
  const l = ctx.lxc[0];
  const node = ctx.node;

  // Secondary (deep-ID) discovery — best-effort, failures are fine.
  if (q) {
    const snaps = await get("get_nodes_node_qemu_vmid_snapshot", { path_params: { node: q.node, vmid: q.vmid } });
    ctx.qemuSnap = (snaps.data || []).map((s) => s.name).find((n) => n && n !== "current");
  }
  if (l) {
    const snaps = await get("get_nodes_node_lxc_vmid_snapshot", { path_params: { node: l.node, vmid: l.vmid } });
    ctx.lxcSnap = (snaps.data || []).map((s) => s.name).find((n) => n && n !== "current");
  }
  if (node) {
    const tasks = await get("get_nodes_node_tasks", { path_params: { node } });
    ctx.upid = (tasks.data || [])[0]?.upid;
    const services = await get("get_nodes_node_services", { path_params: { node } });
    ctx.service = (services.data || [])[0]?.service;
    const net = await get("get_nodes_node_network", { path_params: { node } });
    ctx.iface = (net.data || [])[0]?.iface;
    const disks = await get("get_nodes_node_disks_list", { path_params: { node } });
    ctx.disk = (disks.data || [])[0]?.devpath;
    if (ctx.storages[0]) {
      const content = await get("get_nodes_node_storage_storage_content", {
        path_params: { node: ctx.storages[0].node || node, storage: ctx.storages[0].storage },
      });
      ctx.volume = (content.data || [])[0]?.volid;
    }
  }

  writeFileSync(join(sourceDir, "livetest-context.json"), JSON.stringify(ctx, null, 2));
  console.log("Discovered context:");
  console.log(`  nodes:     ${ctx.nodes.join(", ") || "(none)"}`);
  console.log(`  qemu VMs:  ${ctx.qemu.length} (sample ${q ? q.node + "/" + q.vmid : "-"})`);
  console.log(`  lxc CTs:   ${ctx.lxc.length} (sample ${l ? l.node + "/" + l.vmid : "-"})`);
  console.log(`  storages:  ${ctx.storages.map((s) => s.storage).join(", ") || "(none)"}`);
  console.log(`  pools:     ${ctx.pools.join(", ") || "(none)"}`);
  console.log(`  realms:    ${ctx.realms.join(", ") || "(none)"}  users:${ctx.users.length} roles:${ctx.roles.length} groups:${ctx.groups.length}`);
  console.log(`  deep IDs:  qemuSnap=${ctx.qemuSnap || "-"} upid=${ctx.upid ? "yes" : "-"} service=${ctx.service || "-"} iface=${ctx.iface || "-"} disk=${ctx.disk || "-"} volume=${ctx.volume || "-"}`);
  process.exit(0);
}

// ── plan ─────────────────────────────────────────────────────────────────────
if (cmd === "plan") {
  const buckets = parseInt(process.argv[3] || "15", 10);
  const ctx = JSON.parse(readFileSync(join(sourceDir, "livetest-context.json"), "utf8"));
  const index = loadIndex("pve");
  const reads = index.endpoints.filter((e) => !e.writeOperation);

  function resolveParam(name, path) {
    switch (name) {
      case "node": return ctx.node;
      case "vmid": return path.includes("/lxc/") ? ctx.lxc[0]?.vmid : ctx.qemu[0]?.vmid;
      case "storage": return ctx.storages[0]?.storage;
      case "poolid": return ctx.pools[0];
      case "snapname": return path.includes("/lxc/") ? ctx.lxcSnap : ctx.qemuSnap;
      case "upid": return ctx.upid;
      case "volume": return ctx.volume;
      case "realm": return ctx.realms[0];
      case "userid": return ctx.users[0];
      case "roleid": return ctx.roles[0];
      case "groupid": return ctx.groups[0];
      case "service": return ctx.service;
      case "iface": return ctx.iface;
      case "pos": return 0;
      default: return undefined;
    }
  }

  const cases = [];
  const unreachable = [];
  for (const e of reads) {
    const spec = loadEndpointSpec("pve", e.operationId);
    const pp = {};
    let missing = null;
    for (const p of spec.pathParams) {
      const v = resolveParam(p.name, spec.path);
      if (v === undefined || v === null || v === "") { missing = p.name; break; }
      pp[p.name] = v;
    }
    // For nodes that the VM lives on, use the guest's actual node (cluster-correct).
    if (!missing && pp.vmid !== undefined) {
      const guest = (spec.path.includes("/lxc/") ? ctx.lxc : ctx.qemu).find((g) => g.vmid === pp.vmid);
      if (guest) pp.node = guest.node;
    }
    if (missing) unreachable.push({ operationId: e.operationId, path: e.path, missingParam: missing });
    else cases.push({ opId: e.operationId, path_params: pp });
  }

  writeFileSync(join(sourceDir, "livetest-plan.json"), JSON.stringify(cases, null, 2));
  writeFileSync(join(sourceDir, "livetest-unreachable.json"), JSON.stringify(unreachable, null, 2));

  // Partition into buckets for parallel agents.
  const bucketArrays = Array.from({ length: buckets }, () => []);
  cases.forEach((c, i) => bucketArrays[i % buckets].push(c));
  bucketArrays.forEach((b, i) => writeFileSync(join(sourceDir, `livetest-bucket-${i}.json`), JSON.stringify(b, null, 2)));

  console.log(`read endpoints:   ${reads.length}`);
  console.log(`testable cases:   ${cases.length}`);
  console.log(`unreachable:      ${unreachable.length} (path params not discoverable)`);
  console.log(`buckets:          ${buckets} (~${Math.ceil(cases.length / buckets)} each)`);
  const byMiss = {};
  for (const u of unreachable) byMiss[u.missingParam] = (byMiss[u.missingParam] || 0) + 1;
  console.log(`unreachable by missing param: ${JSON.stringify(byMiss)}`);
  process.exit(0);
}

// ── sweep ────────────────────────────────────────────────────────────────────
if (cmd === "sweep") {
  const casesFile = process.argv[3];
  const outFile = process.argv[4];
  const cases = JSON.parse(readFileSync(casesFile, "utf8"));
  const results = await pool(cases, (c) => callOp(c.opId, { path_params: c.path_params, params: c.params }), 8);
  if (outFile) writeFileSync(outFile, JSON.stringify(results, null, 2));
  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok);
  console.log(`cases: ${cases.length}  ok: ${ok}  fail: ${fail.length}`);
  for (const f of fail.slice(0, 30)) console.log(`  FAIL ${f.opId} (${f.method} ${f.path}): ${String(f.error).slice(0, 120)}`);
  if (fail.length > 30) console.log(`  ... and ${fail.length - 30} more failures`);
  process.exit(0);
}

// ── call ─────────────────────────────────────────────────────────────────────
if (cmd === "call") {
  const opId = process.argv[3];
  const args = process.argv[4] ? JSON.parse(process.argv[4]) : {};
  const r = await callOp(opId, { ...args, _keepData: true });
  console.log(JSON.stringify(r, null, 2));
  process.exit(0);
}

console.error("Unknown subcommand. Use: discover | plan | sweep | call");
process.exit(1);
