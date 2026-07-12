# Proxmox MCP Server

MCP server for **Proxmox VE** and **Proxmox Datacenter Manager (PDM)**, covering **every** API endpoint: **993** operations total behind **6 consolidated catalog-backed tools** rather than one tool per endpoint.

| Surface | Endpoints | Read (GET) | Write (POST/PUT/DELETE) | Tools |
|---------|-----------|------------|--------------------------|-------|
| **PVE** (`pve_*`) | 675 | 340 | 335 | `pve_list_endpoints` / `pve_describe_endpoint` / `pve_call_endpoint` |
| **PDM** (`pdm_*`) | 318 | 199 | 119 | `pdm_list_endpoints` / `pdm_describe_endpoint` / `pdm_call_endpoint` |

Every endpoint is **mapped, documented, and available** via the catalog. **Reads execute by default; writes are blocked unless explicitly enabled** via an environment variable (read-only safety gate). Destructive operations require an additional per-call `confirm:true`.

Each surface has its own catalog (`src/catalog-pve/`, `src/catalog-pdm/`) and its own credentials. Configure one or both.

## How it works

The catalog is the single source of truth, generated **deterministically** from Proxmox's own published API schema (`apidoc.js`): no field loss, no hand-maintenance.

1. `scripts/extract.mjs <pve|pdm>` flattens `apidoc.js`'s `apiSchema` tree into one faithful raw spec per `(method, path)` endpoint.
2. `scripts/assemble-catalog.mjs <pve|pdm>` derives `resource`, `category`, `destructive` flag, required-param flags, param routing (query vs body), and a request sample; writes the shippable `src/catalog-<surface>/endpoints/<operationId>.json` + `index.json`.

The six tools follow **discover, describe, call**:

| Tool | Purpose |
|------|---------|
| `<surface>_list_endpoints(category?, resource?, method?, reads_only?, writes_only?, search?, limit?)` | Discover endpoints (operationId, method, path, category, read/write, destructive). |
| `<surface>_describe_endpoint(operation_id)` | Full spec: path params, query/body params (types, formats, enums, constraints), response schema, required permissions, request sample, and any enrichment. |
| `<surface>_call_endpoint(operation_id, path_params?, params?, confirm?)` | Validates operationId + required path params, enforces the write gate, then executes. |

`operationId` = `<method>_<path>` lowercased with `{placeholders}`/punctuation collapsed to `_` (e.g. `get_nodes`, `post_nodes_node_qemu`, `delete_nodes_node_qemu_vmid_snapshot_snapname`). Unique across each surface (zero collisions).

## Setup

### Quick start (npx)

Add to your MCP client config (`.mcp.json` for Claude Code, `claude_desktop_config.json` for Claude Desktop):

```json
{
  "mcpServers": {
    "proxmox": {
      "command": "npx",
      "args": ["-y", "@nightsquawktech/proxmox-mcp-server"],
      "env": {
        "PVE_HOST": "pve.example.com",
        "PVE_TOKEN_ID": "root@pam!mcp",
        "PVE_TOKEN_SECRET": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "PVE_TLS_REJECT_UNAUTHORIZED": "false"
      }
    }
  }
}
```

Add the `PDM_*` equivalents to also configure a Proxmox Datacenter Manager instance. See `.mcp.example.json` for a full example.

### From source

```bash
npm install
npm run build
```

Then configure credentials (see `.env.example`) and point your MCP client at `dist/index.js`.

### Authentication

Create a Proxmox API token (Datacenter > Permissions > API Tokens). The PVE auth header is `PVEAPIToken=USER@REALM!TOKENID=SECRET`.

| Variable | Surface | Notes |
|----------|---------|-------|
| `PVE_HOST` / `PVE_BASE_URL` | PVE | `PVE_HOST` expands to `https://<host>:8006/api2/json`; or set the full `PVE_BASE_URL`. |
| `PVE_TOKEN_ID` | PVE | e.g. `root@pam!mcp` |
| `PVE_TOKEN_SECRET` | PVE | The token UUID |
| `PVE_TLS_REJECT_UNAUTHORIZED` | PVE | `false` to accept Proxmox's self-signed cert (default `true`) |
| `PVE_AUTH_SCHEME` / `PVE_AUTH_SEP` | PVE | Override the `PVEAPIToken` scheme / `=` separator if needed |
| `PDM_*` | PDM | Same keys with `PDM_` prefix; default port `8443`, scheme `PDMAPIToken` |

> **PDM note:** PDM is newer and its token scheme/separator may differ from PVE. If PDM auth fails, adjust `PDM_AUTH_SCHEME` / `PDM_AUTH_SEP` (or set the full `PDM_BASE_URL`), no code change required.

### Write gate (read-only by default)

Writes (`POST`/`PUT`/`DELETE`) are **blocked** unless enabled:

- `PROXMOX_ALLOW_WRITES=true` enables writes for all surfaces, **or**
- `PVE_ALLOW_WRITES=true` / `PDM_ALLOW_WRITES=true` per surface.

Even with writes enabled, endpoints flagged **destructive** (delete, stop, reset, reboot, suspend, rollback, destroy, wipe, migrate) require `confirm:true` on the `call` to execute.

## Regenerating the catalog

The shipped catalog lives committed under `src/catalog-pve/` and `src/catalog-pdm/`. The raw Proxmox API dumps under `_source/` are **gitignored**: they are re-downloadable inputs, regenerated via `npm run regen`. To refresh from a new Proxmox release:

```bash
# 1. Download the schema (or copy /usr/share/pve-docs/api-viewer/apidoc.js off a host)
#    PVE: https://pve.proxmox.com/pve-docs/api-viewer/apidoc.js  -> _source/pve-apidoc.js
#    PDM: https://pdm.proxmox.com/docs/api-viewer/apidoc.js      -> _source/pdm-apidoc.js
# 2. Regenerate
npm run regen   # = extract + assemble for both surfaces
npm run build
```

## Optional enrichment layer

`src/catalog-<surface>/enrichment/<operationId>.json` may add **additive-only** documentation (`usageNotes`, `examples`, `destructiveReason`, `tips`, `relatedOperations`) merged into `describe_endpoint` output. It never alters the authoritative structural fields (params/types/returns), which come straight from Proxmox.

## Architecture

Built on NightSquawk's catalog-backed meta-tool pattern (same as `@nightsquawktech/appfolio-mcp-server`): consolidated `list/describe/call` tools over a generated JSON catalog keep tool count tiny while indexing the entire API. TypeScript + `@modelcontextprotocol/sdk`, stdio transport, `undici` for TLS-configurable fetch.

## License

Licensed under the [GNU AGPL v3.0](./LICENSE). Free for personal and open-source use.

Organizations that cannot comply with the AGPL can purchase a commercial license. See [COMMERCIAL.md](./COMMERCIAL.md) or contact hello@nightsquawk.tech.
