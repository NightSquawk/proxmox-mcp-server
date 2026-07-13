# Proxmox MCP Server

[![npm version](https://img.shields.io/npm/v/@nightsquawktech/proxmox-mcp-server)](https://www.npmjs.com/package/@nightsquawktech/proxmox-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@nightsquawktech/proxmox-mcp-server)](https://www.npmjs.com/package/@nightsquawktech/proxmox-mcp-server)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/NightSquawk/proxmox-mcp-server/badge)](https://scorecard.dev/viewer/?uri=github.com/NightSquawk/proxmox-mcp-server)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)](https://github.com/NightSquawk/proxmox-mcp-server/blob/v1.0.0/LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

An MCP (Model Context Protocol) server for **Proxmox VE and Proxmox Datacenter Manager**, connecting your virtualization infrastructure to AI tools.

## Quick start

### Claude

[![Download for Claude Desktop](https://img.shields.io/badge/Claude_Desktop-Download_.mcpb-D97757?style=flat-square)](https://github.com/NightSquawk/proxmox-mcp-server/releases/download/mcpb-v0.1.0/proxmox-mcp-server-0.1.0.mcpb)

**bash (macOS/Linux):**

```bash
PVE_HOST="pve.example.com"
PVE_TOKEN_ID='root@pam!mcp'
PVE_TOKEN_SECRET="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
PVE_TLS_REJECT_UNAUTHORIZED="false"

claude mcp add proxmox \
  --env PVE_HOST="$PVE_HOST" \
  --env PVE_TOKEN_ID="$PVE_TOKEN_ID" \
  --env PVE_TOKEN_SECRET="$PVE_TOKEN_SECRET" \
  --env PVE_TLS_REJECT_UNAUTHORIZED="$PVE_TLS_REJECT_UNAUTHORIZED" \
  -- npx -y @nightsquawktech/proxmox-mcp-server
```

**PowerShell (Windows):**

```powershell
$PVE_HOST = "pve.example.com"
$PVE_TOKEN_ID = "root@pam!mcp"
$PVE_TOKEN_SECRET = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$PVE_TLS_REJECT_UNAUTHORIZED = "false"

claude mcp add proxmox `
  --env "PVE_HOST=$PVE_HOST" `
  --env "PVE_TOKEN_ID=$PVE_TOKEN_ID" `
  --env "PVE_TOKEN_SECRET=$PVE_TOKEN_SECRET" `
  --env "PVE_TLS_REJECT_UNAUTHORIZED=$PVE_TLS_REJECT_UNAUTHORIZED" `
  -- npx -y @nightsquawktech/proxmox-mcp-server
```

These examples configure the PVE surface. To also connect a Proxmox Datacenter Manager instance, add the `PDM_*` equivalents (full variable list in [mcp.json](#mcpjson)).

### Cursor

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=proxmox&config=eyJjb21tYW5kIjogIm5weCIsICJhcmdzIjogWyIteSIsICJAbmlnaHRzcXVhd2t0ZWNoL3Byb3htb3gtbWNwLXNlcnZlciJdLCAiZW52IjogeyJQVkVfSE9TVCI6ICJwdmUuZXhhbXBsZS5jb20iLCAiUFZFX0JBU0VfVVJMIjogImh0dHBzOi8vcHZlLmV4YW1wbGUuY29tOjgwMDYvYXBpMi9qc29uIiwgIlBWRV9UT0tFTl9JRCI6ICJyb290QHBhbSFtY3AiLCAiUFZFX1RPS0VOX1NFQ1JFVCI6ICJ4eHh4eHh4eC14eHh4LXh4eHgteHh4eC14eHh4eHh4eHh4eHgiLCAiUFZFX0FVVEhfU0NIRU1FIjogIlBWRUFQSVRva2VuIiwgIlBWRV9BVVRIX1NFUCI6ICI9IiwgIlBWRV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCI6ICJmYWxzZSIsICJQVkVfQUxMT1dfV1JJVEVTIjogImZhbHNlIiwgIlBETV9IT1NUIjogInBkbS5leGFtcGxlLmNvbSIsICJQRE1fQkFTRV9VUkwiOiAiaHR0cHM6Ly9wZG0uZXhhbXBsZS5jb206ODQ0My9hcGkyL2pzb24iLCAiUERNX1RPS0VOX0lEIjogInJvb3RAcGFtIW1jcCIsICJQRE1fVE9LRU5fU0VDUkVUIjogInh4eHh4eHh4LXh4eHgteHh4eC14eHh4LXh4eHh4eHh4eHh4eCIsICJQRE1fQVVUSF9TQ0hFTUUiOiAiUERNQVBJVG9rZW4iLCAiUERNX0FVVEhfU0VQIjogIj0iLCAiUERNX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEIjogImZhbHNlIiwgIlBETV9BTExPV19XUklURVMiOiAiZmFsc2UiLCAiUFJPWE1PWF9BTExPV19XUklURVMiOiAiZmFsc2UifX0%3D)

Or put the [mcp.json](#mcpjson) block in `.cursor/mcp.json`, then verify with:

```bash
agent mcp list
```

(The Cursor CLI manages configured servers but has no `mcp add`; install is via the button or `mcp.json`.)

### VS Code

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=proxmox&config=%7B%22command%22%3A%20%22npx%22%2C%20%22args%22%3A%20%5B%22-y%22%2C%20%22%40nightsquawktech/proxmox-mcp-server%22%5D%2C%20%22env%22%3A%20%7B%22PVE_HOST%22%3A%20%22pve.example.com%22%2C%20%22PVE_BASE_URL%22%3A%20%22https%3A//pve.example.com%3A8006/api2/json%22%2C%20%22PVE_TOKEN_ID%22%3A%20%22root%40pam%21mcp%22%2C%20%22PVE_TOKEN_SECRET%22%3A%20%22xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx%22%2C%20%22PVE_AUTH_SCHEME%22%3A%20%22PVEAPIToken%22%2C%20%22PVE_AUTH_SEP%22%3A%20%22%3D%22%2C%20%22PVE_TLS_REJECT_UNAUTHORIZED%22%3A%20%22false%22%2C%20%22PVE_ALLOW_WRITES%22%3A%20%22false%22%2C%20%22PDM_HOST%22%3A%20%22pdm.example.com%22%2C%20%22PDM_BASE_URL%22%3A%20%22https%3A//pdm.example.com%3A8443/api2/json%22%2C%20%22PDM_TOKEN_ID%22%3A%20%22root%40pam%21mcp%22%2C%20%22PDM_TOKEN_SECRET%22%3A%20%22xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx%22%2C%20%22PDM_AUTH_SCHEME%22%3A%20%22PDMAPIToken%22%2C%20%22PDM_AUTH_SEP%22%3A%20%22%3D%22%2C%20%22PDM_TLS_REJECT_UNAUTHORIZED%22%3A%20%22false%22%2C%20%22PDM_ALLOW_WRITES%22%3A%20%22false%22%2C%20%22PROXMOX_ALLOW_WRITES%22%3A%20%22false%22%7D%7D)

**bash (macOS/Linux):**

```bash
PVE_HOST="pve.example.com"
PVE_TOKEN_ID='root@pam!mcp'
PVE_TOKEN_SECRET="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
PVE_TLS_REJECT_UNAUTHORIZED="false"

code --add-mcp '{"name":"proxmox","command":"npx","args":["-y","@nightsquawktech/proxmox-mcp-server"],"env":{"PVE_HOST":"'"$PVE_HOST"'","PVE_TOKEN_ID":"'"$PVE_TOKEN_ID"'","PVE_TOKEN_SECRET":"'"$PVE_TOKEN_SECRET"'","PVE_TLS_REJECT_UNAUTHORIZED":"'"$PVE_TLS_REJECT_UNAUTHORIZED"'"}}'
```

**PowerShell (Windows):**

```powershell
$PVE_HOST = "pve.example.com"
$PVE_TOKEN_ID = "root@pam!mcp"
$PVE_TOKEN_SECRET = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$PVE_TLS_REJECT_UNAUTHORIZED = "false"

$config = @{
  name = "proxmox"
  command = "npx"
  args = @("-y", "@nightsquawktech/proxmox-mcp-server")
  env = @{
    PVE_HOST = $PVE_HOST
    PVE_TOKEN_ID = $PVE_TOKEN_ID
    PVE_TOKEN_SECRET = $PVE_TOKEN_SECRET
    PVE_TLS_REJECT_UNAUTHORIZED = $PVE_TLS_REJECT_UNAUTHORIZED
  }
} | ConvertTo-Json -Compress

code --add-mcp $config
```

### Codex

**bash (macOS/Linux):**

```bash
PVE_HOST="pve.example.com"
PVE_TOKEN_ID='root@pam!mcp'
PVE_TOKEN_SECRET="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
PVE_TLS_REJECT_UNAUTHORIZED="false"

codex mcp add proxmox \
  --env PVE_HOST="$PVE_HOST" \
  --env PVE_TOKEN_ID="$PVE_TOKEN_ID" \
  --env PVE_TOKEN_SECRET="$PVE_TOKEN_SECRET" \
  --env PVE_TLS_REJECT_UNAUTHORIZED="$PVE_TLS_REJECT_UNAUTHORIZED" \
  -- npx -y @nightsquawktech/proxmox-mcp-server
```

**PowerShell (Windows):**

```powershell
$PVE_HOST = "pve.example.com"
$PVE_TOKEN_ID = "root@pam!mcp"
$PVE_TOKEN_SECRET = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$PVE_TLS_REJECT_UNAUTHORIZED = "false"

codex mcp add proxmox `
  --env "PVE_HOST=$PVE_HOST" `
  --env "PVE_TOKEN_ID=$PVE_TOKEN_ID" `
  --env "PVE_TOKEN_SECRET=$PVE_TOKEN_SECRET" `
  --env "PVE_TLS_REJECT_UNAUTHORIZED=$PVE_TLS_REJECT_UNAUTHORIZED" `
  -- npx -y @nightsquawktech/proxmox-mcp-server
```

Or add it to `~/.codex/config.toml` under `[mcp_servers.proxmox]`.

### mcp.json

Every environment variable the server reads, with recommended values. Both surfaces are optional: configure PVE, PDM, or both. Tools for an unconfigured surface error only at call time; the catalog still lists and describes every endpoint regardless.

```json
{
  "mcpServers": {
    "proxmox": {
      "command": "npx",
      "args": ["-y", "@nightsquawktech/proxmox-mcp-server"],
      "env": {
        "PVE_HOST": "pve.example.com",
        "PVE_BASE_URL": "https://pve.example.com:8006/api2/json",
        "PVE_TOKEN_ID": "root@pam!mcp",
        "PVE_TOKEN_SECRET": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "PVE_AUTH_SCHEME": "PVEAPIToken",
        "PVE_AUTH_SEP": "=",
        "PVE_TLS_REJECT_UNAUTHORIZED": "false",
        "PVE_ALLOW_WRITES": "false",
        "PDM_HOST": "pdm.example.com",
        "PDM_BASE_URL": "https://pdm.example.com:8443/api2/json",
        "PDM_TOKEN_ID": "root@pam!mcp",
        "PDM_TOKEN_SECRET": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "PDM_AUTH_SCHEME": "PDMAPIToken",
        "PDM_AUTH_SEP": "=",
        "PDM_TLS_REJECT_UNAUTHORIZED": "false",
        "PDM_ALLOW_WRITES": "false",
        "PROXMOX_ALLOW_WRITES": "false"
      }
    }
  }
}
```

File locations: `.mcp.json` in your project root (Claude Code), `claude_desktop_config.json` (Claude Desktop), `.cursor/mcp.json` (Cursor).

## Configuration

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PVE_HOST` | for PVE | | Proxmox VE hostname; expands to `https://<host>:8006/api2/json` |
| `PVE_BASE_URL` | no | derived from `PVE_HOST` | Full PVE API base URL; overrides `PVE_HOST` when set |
| `PVE_TOKEN_ID` | for PVE | | PVE API token id, e.g. `root@pam!mcp` |
| `PVE_TOKEN_SECRET` | for PVE | | PVE API token secret (UUID shown once at token creation) |
| `PVE_AUTH_SCHEME` | no | `PVEAPIToken` | Auth header scheme override |
| `PVE_AUTH_SEP` | no | `=` | Separator between token id and secret in the auth header |
| `PVE_TLS_REJECT_UNAUTHORIZED` | no | `true` | Set `false` to accept Proxmox's default self-signed cert |
| `PVE_ALLOW_WRITES` | no | `false` | Enables write operations (POST/PUT/DELETE) on the PVE surface |
| `PDM_HOST` | for PDM | | Proxmox Datacenter Manager hostname; expands to `https://<host>:8443/api2/json` |
| `PDM_BASE_URL` | no | derived from `PDM_HOST` | Full PDM API base URL; overrides `PDM_HOST` when set |
| `PDM_TOKEN_ID` | for PDM | | PDM API token id |
| `PDM_TOKEN_SECRET` | for PDM | | PDM API token secret |
| `PDM_AUTH_SCHEME` | no | `PDMAPIToken` | Auth header scheme override (PDM is newer; adjust if auth fails) |
| `PDM_AUTH_SEP` | no | `=` | Separator between token id and secret in the auth header |
| `PDM_TLS_REJECT_UNAUTHORIZED` | no | `true` | Set `false` to accept a self-signed cert |
| `PDM_ALLOW_WRITES` | no | `false` | Enables write operations on the PDM surface |
| `PROXMOX_ALLOW_WRITES` | no | `false` | Enables write operations on all surfaces |

Each surface needs its host plus token id and secret; everything else has a working default. The auth header is assembled as `<scheme>=<token_id><sep><secret>`, e.g. `PVEAPIToken=root@pam!mcp=SECRET`.

## Security & write safety

Proxmox credentials: create a dedicated API token (Datacenter > Permissions > API Tokens) and grant it the least privilege you can. For hard read-only, assign the token the built-in `PVEAuditor` role.

- All write operations (POST/PUT/DELETE) are **disabled by default**. Set `PROXMOX_ALLOW_WRITES=true` (all surfaces) or `PVE_ALLOW_WRITES=true` / `PDM_ALLOW_WRITES=true` (per surface) to enable them.
- Endpoints flagged **destructive** (delete, stop, reset, reboot, suspend, rollback, destroy, wipe, migrate) additionally require `confirm: true` on the individual `call_endpoint` call, even when writes are enabled.
- Every call validates the operation id and required path parameters against the catalog before any request leaves your machine; requests go directly to your Proxmox host, nothing passes through third parties.

> [!IMPORTANT]
> The write gate is a guardrail, not a security boundary. The env vars in your MCP config are real credentials, and an AI agent with shell access can bypass the MCP tools and call the Proxmox API directly with them. If you need hard read-only, enforce it at the source: scope the API token itself to read-only permissions (`PVEAuditor` role).

## Tools

Instead of one tool per endpoint, the server exposes each surface through a catalog-backed list/describe/call triple built on [mcp-core](https://github.com/NightSquawk/mcp-core): `list_endpoints` discovers operations by category, resource, method, or search term; `describe_endpoint` returns the full parameter and response spec for one operation; `call_endpoint` validates the call against the catalog, enforces the write gate, and executes it. Six tools index all 993 endpoints.

```
pve_list_endpoints        Discover Proxmox VE endpoints by category, resource, method, or search
pve_describe_endpoint     Full param + response spec for one PVE endpoint
pve_call_endpoint         Validate, write-gate, and execute a PVE API call
pdm_list_endpoints        Discover Proxmox Datacenter Manager endpoints
pdm_describe_endpoint     Full param + response spec for one PDM endpoint
pdm_call_endpoint         Validate, write-gate, and execute a PDM API call
```

## API coverage

<!-- GENERATED SECTION: do not edit by hand. Regenerate from the catalog with scripts/generate-api-coverage.mjs whenever the catalog changes. -->

993 operations covered: 675 Proxmox VE (PVE) + 318 Proxmox Datacenter Manager (PDM).

| Surface | Category | Operations |
|---|---|---|
| PVE | Access & Auth | 45 |
| PVE | Cluster | 259 |
| PVE | Nodes & Guests | 358 |
| PVE | Pools | 7 |
| PVE | Storage | 5 |
| PVE | System | 1 |
| PDM | Access & Auth | 28 |
| PDM | Auto Install | 14 |
| PDM | Ceph | 12 |
| PDM | Configuration | 43 |
| PDM | Nodes & Guests | 50 |
| PDM | PBS Remotes | 27 |
| PDM | PVE Remotes | 93 |
| PDM | Ping | 1 |
| PDM | Remotes | 19 |
| PDM | Resources | 6 |
| PDM | Root | 1 |
| PDM | SDN | 6 |
| PDM | Subscriptions | 17 |
| PDM | System | 1 |

### Proxmox VE (675 operations)

<details>
<summary><strong>PVE: Access & Auth</strong> (45 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/access` | `get_access` |
| GET | `/access/acl` | `get_access_acl` |
| PUT | `/access/acl` | `put_access_acl` |
| GET | `/access/domains` | `get_access_domains` |
| POST | `/access/domains` | `post_access_domains` |
| DELETE | `/access/domains/{realm}` | `delete_access_domains_realm` |
| GET | `/access/domains/{realm}` | `get_access_domains_realm` |
| PUT | `/access/domains/{realm}` | `put_access_domains_realm` |
| POST | `/access/domains/{realm}/sync` | `post_access_domains_realm_sync` |
| GET | `/access/groups` | `get_access_groups` |
| POST | `/access/groups` | `post_access_groups` |
| DELETE | `/access/groups/{groupid}` | `delete_access_groups_groupid` |
| GET | `/access/groups/{groupid}` | `get_access_groups_groupid` |
| PUT | `/access/groups/{groupid}` | `put_access_groups_groupid` |
| GET | `/access/openid` | `get_access_openid` |
| POST | `/access/openid/auth-url` | `post_access_openid_auth_url` |
| POST | `/access/openid/login` | `post_access_openid_login` |
| PUT | `/access/password` | `put_access_password` |
| GET | `/access/permissions` | `get_access_permissions` |
| GET | `/access/roles` | `get_access_roles` |
| POST | `/access/roles` | `post_access_roles` |
| DELETE | `/access/roles/{roleid}` | `delete_access_roles_roleid` |
| GET | `/access/roles/{roleid}` | `get_access_roles_roleid` |
| PUT | `/access/roles/{roleid}` | `put_access_roles_roleid` |
| GET | `/access/tfa` | `get_access_tfa` |
| GET | `/access/tfa/{userid}` | `get_access_tfa_userid` |
| POST | `/access/tfa/{userid}` | `post_access_tfa_userid` |
| DELETE | `/access/tfa/{userid}/{id}` | `delete_access_tfa_userid_id` |
| GET | `/access/tfa/{userid}/{id}` | `get_access_tfa_userid_id` |
| PUT | `/access/tfa/{userid}/{id}` | `put_access_tfa_userid_id` |
| GET | `/access/ticket` | `get_access_ticket` |
| POST | `/access/ticket` | `post_access_ticket` |
| GET | `/access/users` | `get_access_users` |
| POST | `/access/users` | `post_access_users` |
| DELETE | `/access/users/{userid}` | `delete_access_users_userid` |
| GET | `/access/users/{userid}` | `get_access_users_userid` |
| PUT | `/access/users/{userid}` | `put_access_users_userid` |
| GET | `/access/users/{userid}/tfa` | `get_access_users_userid_tfa` |
| GET | `/access/users/{userid}/token` | `get_access_users_userid_token` |
| DELETE | `/access/users/{userid}/token/{tokenid}` | `delete_access_users_userid_token_tokenid` |
| GET | `/access/users/{userid}/token/{tokenid}` | `get_access_users_userid_token_tokenid` |
| POST | `/access/users/{userid}/token/{tokenid}` | `post_access_users_userid_token_tokenid` |
| PUT | `/access/users/{userid}/token/{tokenid}` | `put_access_users_userid_token_tokenid` |
| PUT | `/access/users/{userid}/unlock-tfa` | `put_access_users_userid_unlock_tfa` |
| POST | `/access/vncticket` | `post_access_vncticket` |

</details>

<details>
<summary><strong>PVE: Cluster</strong> (259 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/cluster` | `get_cluster` |
| GET | `/cluster/acme` | `get_cluster_acme` |
| GET | `/cluster/acme/account` | `get_cluster_acme_account` |
| POST | `/cluster/acme/account` | `post_cluster_acme_account` |
| DELETE | `/cluster/acme/account/{name}` | `delete_cluster_acme_account_name` |
| GET | `/cluster/acme/account/{name}` | `get_cluster_acme_account_name` |
| PUT | `/cluster/acme/account/{name}` | `put_cluster_acme_account_name` |
| GET | `/cluster/acme/challenge-schema` | `get_cluster_acme_challenge_schema` |
| GET | `/cluster/acme/directories` | `get_cluster_acme_directories` |
| GET | `/cluster/acme/meta` | `get_cluster_acme_meta` |
| GET | `/cluster/acme/plugins` | `get_cluster_acme_plugins` |
| POST | `/cluster/acme/plugins` | `post_cluster_acme_plugins` |
| DELETE | `/cluster/acme/plugins/{id}` | `delete_cluster_acme_plugins_id` |
| GET | `/cluster/acme/plugins/{id}` | `get_cluster_acme_plugins_id` |
| PUT | `/cluster/acme/plugins/{id}` | `put_cluster_acme_plugins_id` |
| GET | `/cluster/acme/tos` | `get_cluster_acme_tos` |
| GET | `/cluster/backup` | `get_cluster_backup` |
| POST | `/cluster/backup` | `post_cluster_backup` |
| GET | `/cluster/backup-info` | `get_cluster_backup_info` |
| GET | `/cluster/backup-info/not-backed-up` | `get_cluster_backup_info_not_backed_up` |
| DELETE | `/cluster/backup/{id}` | `delete_cluster_backup_id` |
| GET | `/cluster/backup/{id}` | `get_cluster_backup_id` |
| PUT | `/cluster/backup/{id}` | `put_cluster_backup_id` |
| GET | `/cluster/backup/{id}/included_volumes` | `get_cluster_backup_id_included_volumes` |
| GET | `/cluster/bulk-action` | `get_cluster_bulk_action` |
| GET | `/cluster/bulk-action/guest` | `get_cluster_bulk_action_guest` |
| POST | `/cluster/bulk-action/guest/migrate` | `post_cluster_bulk_action_guest_migrate` |
| POST | `/cluster/bulk-action/guest/shutdown` | `post_cluster_bulk_action_guest_shutdown` |
| POST | `/cluster/bulk-action/guest/start` | `post_cluster_bulk_action_guest_start` |
| POST | `/cluster/bulk-action/guest/suspend` | `post_cluster_bulk_action_guest_suspend` |
| GET | `/cluster/ceph` | `get_cluster_ceph` |
| GET | `/cluster/ceph/flags` | `get_cluster_ceph_flags` |
| PUT | `/cluster/ceph/flags` | `put_cluster_ceph_flags` |
| GET | `/cluster/ceph/flags/{flag}` | `get_cluster_ceph_flags_flag` |
| PUT | `/cluster/ceph/flags/{flag}` | `put_cluster_ceph_flags_flag` |
| GET | `/cluster/ceph/metadata` | `get_cluster_ceph_metadata` |
| GET | `/cluster/ceph/status` | `get_cluster_ceph_status` |
| GET | `/cluster/config` | `get_cluster_config` |
| POST | `/cluster/config` | `post_cluster_config` |
| GET | `/cluster/config/apiversion` | `get_cluster_config_apiversion` |
| GET | `/cluster/config/join` | `get_cluster_config_join` |
| POST | `/cluster/config/join` | `post_cluster_config_join` |
| GET | `/cluster/config/nodes` | `get_cluster_config_nodes` |
| DELETE | `/cluster/config/nodes/{node}` | `delete_cluster_config_nodes_node` |
| POST | `/cluster/config/nodes/{node}` | `post_cluster_config_nodes_node` |
| GET | `/cluster/config/qdevice` | `get_cluster_config_qdevice` |
| GET | `/cluster/config/totem` | `get_cluster_config_totem` |
| GET | `/cluster/firewall` | `get_cluster_firewall` |
| GET | `/cluster/firewall/aliases` | `get_cluster_firewall_aliases` |
| POST | `/cluster/firewall/aliases` | `post_cluster_firewall_aliases` |
| DELETE | `/cluster/firewall/aliases/{name}` | `delete_cluster_firewall_aliases_name` |
| GET | `/cluster/firewall/aliases/{name}` | `get_cluster_firewall_aliases_name` |
| PUT | `/cluster/firewall/aliases/{name}` | `put_cluster_firewall_aliases_name` |
| GET | `/cluster/firewall/groups` | `get_cluster_firewall_groups` |
| POST | `/cluster/firewall/groups` | `post_cluster_firewall_groups` |
| DELETE | `/cluster/firewall/groups/{group}` | `delete_cluster_firewall_groups_group` |
| GET | `/cluster/firewall/groups/{group}` | `get_cluster_firewall_groups_group` |
| POST | `/cluster/firewall/groups/{group}` | `post_cluster_firewall_groups_group` |
| DELETE | `/cluster/firewall/groups/{group}/{pos}` | `delete_cluster_firewall_groups_group_pos` |
| GET | `/cluster/firewall/groups/{group}/{pos}` | `get_cluster_firewall_groups_group_pos` |
| PUT | `/cluster/firewall/groups/{group}/{pos}` | `put_cluster_firewall_groups_group_pos` |
| GET | `/cluster/firewall/ipset` | `get_cluster_firewall_ipset` |
| POST | `/cluster/firewall/ipset` | `post_cluster_firewall_ipset` |
| DELETE | `/cluster/firewall/ipset/{name}` | `delete_cluster_firewall_ipset_name` |
| GET | `/cluster/firewall/ipset/{name}` | `get_cluster_firewall_ipset_name` |
| POST | `/cluster/firewall/ipset/{name}` | `post_cluster_firewall_ipset_name` |
| DELETE | `/cluster/firewall/ipset/{name}/{cidr}` | `delete_cluster_firewall_ipset_name_cidr` |
| GET | `/cluster/firewall/ipset/{name}/{cidr}` | `get_cluster_firewall_ipset_name_cidr` |
| PUT | `/cluster/firewall/ipset/{name}/{cidr}` | `put_cluster_firewall_ipset_name_cidr` |
| GET | `/cluster/firewall/macros` | `get_cluster_firewall_macros` |
| GET | `/cluster/firewall/options` | `get_cluster_firewall_options` |
| PUT | `/cluster/firewall/options` | `put_cluster_firewall_options` |
| GET | `/cluster/firewall/refs` | `get_cluster_firewall_refs` |
| GET | `/cluster/firewall/rules` | `get_cluster_firewall_rules` |
| POST | `/cluster/firewall/rules` | `post_cluster_firewall_rules` |
| DELETE | `/cluster/firewall/rules/{pos}` | `delete_cluster_firewall_rules_pos` |
| GET | `/cluster/firewall/rules/{pos}` | `get_cluster_firewall_rules_pos` |
| PUT | `/cluster/firewall/rules/{pos}` | `put_cluster_firewall_rules_pos` |
| GET | `/cluster/ha` | `get_cluster_ha` |
| GET | `/cluster/ha/groups` | `get_cluster_ha_groups` |
| POST | `/cluster/ha/groups` | `post_cluster_ha_groups` |
| DELETE | `/cluster/ha/groups/{group}` | `delete_cluster_ha_groups_group` |
| GET | `/cluster/ha/groups/{group}` | `get_cluster_ha_groups_group` |
| PUT | `/cluster/ha/groups/{group}` | `put_cluster_ha_groups_group` |
| GET | `/cluster/ha/resources` | `get_cluster_ha_resources` |
| POST | `/cluster/ha/resources` | `post_cluster_ha_resources` |
| DELETE | `/cluster/ha/resources/{sid}` | `delete_cluster_ha_resources_sid` |
| GET | `/cluster/ha/resources/{sid}` | `get_cluster_ha_resources_sid` |
| PUT | `/cluster/ha/resources/{sid}` | `put_cluster_ha_resources_sid` |
| POST | `/cluster/ha/resources/{sid}/migrate` | `post_cluster_ha_resources_sid_migrate` |
| POST | `/cluster/ha/resources/{sid}/relocate` | `post_cluster_ha_resources_sid_relocate` |
| GET | `/cluster/ha/rules` | `get_cluster_ha_rules` |
| POST | `/cluster/ha/rules` | `post_cluster_ha_rules` |
| DELETE | `/cluster/ha/rules/{rule}` | `delete_cluster_ha_rules_rule` |
| GET | `/cluster/ha/rules/{rule}` | `get_cluster_ha_rules_rule` |
| PUT | `/cluster/ha/rules/{rule}` | `put_cluster_ha_rules_rule` |
| GET | `/cluster/ha/status` | `get_cluster_ha_status` |
| POST | `/cluster/ha/status/arm-ha` | `post_cluster_ha_status_arm_ha` |
| GET | `/cluster/ha/status/current` | `get_cluster_ha_status_current` |
| POST | `/cluster/ha/status/disarm-ha` | `post_cluster_ha_status_disarm_ha` |
| GET | `/cluster/ha/status/manager_status` | `get_cluster_ha_status_manager_status` |
| GET | `/cluster/jobs` | `get_cluster_jobs` |
| GET | `/cluster/jobs/realm-sync` | `get_cluster_jobs_realm_sync` |
| DELETE | `/cluster/jobs/realm-sync/{id}` | `delete_cluster_jobs_realm_sync_id` |
| GET | `/cluster/jobs/realm-sync/{id}` | `get_cluster_jobs_realm_sync_id` |
| POST | `/cluster/jobs/realm-sync/{id}` | `post_cluster_jobs_realm_sync_id` |
| PUT | `/cluster/jobs/realm-sync/{id}` | `put_cluster_jobs_realm_sync_id` |
| GET | `/cluster/jobs/schedule-analyze` | `get_cluster_jobs_schedule_analyze` |
| GET | `/cluster/log` | `get_cluster_log` |
| GET | `/cluster/mapping` | `get_cluster_mapping` |
| GET | `/cluster/mapping/dir` | `get_cluster_mapping_dir` |
| POST | `/cluster/mapping/dir` | `post_cluster_mapping_dir` |
| DELETE | `/cluster/mapping/dir/{id}` | `delete_cluster_mapping_dir_id` |
| GET | `/cluster/mapping/dir/{id}` | `get_cluster_mapping_dir_id` |
| PUT | `/cluster/mapping/dir/{id}` | `put_cluster_mapping_dir_id` |
| GET | `/cluster/mapping/pci` | `get_cluster_mapping_pci` |
| POST | `/cluster/mapping/pci` | `post_cluster_mapping_pci` |
| DELETE | `/cluster/mapping/pci/{id}` | `delete_cluster_mapping_pci_id` |
| GET | `/cluster/mapping/pci/{id}` | `get_cluster_mapping_pci_id` |
| PUT | `/cluster/mapping/pci/{id}` | `put_cluster_mapping_pci_id` |
| GET | `/cluster/mapping/usb` | `get_cluster_mapping_usb` |
| POST | `/cluster/mapping/usb` | `post_cluster_mapping_usb` |
| DELETE | `/cluster/mapping/usb/{id}` | `delete_cluster_mapping_usb_id` |
| GET | `/cluster/mapping/usb/{id}` | `get_cluster_mapping_usb_id` |
| PUT | `/cluster/mapping/usb/{id}` | `put_cluster_mapping_usb_id` |
| GET | `/cluster/metrics` | `get_cluster_metrics` |
| GET | `/cluster/metrics/export` | `get_cluster_metrics_export` |
| GET | `/cluster/metrics/server` | `get_cluster_metrics_server` |
| DELETE | `/cluster/metrics/server/{id}` | `delete_cluster_metrics_server_id` |
| GET | `/cluster/metrics/server/{id}` | `get_cluster_metrics_server_id` |
| POST | `/cluster/metrics/server/{id}` | `post_cluster_metrics_server_id` |
| PUT | `/cluster/metrics/server/{id}` | `put_cluster_metrics_server_id` |
| GET | `/cluster/nextid` | `get_cluster_nextid` |
| GET | `/cluster/notifications` | `get_cluster_notifications` |
| GET | `/cluster/notifications/endpoints` | `get_cluster_notifications_endpoints` |
| GET | `/cluster/notifications/endpoints/gotify` | `get_cluster_notifications_endpoints_gotify` |
| POST | `/cluster/notifications/endpoints/gotify` | `post_cluster_notifications_endpoints_gotify` |
| DELETE | `/cluster/notifications/endpoints/gotify/{name}` | `delete_cluster_notifications_endpoints_gotify_name` |
| GET | `/cluster/notifications/endpoints/gotify/{name}` | `get_cluster_notifications_endpoints_gotify_name` |
| PUT | `/cluster/notifications/endpoints/gotify/{name}` | `put_cluster_notifications_endpoints_gotify_name` |
| GET | `/cluster/notifications/endpoints/sendmail` | `get_cluster_notifications_endpoints_sendmail` |
| POST | `/cluster/notifications/endpoints/sendmail` | `post_cluster_notifications_endpoints_sendmail` |
| DELETE | `/cluster/notifications/endpoints/sendmail/{name}` | `delete_cluster_notifications_endpoints_sendmail_name` |
| GET | `/cluster/notifications/endpoints/sendmail/{name}` | `get_cluster_notifications_endpoints_sendmail_name` |
| PUT | `/cluster/notifications/endpoints/sendmail/{name}` | `put_cluster_notifications_endpoints_sendmail_name` |
| GET | `/cluster/notifications/endpoints/smtp` | `get_cluster_notifications_endpoints_smtp` |
| POST | `/cluster/notifications/endpoints/smtp` | `post_cluster_notifications_endpoints_smtp` |
| DELETE | `/cluster/notifications/endpoints/smtp/{name}` | `delete_cluster_notifications_endpoints_smtp_name` |
| GET | `/cluster/notifications/endpoints/smtp/{name}` | `get_cluster_notifications_endpoints_smtp_name` |
| PUT | `/cluster/notifications/endpoints/smtp/{name}` | `put_cluster_notifications_endpoints_smtp_name` |
| GET | `/cluster/notifications/endpoints/webhook` | `get_cluster_notifications_endpoints_webhook` |
| POST | `/cluster/notifications/endpoints/webhook` | `post_cluster_notifications_endpoints_webhook` |
| DELETE | `/cluster/notifications/endpoints/webhook/{name}` | `delete_cluster_notifications_endpoints_webhook_name` |
| GET | `/cluster/notifications/endpoints/webhook/{name}` | `get_cluster_notifications_endpoints_webhook_name` |
| PUT | `/cluster/notifications/endpoints/webhook/{name}` | `put_cluster_notifications_endpoints_webhook_name` |
| GET | `/cluster/notifications/matcher-field-values` | `get_cluster_notifications_matcher_field_values` |
| GET | `/cluster/notifications/matcher-fields` | `get_cluster_notifications_matcher_fields` |
| GET | `/cluster/notifications/matchers` | `get_cluster_notifications_matchers` |
| POST | `/cluster/notifications/matchers` | `post_cluster_notifications_matchers` |
| DELETE | `/cluster/notifications/matchers/{name}` | `delete_cluster_notifications_matchers_name` |
| GET | `/cluster/notifications/matchers/{name}` | `get_cluster_notifications_matchers_name` |
| PUT | `/cluster/notifications/matchers/{name}` | `put_cluster_notifications_matchers_name` |
| GET | `/cluster/notifications/targets` | `get_cluster_notifications_targets` |
| POST | `/cluster/notifications/targets/{name}/test` | `post_cluster_notifications_targets_name_test` |
| GET | `/cluster/options` | `get_cluster_options` |
| PUT | `/cluster/options` | `put_cluster_options` |
| GET | `/cluster/qemu` | `get_cluster_qemu` |
| GET | `/cluster/qemu/cpu-flags` | `get_cluster_qemu_cpu_flags` |
| GET | `/cluster/qemu/custom-cpu-models` | `get_cluster_qemu_custom_cpu_models` |
| POST | `/cluster/qemu/custom-cpu-models` | `post_cluster_qemu_custom_cpu_models` |
| DELETE | `/cluster/qemu/custom-cpu-models/{cputype}` | `delete_cluster_qemu_custom_cpu_models_cputype` |
| GET | `/cluster/qemu/custom-cpu-models/{cputype}` | `get_cluster_qemu_custom_cpu_models_cputype` |
| PUT | `/cluster/qemu/custom-cpu-models/{cputype}` | `put_cluster_qemu_custom_cpu_models_cputype` |
| GET | `/cluster/replication` | `get_cluster_replication` |
| POST | `/cluster/replication` | `post_cluster_replication` |
| DELETE | `/cluster/replication/{id}` | `delete_cluster_replication_id` |
| GET | `/cluster/replication/{id}` | `get_cluster_replication_id` |
| PUT | `/cluster/replication/{id}` | `put_cluster_replication_id` |
| GET | `/cluster/resources` | `get_cluster_resources` |
| GET | `/cluster/sdn` | `get_cluster_sdn` |
| PUT | `/cluster/sdn` | `put_cluster_sdn` |
| GET | `/cluster/sdn/controllers` | `get_cluster_sdn_controllers` |
| POST | `/cluster/sdn/controllers` | `post_cluster_sdn_controllers` |
| DELETE | `/cluster/sdn/controllers/{controller}` | `delete_cluster_sdn_controllers_controller` |
| GET | `/cluster/sdn/controllers/{controller}` | `get_cluster_sdn_controllers_controller` |
| PUT | `/cluster/sdn/controllers/{controller}` | `put_cluster_sdn_controllers_controller` |
| GET | `/cluster/sdn/dns` | `get_cluster_sdn_dns` |
| POST | `/cluster/sdn/dns` | `post_cluster_sdn_dns` |
| DELETE | `/cluster/sdn/dns/{dns}` | `delete_cluster_sdn_dns_dns` |
| GET | `/cluster/sdn/dns/{dns}` | `get_cluster_sdn_dns_dns` |
| PUT | `/cluster/sdn/dns/{dns}` | `put_cluster_sdn_dns_dns` |
| GET | `/cluster/sdn/dry-run` | `get_cluster_sdn_dry_run` |
| GET | `/cluster/sdn/fabrics` | `get_cluster_sdn_fabrics` |
| GET | `/cluster/sdn/fabrics/all` | `get_cluster_sdn_fabrics_all` |
| GET | `/cluster/sdn/fabrics/fabric` | `get_cluster_sdn_fabrics_fabric` |
| POST | `/cluster/sdn/fabrics/fabric` | `post_cluster_sdn_fabrics_fabric` |
| DELETE | `/cluster/sdn/fabrics/fabric/{id}` | `delete_cluster_sdn_fabrics_fabric_id` |
| GET | `/cluster/sdn/fabrics/fabric/{id}` | `get_cluster_sdn_fabrics_fabric_id` |
| PUT | `/cluster/sdn/fabrics/fabric/{id}` | `put_cluster_sdn_fabrics_fabric_id` |
| GET | `/cluster/sdn/fabrics/node` | `get_cluster_sdn_fabrics_node` |
| GET | `/cluster/sdn/fabrics/node/{fabric_id}` | `get_cluster_sdn_fabrics_node_fabric_id` |
| POST | `/cluster/sdn/fabrics/node/{fabric_id}` | `post_cluster_sdn_fabrics_node_fabric_id` |
| DELETE | `/cluster/sdn/fabrics/node/{fabric_id}/{node_id}` | `delete_cluster_sdn_fabrics_node_fabric_id_node_id` |
| GET | `/cluster/sdn/fabrics/node/{fabric_id}/{node_id}` | `get_cluster_sdn_fabrics_node_fabric_id_node_id` |
| PUT | `/cluster/sdn/fabrics/node/{fabric_id}/{node_id}` | `put_cluster_sdn_fabrics_node_fabric_id_node_id` |
| GET | `/cluster/sdn/ipams` | `get_cluster_sdn_ipams` |
| POST | `/cluster/sdn/ipams` | `post_cluster_sdn_ipams` |
| DELETE | `/cluster/sdn/ipams/{ipam}` | `delete_cluster_sdn_ipams_ipam` |
| GET | `/cluster/sdn/ipams/{ipam}` | `get_cluster_sdn_ipams_ipam` |
| PUT | `/cluster/sdn/ipams/{ipam}` | `put_cluster_sdn_ipams_ipam` |
| GET | `/cluster/sdn/ipams/{ipam}/status` | `get_cluster_sdn_ipams_ipam_status` |
| DELETE | `/cluster/sdn/lock` | `delete_cluster_sdn_lock` |
| POST | `/cluster/sdn/lock` | `post_cluster_sdn_lock` |
| GET | `/cluster/sdn/prefix-lists` | `get_cluster_sdn_prefix_lists` |
| POST | `/cluster/sdn/prefix-lists` | `post_cluster_sdn_prefix_lists` |
| DELETE | `/cluster/sdn/prefix-lists/{id}` | `delete_cluster_sdn_prefix_lists_id` |
| GET | `/cluster/sdn/prefix-lists/{id}` | `get_cluster_sdn_prefix_lists_id` |
| PUT | `/cluster/sdn/prefix-lists/{id}` | `put_cluster_sdn_prefix_lists_id` |
| GET | `/cluster/sdn/prefix-lists/{id}/entries` | `get_cluster_sdn_prefix_lists_id_entries` |
| POST | `/cluster/sdn/prefix-lists/{id}/entries` | `post_cluster_sdn_prefix_lists_id_entries` |
| DELETE | `/cluster/sdn/prefix-lists/{id}/entries/{url_seq}` | `delete_cluster_sdn_prefix_lists_id_entries_url_seq` |
| GET | `/cluster/sdn/prefix-lists/{id}/entries/{url_seq}` | `get_cluster_sdn_prefix_lists_id_entries_url_seq` |
| PUT | `/cluster/sdn/prefix-lists/{id}/entries/{url_seq}` | `put_cluster_sdn_prefix_lists_id_entries_url_seq` |
| POST | `/cluster/sdn/rollback` | `post_cluster_sdn_rollback` |
| GET | `/cluster/sdn/route-maps` | `get_cluster_sdn_route_maps` |
| GET | `/cluster/sdn/route-maps/entries` | `get_cluster_sdn_route_maps_entries` |
| POST | `/cluster/sdn/route-maps/entries` | `post_cluster_sdn_route_maps_entries` |
| GET | `/cluster/sdn/route-maps/entries/{route-map-id}` | `get_cluster_sdn_route_maps_entries_route_map_id` |
| DELETE | `/cluster/sdn/route-maps/entries/{route-map-id}/entry/{order}` | `delete_cluster_sdn_route_maps_entries_route_map_id_entry_order` |
| GET | `/cluster/sdn/route-maps/entries/{route-map-id}/entry/{order}` | `get_cluster_sdn_route_maps_entries_route_map_id_entry_order` |
| PUT | `/cluster/sdn/route-maps/entries/{route-map-id}/entry/{order}` | `put_cluster_sdn_route_maps_entries_route_map_id_entry_order` |
| GET | `/cluster/sdn/vnets` | `get_cluster_sdn_vnets` |
| POST | `/cluster/sdn/vnets` | `post_cluster_sdn_vnets` |
| DELETE | `/cluster/sdn/vnets/{vnet}` | `delete_cluster_sdn_vnets_vnet` |
| GET | `/cluster/sdn/vnets/{vnet}` | `get_cluster_sdn_vnets_vnet` |
| PUT | `/cluster/sdn/vnets/{vnet}` | `put_cluster_sdn_vnets_vnet` |
| GET | `/cluster/sdn/vnets/{vnet}/firewall` | `get_cluster_sdn_vnets_vnet_firewall` |
| GET | `/cluster/sdn/vnets/{vnet}/firewall/options` | `get_cluster_sdn_vnets_vnet_firewall_options` |
| PUT | `/cluster/sdn/vnets/{vnet}/firewall/options` | `put_cluster_sdn_vnets_vnet_firewall_options` |
| GET | `/cluster/sdn/vnets/{vnet}/firewall/rules` | `get_cluster_sdn_vnets_vnet_firewall_rules` |
| POST | `/cluster/sdn/vnets/{vnet}/firewall/rules` | `post_cluster_sdn_vnets_vnet_firewall_rules` |
| DELETE | `/cluster/sdn/vnets/{vnet}/firewall/rules/{pos}` | `delete_cluster_sdn_vnets_vnet_firewall_rules_pos` |
| GET | `/cluster/sdn/vnets/{vnet}/firewall/rules/{pos}` | `get_cluster_sdn_vnets_vnet_firewall_rules_pos` |
| PUT | `/cluster/sdn/vnets/{vnet}/firewall/rules/{pos}` | `put_cluster_sdn_vnets_vnet_firewall_rules_pos` |
| DELETE | `/cluster/sdn/vnets/{vnet}/ips` | `delete_cluster_sdn_vnets_vnet_ips` |
| POST | `/cluster/sdn/vnets/{vnet}/ips` | `post_cluster_sdn_vnets_vnet_ips` |
| PUT | `/cluster/sdn/vnets/{vnet}/ips` | `put_cluster_sdn_vnets_vnet_ips` |
| GET | `/cluster/sdn/vnets/{vnet}/subnets` | `get_cluster_sdn_vnets_vnet_subnets` |
| POST | `/cluster/sdn/vnets/{vnet}/subnets` | `post_cluster_sdn_vnets_vnet_subnets` |
| DELETE | `/cluster/sdn/vnets/{vnet}/subnets/{subnet}` | `delete_cluster_sdn_vnets_vnet_subnets_subnet` |
| GET | `/cluster/sdn/vnets/{vnet}/subnets/{subnet}` | `get_cluster_sdn_vnets_vnet_subnets_subnet` |
| PUT | `/cluster/sdn/vnets/{vnet}/subnets/{subnet}` | `put_cluster_sdn_vnets_vnet_subnets_subnet` |
| GET | `/cluster/sdn/zones` | `get_cluster_sdn_zones` |
| POST | `/cluster/sdn/zones` | `post_cluster_sdn_zones` |
| DELETE | `/cluster/sdn/zones/{zone}` | `delete_cluster_sdn_zones_zone` |
| GET | `/cluster/sdn/zones/{zone}` | `get_cluster_sdn_zones_zone` |
| PUT | `/cluster/sdn/zones/{zone}` | `put_cluster_sdn_zones_zone` |
| GET | `/cluster/status` | `get_cluster_status` |
| GET | `/cluster/tasks` | `get_cluster_tasks` |

</details>

<details>
<summary><strong>PVE: Nodes & Guests</strong> (358 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/nodes` | `get_nodes` |
| GET | `/nodes/{node}` | `get_nodes_node` |
| GET | `/nodes/{node}/aplinfo` | `get_nodes_node_aplinfo` |
| POST | `/nodes/{node}/aplinfo` | `post_nodes_node_aplinfo` |
| GET | `/nodes/{node}/apt` | `get_nodes_node_apt` |
| GET | `/nodes/{node}/apt/changelog` | `get_nodes_node_apt_changelog` |
| GET | `/nodes/{node}/apt/repositories` | `get_nodes_node_apt_repositories` |
| POST | `/nodes/{node}/apt/repositories` | `post_nodes_node_apt_repositories` |
| PUT | `/nodes/{node}/apt/repositories` | `put_nodes_node_apt_repositories` |
| GET | `/nodes/{node}/apt/update` | `get_nodes_node_apt_update` |
| POST | `/nodes/{node}/apt/update` | `post_nodes_node_apt_update` |
| GET | `/nodes/{node}/apt/versions` | `get_nodes_node_apt_versions` |
| GET | `/nodes/{node}/capabilities` | `get_nodes_node_capabilities` |
| GET | `/nodes/{node}/capabilities/qemu` | `get_nodes_node_capabilities_qemu` |
| GET | `/nodes/{node}/capabilities/qemu/cpu` | `get_nodes_node_capabilities_qemu_cpu` |
| GET | `/nodes/{node}/capabilities/qemu/cpu-flags` | `get_nodes_node_capabilities_qemu_cpu_flags` |
| GET | `/nodes/{node}/capabilities/qemu/machines` | `get_nodes_node_capabilities_qemu_machines` |
| GET | `/nodes/{node}/capabilities/qemu/migration` | `get_nodes_node_capabilities_qemu_migration` |
| GET | `/nodes/{node}/ceph` | `get_nodes_node_ceph` |
| GET | `/nodes/{node}/ceph/cfg` | `get_nodes_node_ceph_cfg` |
| GET | `/nodes/{node}/ceph/cfg/db` | `get_nodes_node_ceph_cfg_db` |
| GET | `/nodes/{node}/ceph/cfg/raw` | `get_nodes_node_ceph_cfg_raw` |
| GET | `/nodes/{node}/ceph/cfg/value` | `get_nodes_node_ceph_cfg_value` |
| GET | `/nodes/{node}/ceph/cmd-safety` | `get_nodes_node_ceph_cmd_safety` |
| GET | `/nodes/{node}/ceph/crush` | `get_nodes_node_ceph_crush` |
| GET | `/nodes/{node}/ceph/fs` | `get_nodes_node_ceph_fs` |
| DELETE | `/nodes/{node}/ceph/fs/{name}` | `delete_nodes_node_ceph_fs_name` |
| POST | `/nodes/{node}/ceph/fs/{name}` | `post_nodes_node_ceph_fs_name` |
| POST | `/nodes/{node}/ceph/init` | `post_nodes_node_ceph_init` |
| GET | `/nodes/{node}/ceph/log` | `get_nodes_node_ceph_log` |
| GET | `/nodes/{node}/ceph/mds` | `get_nodes_node_ceph_mds` |
| DELETE | `/nodes/{node}/ceph/mds/{name}` | `delete_nodes_node_ceph_mds_name` |
| POST | `/nodes/{node}/ceph/mds/{name}` | `post_nodes_node_ceph_mds_name` |
| GET | `/nodes/{node}/ceph/mgr` | `get_nodes_node_ceph_mgr` |
| DELETE | `/nodes/{node}/ceph/mgr/{id}` | `delete_nodes_node_ceph_mgr_id` |
| POST | `/nodes/{node}/ceph/mgr/{id}` | `post_nodes_node_ceph_mgr_id` |
| GET | `/nodes/{node}/ceph/mon` | `get_nodes_node_ceph_mon` |
| DELETE | `/nodes/{node}/ceph/mon/{monid}` | `delete_nodes_node_ceph_mon_monid` |
| POST | `/nodes/{node}/ceph/mon/{monid}` | `post_nodes_node_ceph_mon_monid` |
| GET | `/nodes/{node}/ceph/osd` | `get_nodes_node_ceph_osd` |
| POST | `/nodes/{node}/ceph/osd` | `post_nodes_node_ceph_osd` |
| DELETE | `/nodes/{node}/ceph/osd/{osdid}` | `delete_nodes_node_ceph_osd_osdid` |
| GET | `/nodes/{node}/ceph/osd/{osdid}` | `get_nodes_node_ceph_osd_osdid` |
| POST | `/nodes/{node}/ceph/osd/{osdid}/in` | `post_nodes_node_ceph_osd_osdid_in` |
| GET | `/nodes/{node}/ceph/osd/{osdid}/lv-info` | `get_nodes_node_ceph_osd_osdid_lv_info` |
| GET | `/nodes/{node}/ceph/osd/{osdid}/metadata` | `get_nodes_node_ceph_osd_osdid_metadata` |
| POST | `/nodes/{node}/ceph/osd/{osdid}/out` | `post_nodes_node_ceph_osd_osdid_out` |
| POST | `/nodes/{node}/ceph/osd/{osdid}/scrub` | `post_nodes_node_ceph_osd_osdid_scrub` |
| GET | `/nodes/{node}/ceph/pool` | `get_nodes_node_ceph_pool` |
| POST | `/nodes/{node}/ceph/pool` | `post_nodes_node_ceph_pool` |
| DELETE | `/nodes/{node}/ceph/pool/{name}` | `delete_nodes_node_ceph_pool_name` |
| GET | `/nodes/{node}/ceph/pool/{name}` | `get_nodes_node_ceph_pool_name` |
| PUT | `/nodes/{node}/ceph/pool/{name}` | `put_nodes_node_ceph_pool_name` |
| GET | `/nodes/{node}/ceph/pool/{name}/status` | `get_nodes_node_ceph_pool_name_status` |
| POST | `/nodes/{node}/ceph/restart` | `post_nodes_node_ceph_restart` |
| GET | `/nodes/{node}/ceph/rules` | `get_nodes_node_ceph_rules` |
| POST | `/nodes/{node}/ceph/start` | `post_nodes_node_ceph_start` |
| GET | `/nodes/{node}/ceph/status` | `get_nodes_node_ceph_status` |
| POST | `/nodes/{node}/ceph/stop` | `post_nodes_node_ceph_stop` |
| GET | `/nodes/{node}/certificates` | `get_nodes_node_certificates` |
| GET | `/nodes/{node}/certificates/acme` | `get_nodes_node_certificates_acme` |
| DELETE | `/nodes/{node}/certificates/acme/certificate` | `delete_nodes_node_certificates_acme_certificate` |
| POST | `/nodes/{node}/certificates/acme/certificate` | `post_nodes_node_certificates_acme_certificate` |
| PUT | `/nodes/{node}/certificates/acme/certificate` | `put_nodes_node_certificates_acme_certificate` |
| DELETE | `/nodes/{node}/certificates/custom` | `delete_nodes_node_certificates_custom` |
| POST | `/nodes/{node}/certificates/custom` | `post_nodes_node_certificates_custom` |
| GET | `/nodes/{node}/certificates/info` | `get_nodes_node_certificates_info` |
| GET | `/nodes/{node}/config` | `get_nodes_node_config` |
| PUT | `/nodes/{node}/config` | `put_nodes_node_config` |
| GET | `/nodes/{node}/disks` | `get_nodes_node_disks` |
| GET | `/nodes/{node}/disks/directory` | `get_nodes_node_disks_directory` |
| POST | `/nodes/{node}/disks/directory` | `post_nodes_node_disks_directory` |
| DELETE | `/nodes/{node}/disks/directory/{name}` | `delete_nodes_node_disks_directory_name` |
| POST | `/nodes/{node}/disks/initgpt` | `post_nodes_node_disks_initgpt` |
| GET | `/nodes/{node}/disks/list` | `get_nodes_node_disks_list` |
| GET | `/nodes/{node}/disks/lvm` | `get_nodes_node_disks_lvm` |
| POST | `/nodes/{node}/disks/lvm` | `post_nodes_node_disks_lvm` |
| DELETE | `/nodes/{node}/disks/lvm/{name}` | `delete_nodes_node_disks_lvm_name` |
| GET | `/nodes/{node}/disks/lvmthin` | `get_nodes_node_disks_lvmthin` |
| POST | `/nodes/{node}/disks/lvmthin` | `post_nodes_node_disks_lvmthin` |
| DELETE | `/nodes/{node}/disks/lvmthin/{name}` | `delete_nodes_node_disks_lvmthin_name` |
| GET | `/nodes/{node}/disks/smart` | `get_nodes_node_disks_smart` |
| PUT | `/nodes/{node}/disks/wipedisk` | `put_nodes_node_disks_wipedisk` |
| GET | `/nodes/{node}/disks/zfs` | `get_nodes_node_disks_zfs` |
| POST | `/nodes/{node}/disks/zfs` | `post_nodes_node_disks_zfs` |
| DELETE | `/nodes/{node}/disks/zfs/{name}` | `delete_nodes_node_disks_zfs_name` |
| GET | `/nodes/{node}/disks/zfs/{name}` | `get_nodes_node_disks_zfs_name` |
| GET | `/nodes/{node}/dns` | `get_nodes_node_dns` |
| PUT | `/nodes/{node}/dns` | `put_nodes_node_dns` |
| POST | `/nodes/{node}/execute` | `post_nodes_node_execute` |
| GET | `/nodes/{node}/firewall` | `get_nodes_node_firewall` |
| GET | `/nodes/{node}/firewall/log` | `get_nodes_node_firewall_log` |
| GET | `/nodes/{node}/firewall/options` | `get_nodes_node_firewall_options` |
| PUT | `/nodes/{node}/firewall/options` | `put_nodes_node_firewall_options` |
| GET | `/nodes/{node}/firewall/rules` | `get_nodes_node_firewall_rules` |
| POST | `/nodes/{node}/firewall/rules` | `post_nodes_node_firewall_rules` |
| DELETE | `/nodes/{node}/firewall/rules/{pos}` | `delete_nodes_node_firewall_rules_pos` |
| GET | `/nodes/{node}/firewall/rules/{pos}` | `get_nodes_node_firewall_rules_pos` |
| PUT | `/nodes/{node}/firewall/rules/{pos}` | `put_nodes_node_firewall_rules_pos` |
| GET | `/nodes/{node}/hardware` | `get_nodes_node_hardware` |
| GET | `/nodes/{node}/hardware/pci` | `get_nodes_node_hardware_pci` |
| GET | `/nodes/{node}/hardware/pci/{pci-id-or-mapping}` | `get_nodes_node_hardware_pci_pci_id_or_mapping` |
| GET | `/nodes/{node}/hardware/pci/{pci-id-or-mapping}/mdev` | `get_nodes_node_hardware_pci_pci_id_or_mapping_mdev` |
| GET | `/nodes/{node}/hardware/usb` | `get_nodes_node_hardware_usb` |
| GET | `/nodes/{node}/hosts` | `get_nodes_node_hosts` |
| POST | `/nodes/{node}/hosts` | `post_nodes_node_hosts` |
| GET | `/nodes/{node}/journal` | `get_nodes_node_journal` |
| GET | `/nodes/{node}/lxc` | `get_nodes_node_lxc` |
| POST | `/nodes/{node}/lxc` | `post_nodes_node_lxc` |
| DELETE | `/nodes/{node}/lxc/{vmid}` | `delete_nodes_node_lxc_vmid` |
| GET | `/nodes/{node}/lxc/{vmid}` | `get_nodes_node_lxc_vmid` |
| POST | `/nodes/{node}/lxc/{vmid}/clone` | `post_nodes_node_lxc_vmid_clone` |
| GET | `/nodes/{node}/lxc/{vmid}/config` | `get_nodes_node_lxc_vmid_config` |
| PUT | `/nodes/{node}/lxc/{vmid}/config` | `put_nodes_node_lxc_vmid_config` |
| GET | `/nodes/{node}/lxc/{vmid}/feature` | `get_nodes_node_lxc_vmid_feature` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall` | `get_nodes_node_lxc_vmid_firewall` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/aliases` | `get_nodes_node_lxc_vmid_firewall_aliases` |
| POST | `/nodes/{node}/lxc/{vmid}/firewall/aliases` | `post_nodes_node_lxc_vmid_firewall_aliases` |
| DELETE | `/nodes/{node}/lxc/{vmid}/firewall/aliases/{name}` | `delete_nodes_node_lxc_vmid_firewall_aliases_name` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/aliases/{name}` | `get_nodes_node_lxc_vmid_firewall_aliases_name` |
| PUT | `/nodes/{node}/lxc/{vmid}/firewall/aliases/{name}` | `put_nodes_node_lxc_vmid_firewall_aliases_name` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/ipset` | `get_nodes_node_lxc_vmid_firewall_ipset` |
| POST | `/nodes/{node}/lxc/{vmid}/firewall/ipset` | `post_nodes_node_lxc_vmid_firewall_ipset` |
| DELETE | `/nodes/{node}/lxc/{vmid}/firewall/ipset/{name}` | `delete_nodes_node_lxc_vmid_firewall_ipset_name` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/ipset/{name}` | `get_nodes_node_lxc_vmid_firewall_ipset_name` |
| POST | `/nodes/{node}/lxc/{vmid}/firewall/ipset/{name}` | `post_nodes_node_lxc_vmid_firewall_ipset_name` |
| DELETE | `/nodes/{node}/lxc/{vmid}/firewall/ipset/{name}/{cidr}` | `delete_nodes_node_lxc_vmid_firewall_ipset_name_cidr` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/ipset/{name}/{cidr}` | `get_nodes_node_lxc_vmid_firewall_ipset_name_cidr` |
| PUT | `/nodes/{node}/lxc/{vmid}/firewall/ipset/{name}/{cidr}` | `put_nodes_node_lxc_vmid_firewall_ipset_name_cidr` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/log` | `get_nodes_node_lxc_vmid_firewall_log` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/options` | `get_nodes_node_lxc_vmid_firewall_options` |
| PUT | `/nodes/{node}/lxc/{vmid}/firewall/options` | `put_nodes_node_lxc_vmid_firewall_options` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/refs` | `get_nodes_node_lxc_vmid_firewall_refs` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/rules` | `get_nodes_node_lxc_vmid_firewall_rules` |
| POST | `/nodes/{node}/lxc/{vmid}/firewall/rules` | `post_nodes_node_lxc_vmid_firewall_rules` |
| DELETE | `/nodes/{node}/lxc/{vmid}/firewall/rules/{pos}` | `delete_nodes_node_lxc_vmid_firewall_rules_pos` |
| GET | `/nodes/{node}/lxc/{vmid}/firewall/rules/{pos}` | `get_nodes_node_lxc_vmid_firewall_rules_pos` |
| PUT | `/nodes/{node}/lxc/{vmid}/firewall/rules/{pos}` | `put_nodes_node_lxc_vmid_firewall_rules_pos` |
| GET | `/nodes/{node}/lxc/{vmid}/interfaces` | `get_nodes_node_lxc_vmid_interfaces` |
| GET | `/nodes/{node}/lxc/{vmid}/migrate` | `get_nodes_node_lxc_vmid_migrate` |
| POST | `/nodes/{node}/lxc/{vmid}/migrate` | `post_nodes_node_lxc_vmid_migrate` |
| POST | `/nodes/{node}/lxc/{vmid}/move_volume` | `post_nodes_node_lxc_vmid_move_volume` |
| POST | `/nodes/{node}/lxc/{vmid}/mtunnel` | `post_nodes_node_lxc_vmid_mtunnel` |
| GET | `/nodes/{node}/lxc/{vmid}/mtunnelwebsocket` | `get_nodes_node_lxc_vmid_mtunnelwebsocket` |
| GET | `/nodes/{node}/lxc/{vmid}/pending` | `get_nodes_node_lxc_vmid_pending` |
| POST | `/nodes/{node}/lxc/{vmid}/remote_migrate` | `post_nodes_node_lxc_vmid_remote_migrate` |
| PUT | `/nodes/{node}/lxc/{vmid}/resize` | `put_nodes_node_lxc_vmid_resize` |
| GET | `/nodes/{node}/lxc/{vmid}/rrd` | `get_nodes_node_lxc_vmid_rrd` |
| GET | `/nodes/{node}/lxc/{vmid}/rrddata` | `get_nodes_node_lxc_vmid_rrddata` |
| GET | `/nodes/{node}/lxc/{vmid}/snapshot` | `get_nodes_node_lxc_vmid_snapshot` |
| POST | `/nodes/{node}/lxc/{vmid}/snapshot` | `post_nodes_node_lxc_vmid_snapshot` |
| DELETE | `/nodes/{node}/lxc/{vmid}/snapshot/{snapname}` | `delete_nodes_node_lxc_vmid_snapshot_snapname` |
| GET | `/nodes/{node}/lxc/{vmid}/snapshot/{snapname}` | `get_nodes_node_lxc_vmid_snapshot_snapname` |
| GET | `/nodes/{node}/lxc/{vmid}/snapshot/{snapname}/config` | `get_nodes_node_lxc_vmid_snapshot_snapname_config` |
| PUT | `/nodes/{node}/lxc/{vmid}/snapshot/{snapname}/config` | `put_nodes_node_lxc_vmid_snapshot_snapname_config` |
| POST | `/nodes/{node}/lxc/{vmid}/snapshot/{snapname}/rollback` | `post_nodes_node_lxc_vmid_snapshot_snapname_rollback` |
| POST | `/nodes/{node}/lxc/{vmid}/spiceproxy` | `post_nodes_node_lxc_vmid_spiceproxy` |
| GET | `/nodes/{node}/lxc/{vmid}/status` | `get_nodes_node_lxc_vmid_status` |
| GET | `/nodes/{node}/lxc/{vmid}/status/current` | `get_nodes_node_lxc_vmid_status_current` |
| POST | `/nodes/{node}/lxc/{vmid}/status/reboot` | `post_nodes_node_lxc_vmid_status_reboot` |
| POST | `/nodes/{node}/lxc/{vmid}/status/resume` | `post_nodes_node_lxc_vmid_status_resume` |
| POST | `/nodes/{node}/lxc/{vmid}/status/shutdown` | `post_nodes_node_lxc_vmid_status_shutdown` |
| POST | `/nodes/{node}/lxc/{vmid}/status/start` | `post_nodes_node_lxc_vmid_status_start` |
| POST | `/nodes/{node}/lxc/{vmid}/status/stop` | `post_nodes_node_lxc_vmid_status_stop` |
| POST | `/nodes/{node}/lxc/{vmid}/status/suspend` | `post_nodes_node_lxc_vmid_status_suspend` |
| POST | `/nodes/{node}/lxc/{vmid}/template` | `post_nodes_node_lxc_vmid_template` |
| POST | `/nodes/{node}/lxc/{vmid}/termproxy` | `post_nodes_node_lxc_vmid_termproxy` |
| POST | `/nodes/{node}/lxc/{vmid}/vncproxy` | `post_nodes_node_lxc_vmid_vncproxy` |
| GET | `/nodes/{node}/lxc/{vmid}/vncwebsocket` | `get_nodes_node_lxc_vmid_vncwebsocket` |
| POST | `/nodes/{node}/migrateall` | `post_nodes_node_migrateall` |
| GET | `/nodes/{node}/netstat` | `get_nodes_node_netstat` |
| DELETE | `/nodes/{node}/network` | `delete_nodes_node_network` |
| GET | `/nodes/{node}/network` | `get_nodes_node_network` |
| POST | `/nodes/{node}/network` | `post_nodes_node_network` |
| PUT | `/nodes/{node}/network` | `put_nodes_node_network` |
| DELETE | `/nodes/{node}/network/{iface}` | `delete_nodes_node_network_iface` |
| GET | `/nodes/{node}/network/{iface}` | `get_nodes_node_network_iface` |
| PUT | `/nodes/{node}/network/{iface}` | `put_nodes_node_network_iface` |
| GET | `/nodes/{node}/qemu` | `get_nodes_node_qemu` |
| POST | `/nodes/{node}/qemu` | `post_nodes_node_qemu` |
| DELETE | `/nodes/{node}/qemu/{vmid}` | `delete_nodes_node_qemu_vmid` |
| GET | `/nodes/{node}/qemu/{vmid}` | `get_nodes_node_qemu_vmid` |
| GET | `/nodes/{node}/qemu/{vmid}/agent` | `get_nodes_node_qemu_vmid_agent` |
| POST | `/nodes/{node}/qemu/{vmid}/agent` | `post_nodes_node_qemu_vmid_agent` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/exec` | `post_nodes_node_qemu_vmid_agent_exec` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/exec-status` | `get_nodes_node_qemu_vmid_agent_exec_status` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/file-read` | `get_nodes_node_qemu_vmid_agent_file_read` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/file-write` | `post_nodes_node_qemu_vmid_agent_file_write` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/fsfreeze-freeze` | `post_nodes_node_qemu_vmid_agent_fsfreeze_freeze` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/fsfreeze-status` | `post_nodes_node_qemu_vmid_agent_fsfreeze_status` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/fsfreeze-thaw` | `post_nodes_node_qemu_vmid_agent_fsfreeze_thaw` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/fstrim` | `post_nodes_node_qemu_vmid_agent_fstrim` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-fsinfo` | `get_nodes_node_qemu_vmid_agent_get_fsinfo` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-host-name` | `get_nodes_node_qemu_vmid_agent_get_host_name` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-memory-block-info` | `get_nodes_node_qemu_vmid_agent_get_memory_block_info` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-memory-blocks` | `get_nodes_node_qemu_vmid_agent_get_memory_blocks` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-osinfo` | `get_nodes_node_qemu_vmid_agent_get_osinfo` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-time` | `get_nodes_node_qemu_vmid_agent_get_time` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-timezone` | `get_nodes_node_qemu_vmid_agent_get_timezone` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-users` | `get_nodes_node_qemu_vmid_agent_get_users` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/get-vcpus` | `get_nodes_node_qemu_vmid_agent_get_vcpus` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/info` | `get_nodes_node_qemu_vmid_agent_info` |
| GET | `/nodes/{node}/qemu/{vmid}/agent/network-get-interfaces` | `get_nodes_node_qemu_vmid_agent_network_get_interfaces` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/ping` | `post_nodes_node_qemu_vmid_agent_ping` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/set-user-password` | `post_nodes_node_qemu_vmid_agent_set_user_password` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/shutdown` | `post_nodes_node_qemu_vmid_agent_shutdown` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/suspend-disk` | `post_nodes_node_qemu_vmid_agent_suspend_disk` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/suspend-hybrid` | `post_nodes_node_qemu_vmid_agent_suspend_hybrid` |
| POST | `/nodes/{node}/qemu/{vmid}/agent/suspend-ram` | `post_nodes_node_qemu_vmid_agent_suspend_ram` |
| POST | `/nodes/{node}/qemu/{vmid}/clone` | `post_nodes_node_qemu_vmid_clone` |
| GET | `/nodes/{node}/qemu/{vmid}/cloudinit` | `get_nodes_node_qemu_vmid_cloudinit` |
| PUT | `/nodes/{node}/qemu/{vmid}/cloudinit` | `put_nodes_node_qemu_vmid_cloudinit` |
| GET | `/nodes/{node}/qemu/{vmid}/cloudinit/dump` | `get_nodes_node_qemu_vmid_cloudinit_dump` |
| GET | `/nodes/{node}/qemu/{vmid}/config` | `get_nodes_node_qemu_vmid_config` |
| POST | `/nodes/{node}/qemu/{vmid}/config` | `post_nodes_node_qemu_vmid_config` |
| PUT | `/nodes/{node}/qemu/{vmid}/config` | `put_nodes_node_qemu_vmid_config` |
| POST | `/nodes/{node}/qemu/{vmid}/dbus-vmstate` | `post_nodes_node_qemu_vmid_dbus_vmstate` |
| GET | `/nodes/{node}/qemu/{vmid}/feature` | `get_nodes_node_qemu_vmid_feature` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall` | `get_nodes_node_qemu_vmid_firewall` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/aliases` | `get_nodes_node_qemu_vmid_firewall_aliases` |
| POST | `/nodes/{node}/qemu/{vmid}/firewall/aliases` | `post_nodes_node_qemu_vmid_firewall_aliases` |
| DELETE | `/nodes/{node}/qemu/{vmid}/firewall/aliases/{name}` | `delete_nodes_node_qemu_vmid_firewall_aliases_name` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/aliases/{name}` | `get_nodes_node_qemu_vmid_firewall_aliases_name` |
| PUT | `/nodes/{node}/qemu/{vmid}/firewall/aliases/{name}` | `put_nodes_node_qemu_vmid_firewall_aliases_name` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/ipset` | `get_nodes_node_qemu_vmid_firewall_ipset` |
| POST | `/nodes/{node}/qemu/{vmid}/firewall/ipset` | `post_nodes_node_qemu_vmid_firewall_ipset` |
| DELETE | `/nodes/{node}/qemu/{vmid}/firewall/ipset/{name}` | `delete_nodes_node_qemu_vmid_firewall_ipset_name` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/ipset/{name}` | `get_nodes_node_qemu_vmid_firewall_ipset_name` |
| POST | `/nodes/{node}/qemu/{vmid}/firewall/ipset/{name}` | `post_nodes_node_qemu_vmid_firewall_ipset_name` |
| DELETE | `/nodes/{node}/qemu/{vmid}/firewall/ipset/{name}/{cidr}` | `delete_nodes_node_qemu_vmid_firewall_ipset_name_cidr` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/ipset/{name}/{cidr}` | `get_nodes_node_qemu_vmid_firewall_ipset_name_cidr` |
| PUT | `/nodes/{node}/qemu/{vmid}/firewall/ipset/{name}/{cidr}` | `put_nodes_node_qemu_vmid_firewall_ipset_name_cidr` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/log` | `get_nodes_node_qemu_vmid_firewall_log` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/options` | `get_nodes_node_qemu_vmid_firewall_options` |
| PUT | `/nodes/{node}/qemu/{vmid}/firewall/options` | `put_nodes_node_qemu_vmid_firewall_options` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/refs` | `get_nodes_node_qemu_vmid_firewall_refs` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/rules` | `get_nodes_node_qemu_vmid_firewall_rules` |
| POST | `/nodes/{node}/qemu/{vmid}/firewall/rules` | `post_nodes_node_qemu_vmid_firewall_rules` |
| DELETE | `/nodes/{node}/qemu/{vmid}/firewall/rules/{pos}` | `delete_nodes_node_qemu_vmid_firewall_rules_pos` |
| GET | `/nodes/{node}/qemu/{vmid}/firewall/rules/{pos}` | `get_nodes_node_qemu_vmid_firewall_rules_pos` |
| PUT | `/nodes/{node}/qemu/{vmid}/firewall/rules/{pos}` | `put_nodes_node_qemu_vmid_firewall_rules_pos` |
| GET | `/nodes/{node}/qemu/{vmid}/migrate` | `get_nodes_node_qemu_vmid_migrate` |
| POST | `/nodes/{node}/qemu/{vmid}/migrate` | `post_nodes_node_qemu_vmid_migrate` |
| POST | `/nodes/{node}/qemu/{vmid}/monitor` | `post_nodes_node_qemu_vmid_monitor` |
| POST | `/nodes/{node}/qemu/{vmid}/move_disk` | `post_nodes_node_qemu_vmid_move_disk` |
| POST | `/nodes/{node}/qemu/{vmid}/mtunnel` | `post_nodes_node_qemu_vmid_mtunnel` |
| GET | `/nodes/{node}/qemu/{vmid}/mtunnelwebsocket` | `get_nodes_node_qemu_vmid_mtunnelwebsocket` |
| GET | `/nodes/{node}/qemu/{vmid}/pending` | `get_nodes_node_qemu_vmid_pending` |
| POST | `/nodes/{node}/qemu/{vmid}/remote_migrate` | `post_nodes_node_qemu_vmid_remote_migrate` |
| PUT | `/nodes/{node}/qemu/{vmid}/resize` | `put_nodes_node_qemu_vmid_resize` |
| GET | `/nodes/{node}/qemu/{vmid}/rrd` | `get_nodes_node_qemu_vmid_rrd` |
| GET | `/nodes/{node}/qemu/{vmid}/rrddata` | `get_nodes_node_qemu_vmid_rrddata` |
| PUT | `/nodes/{node}/qemu/{vmid}/sendkey` | `put_nodes_node_qemu_vmid_sendkey` |
| GET | `/nodes/{node}/qemu/{vmid}/snapshot` | `get_nodes_node_qemu_vmid_snapshot` |
| POST | `/nodes/{node}/qemu/{vmid}/snapshot` | `post_nodes_node_qemu_vmid_snapshot` |
| DELETE | `/nodes/{node}/qemu/{vmid}/snapshot/{snapname}` | `delete_nodes_node_qemu_vmid_snapshot_snapname` |
| GET | `/nodes/{node}/qemu/{vmid}/snapshot/{snapname}` | `get_nodes_node_qemu_vmid_snapshot_snapname` |
| GET | `/nodes/{node}/qemu/{vmid}/snapshot/{snapname}/config` | `get_nodes_node_qemu_vmid_snapshot_snapname_config` |
| PUT | `/nodes/{node}/qemu/{vmid}/snapshot/{snapname}/config` | `put_nodes_node_qemu_vmid_snapshot_snapname_config` |
| POST | `/nodes/{node}/qemu/{vmid}/snapshot/{snapname}/rollback` | `post_nodes_node_qemu_vmid_snapshot_snapname_rollback` |
| POST | `/nodes/{node}/qemu/{vmid}/spiceproxy` | `post_nodes_node_qemu_vmid_spiceproxy` |
| GET | `/nodes/{node}/qemu/{vmid}/status` | `get_nodes_node_qemu_vmid_status` |
| GET | `/nodes/{node}/qemu/{vmid}/status/current` | `get_nodes_node_qemu_vmid_status_current` |
| POST | `/nodes/{node}/qemu/{vmid}/status/reboot` | `post_nodes_node_qemu_vmid_status_reboot` |
| POST | `/nodes/{node}/qemu/{vmid}/status/reset` | `post_nodes_node_qemu_vmid_status_reset` |
| POST | `/nodes/{node}/qemu/{vmid}/status/resume` | `post_nodes_node_qemu_vmid_status_resume` |
| POST | `/nodes/{node}/qemu/{vmid}/status/shutdown` | `post_nodes_node_qemu_vmid_status_shutdown` |
| POST | `/nodes/{node}/qemu/{vmid}/status/start` | `post_nodes_node_qemu_vmid_status_start` |
| POST | `/nodes/{node}/qemu/{vmid}/status/stop` | `post_nodes_node_qemu_vmid_status_stop` |
| POST | `/nodes/{node}/qemu/{vmid}/status/suspend` | `post_nodes_node_qemu_vmid_status_suspend` |
| POST | `/nodes/{node}/qemu/{vmid}/template` | `post_nodes_node_qemu_vmid_template` |
| POST | `/nodes/{node}/qemu/{vmid}/termproxy` | `post_nodes_node_qemu_vmid_termproxy` |
| PUT | `/nodes/{node}/qemu/{vmid}/unlink` | `put_nodes_node_qemu_vmid_unlink` |
| POST | `/nodes/{node}/qemu/{vmid}/vncproxy` | `post_nodes_node_qemu_vmid_vncproxy` |
| GET | `/nodes/{node}/qemu/{vmid}/vncwebsocket` | `get_nodes_node_qemu_vmid_vncwebsocket` |
| GET | `/nodes/{node}/query-oci-repo-tags` | `get_nodes_node_query_oci_repo_tags` |
| GET | `/nodes/{node}/query-url-metadata` | `get_nodes_node_query_url_metadata` |
| GET | `/nodes/{node}/replication` | `get_nodes_node_replication` |
| GET | `/nodes/{node}/replication/{id}` | `get_nodes_node_replication_id` |
| GET | `/nodes/{node}/replication/{id}/log` | `get_nodes_node_replication_id_log` |
| POST | `/nodes/{node}/replication/{id}/schedule_now` | `post_nodes_node_replication_id_schedule_now` |
| GET | `/nodes/{node}/replication/{id}/status` | `get_nodes_node_replication_id_status` |
| GET | `/nodes/{node}/report` | `get_nodes_node_report` |
| GET | `/nodes/{node}/rrd` | `get_nodes_node_rrd` |
| GET | `/nodes/{node}/rrddata` | `get_nodes_node_rrddata` |
| GET | `/nodes/{node}/scan` | `get_nodes_node_scan` |
| GET | `/nodes/{node}/scan/cifs` | `get_nodes_node_scan_cifs` |
| GET | `/nodes/{node}/scan/iscsi` | `get_nodes_node_scan_iscsi` |
| GET | `/nodes/{node}/scan/lvm` | `get_nodes_node_scan_lvm` |
| GET | `/nodes/{node}/scan/lvmthin` | `get_nodes_node_scan_lvmthin` |
| GET | `/nodes/{node}/scan/nfs` | `get_nodes_node_scan_nfs` |
| GET | `/nodes/{node}/scan/pbs` | `get_nodes_node_scan_pbs` |
| GET | `/nodes/{node}/scan/zfs` | `get_nodes_node_scan_zfs` |
| GET | `/nodes/{node}/sdn` | `get_nodes_node_sdn` |
| GET | `/nodes/{node}/sdn/fabrics/{fabric}` | `get_nodes_node_sdn_fabrics_fabric` |
| GET | `/nodes/{node}/sdn/fabrics/{fabric}/interfaces` | `get_nodes_node_sdn_fabrics_fabric_interfaces` |
| GET | `/nodes/{node}/sdn/fabrics/{fabric}/neighbors` | `get_nodes_node_sdn_fabrics_fabric_neighbors` |
| GET | `/nodes/{node}/sdn/fabrics/{fabric}/routes` | `get_nodes_node_sdn_fabrics_fabric_routes` |
| GET | `/nodes/{node}/sdn/vnets/{vnet}` | `get_nodes_node_sdn_vnets_vnet` |
| GET | `/nodes/{node}/sdn/vnets/{vnet}/mac-vrf` | `get_nodes_node_sdn_vnets_vnet_mac_vrf` |
| GET | `/nodes/{node}/sdn/zones` | `get_nodes_node_sdn_zones` |
| GET | `/nodes/{node}/sdn/zones/{zone}` | `get_nodes_node_sdn_zones_zone` |
| GET | `/nodes/{node}/sdn/zones/{zone}/bridges` | `get_nodes_node_sdn_zones_zone_bridges` |
| GET | `/nodes/{node}/sdn/zones/{zone}/content` | `get_nodes_node_sdn_zones_zone_content` |
| GET | `/nodes/{node}/sdn/zones/{zone}/ip-vrf` | `get_nodes_node_sdn_zones_zone_ip_vrf` |
| GET | `/nodes/{node}/services` | `get_nodes_node_services` |
| GET | `/nodes/{node}/services/{service}` | `get_nodes_node_services_service` |
| POST | `/nodes/{node}/services/{service}/reload` | `post_nodes_node_services_service_reload` |
| POST | `/nodes/{node}/services/{service}/restart` | `post_nodes_node_services_service_restart` |
| POST | `/nodes/{node}/services/{service}/start` | `post_nodes_node_services_service_start` |
| GET | `/nodes/{node}/services/{service}/state` | `get_nodes_node_services_service_state` |
| POST | `/nodes/{node}/services/{service}/stop` | `post_nodes_node_services_service_stop` |
| POST | `/nodes/{node}/spiceshell` | `post_nodes_node_spiceshell` |
| POST | `/nodes/{node}/startall` | `post_nodes_node_startall` |
| GET | `/nodes/{node}/status` | `get_nodes_node_status` |
| POST | `/nodes/{node}/status` | `post_nodes_node_status` |
| POST | `/nodes/{node}/stopall` | `post_nodes_node_stopall` |
| GET | `/nodes/{node}/storage` | `get_nodes_node_storage` |
| GET | `/nodes/{node}/storage/{storage}` | `get_nodes_node_storage_storage` |
| GET | `/nodes/{node}/storage/{storage}/content` | `get_nodes_node_storage_storage_content` |
| POST | `/nodes/{node}/storage/{storage}/content` | `post_nodes_node_storage_storage_content` |
| DELETE | `/nodes/{node}/storage/{storage}/content/{volume}` | `delete_nodes_node_storage_storage_content_volume` |
| GET | `/nodes/{node}/storage/{storage}/content/{volume}` | `get_nodes_node_storage_storage_content_volume` |
| POST | `/nodes/{node}/storage/{storage}/content/{volume}` | `post_nodes_node_storage_storage_content_volume` |
| PUT | `/nodes/{node}/storage/{storage}/content/{volume}` | `put_nodes_node_storage_storage_content_volume` |
| POST | `/nodes/{node}/storage/{storage}/download-url` | `post_nodes_node_storage_storage_download_url` |
| GET | `/nodes/{node}/storage/{storage}/file-restore/download` | `get_nodes_node_storage_storage_file_restore_download` |
| GET | `/nodes/{node}/storage/{storage}/file-restore/list` | `get_nodes_node_storage_storage_file_restore_list` |
| GET | `/nodes/{node}/storage/{storage}/identity` | `get_nodes_node_storage_storage_identity` |
| GET | `/nodes/{node}/storage/{storage}/import-metadata` | `get_nodes_node_storage_storage_import_metadata` |
| POST | `/nodes/{node}/storage/{storage}/oci-registry-pull` | `post_nodes_node_storage_storage_oci_registry_pull` |
| DELETE | `/nodes/{node}/storage/{storage}/prunebackups` | `delete_nodes_node_storage_storage_prunebackups` |
| GET | `/nodes/{node}/storage/{storage}/prunebackups` | `get_nodes_node_storage_storage_prunebackups` |
| GET | `/nodes/{node}/storage/{storage}/rrd` | `get_nodes_node_storage_storage_rrd` |
| GET | `/nodes/{node}/storage/{storage}/rrddata` | `get_nodes_node_storage_storage_rrddata` |
| GET | `/nodes/{node}/storage/{storage}/status` | `get_nodes_node_storage_storage_status` |
| POST | `/nodes/{node}/storage/{storage}/upload` | `post_nodes_node_storage_storage_upload` |
| DELETE | `/nodes/{node}/subscription` | `delete_nodes_node_subscription` |
| GET | `/nodes/{node}/subscription` | `get_nodes_node_subscription` |
| POST | `/nodes/{node}/subscription` | `post_nodes_node_subscription` |
| PUT | `/nodes/{node}/subscription` | `put_nodes_node_subscription` |
| POST | `/nodes/{node}/suspendall` | `post_nodes_node_suspendall` |
| GET | `/nodes/{node}/syslog` | `get_nodes_node_syslog` |
| GET | `/nodes/{node}/tasks` | `get_nodes_node_tasks` |
| DELETE | `/nodes/{node}/tasks/{upid}` | `delete_nodes_node_tasks_upid` |
| GET | `/nodes/{node}/tasks/{upid}` | `get_nodes_node_tasks_upid` |
| GET | `/nodes/{node}/tasks/{upid}/log` | `get_nodes_node_tasks_upid_log` |
| GET | `/nodes/{node}/tasks/{upid}/status` | `get_nodes_node_tasks_upid_status` |
| POST | `/nodes/{node}/termproxy` | `post_nodes_node_termproxy` |
| GET | `/nodes/{node}/time` | `get_nodes_node_time` |
| PUT | `/nodes/{node}/time` | `put_nodes_node_time` |
| GET | `/nodes/{node}/version` | `get_nodes_node_version` |
| POST | `/nodes/{node}/vncshell` | `post_nodes_node_vncshell` |
| GET | `/nodes/{node}/vncwebsocket` | `get_nodes_node_vncwebsocket` |
| POST | `/nodes/{node}/vzdump` | `post_nodes_node_vzdump` |
| GET | `/nodes/{node}/vzdump/defaults` | `get_nodes_node_vzdump_defaults` |
| GET | `/nodes/{node}/vzdump/extractconfig` | `get_nodes_node_vzdump_extractconfig` |
| POST | `/nodes/{node}/wakeonlan` | `post_nodes_node_wakeonlan` |

</details>

<details>
<summary><strong>PVE: Pools</strong> (7 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| DELETE | `/pools` | `delete_pools` |
| GET | `/pools` | `get_pools` |
| POST | `/pools` | `post_pools` |
| PUT | `/pools` | `put_pools` |
| DELETE | `/pools/{poolid}` | `delete_pools_poolid` |
| GET | `/pools/{poolid}` | `get_pools_poolid` |
| PUT | `/pools/{poolid}` | `put_pools_poolid` |

</details>

<details>
<summary><strong>PVE: Storage</strong> (5 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/storage` | `get_storage` |
| POST | `/storage` | `post_storage` |
| DELETE | `/storage/{storage}` | `delete_storage_storage` |
| GET | `/storage/{storage}` | `get_storage_storage` |
| PUT | `/storage/{storage}` | `put_storage_storage` |

</details>

<details>
<summary><strong>PVE: System</strong> (1 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/version` | `get_version` |

</details>

### Proxmox Datacenter Manager (318 operations)

<details>
<summary><strong>PDM: Access & Auth</strong> (28 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/access` | `get_access` |
| GET | `/access/acl` | `get_access_acl` |
| PUT | `/access/acl` | `put_access_acl` |
| GET | `/access/domains` | `get_access_domains` |
| POST | `/access/domains/{realm}/sync` | `post_access_domains_realm_sync` |
| GET | `/access/openid` | `get_access_openid` |
| POST | `/access/openid/auth-url` | `post_access_openid_auth_url` |
| POST | `/access/openid/login` | `post_access_openid_login` |
| GET | `/access/permissions` | `get_access_permissions` |
| GET | `/access/roles` | `get_access_roles` |
| GET | `/access/tfa` | `get_access_tfa` |
| GET | `/access/tfa/{userid}` | `get_access_tfa_userid` |
| POST | `/access/tfa/{userid}` | `post_access_tfa_userid` |
| DELETE | `/access/tfa/{userid}/{id}` | `delete_access_tfa_userid_id` |
| GET | `/access/tfa/{userid}/{id}` | `get_access_tfa_userid_id` |
| PUT | `/access/tfa/{userid}/{id}` | `put_access_tfa_userid_id` |
| DELETE | `/access/ticket` | `delete_access_ticket` |
| POST | `/access/ticket` | `post_access_ticket` |
| GET | `/access/users` | `get_access_users` |
| POST | `/access/users` | `post_access_users` |
| DELETE | `/access/users/{userid}` | `delete_access_users_userid` |
| GET | `/access/users/{userid}` | `get_access_users_userid` |
| PUT | `/access/users/{userid}` | `put_access_users_userid` |
| GET | `/access/users/{userid}/token` | `get_access_users_userid_token` |
| DELETE | `/access/users/{userid}/token/{token-name}` | `delete_access_users_userid_token_token_name` |
| GET | `/access/users/{userid}/token/{token-name}` | `get_access_users_userid_token_token_name` |
| POST | `/access/users/{userid}/token/{token-name}` | `post_access_users_userid_token_token_name` |
| PUT | `/access/users/{userid}/token/{token-name}` | `put_access_users_userid_token_token_name` |

</details>

<details>
<summary><strong>PDM: Auto Install</strong> (14 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/auto-install` | `get_auto_install` |
| POST | `/auto-install/answer` | `post_auto_install_answer` |
| GET | `/auto-install/installations` | `get_auto_install_installations` |
| DELETE | `/auto-install/installations/{uuid}` | `delete_auto_install_installations_uuid` |
| POST | `/auto-install/installations/{uuid}/post-hook` | `post_auto_install_installations_uuid_post_hook` |
| GET | `/auto-install/prepared` | `get_auto_install_prepared` |
| POST | `/auto-install/prepared` | `post_auto_install_prepared` |
| DELETE | `/auto-install/prepared/{id}` | `delete_auto_install_prepared_id` |
| GET | `/auto-install/prepared/{id}` | `get_auto_install_prepared_id` |
| PUT | `/auto-install/prepared/{id}` | `put_auto_install_prepared_id` |
| GET | `/auto-install/tokens` | `get_auto_install_tokens` |
| POST | `/auto-install/tokens` | `post_auto_install_tokens` |
| DELETE | `/auto-install/tokens/{id}` | `delete_auto_install_tokens_id` |
| PUT | `/auto-install/tokens/{id}` | `put_auto_install_tokens_id` |

</details>

<details>
<summary><strong>PDM: Ceph</strong> (12 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/ceph` | `get_ceph` |
| GET | `/ceph/clusters` | `get_ceph_clusters` |
| GET | `/ceph/clusters/{cluster}` | `get_ceph_clusters_cluster` |
| GET | `/ceph/clusters/{cluster}/flags` | `get_ceph_clusters_cluster_flags` |
| GET | `/ceph/clusters/{cluster}/fs` | `get_ceph_clusters_cluster_fs` |
| GET | `/ceph/clusters/{cluster}/mds` | `get_ceph_clusters_cluster_mds` |
| GET | `/ceph/clusters/{cluster}/mgr` | `get_ceph_clusters_cluster_mgr` |
| GET | `/ceph/clusters/{cluster}/mon` | `get_ceph_clusters_cluster_mon` |
| GET | `/ceph/clusters/{cluster}/osd-tree` | `get_ceph_clusters_cluster_osd_tree` |
| GET | `/ceph/clusters/{cluster}/pools` | `get_ceph_clusters_cluster_pools` |
| GET | `/ceph/clusters/{cluster}/status` | `get_ceph_clusters_cluster_status` |
| GET | `/ceph/clusters/{cluster}/summary` | `get_ceph_clusters_cluster_summary` |

</details>

<details>
<summary><strong>PDM: Configuration</strong> (43 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/config` | `get_config` |
| GET | `/config/access` | `get_config_access` |
| GET | `/config/access/ad` | `get_config_access_ad` |
| POST | `/config/access/ad` | `post_config_access_ad` |
| DELETE | `/config/access/ad/{realm}` | `delete_config_access_ad_realm` |
| GET | `/config/access/ad/{realm}` | `get_config_access_ad_realm` |
| PUT | `/config/access/ad/{realm}` | `put_config_access_ad_realm` |
| GET | `/config/access/ldap` | `get_config_access_ldap` |
| POST | `/config/access/ldap` | `post_config_access_ldap` |
| DELETE | `/config/access/ldap/{realm}` | `delete_config_access_ldap_realm` |
| GET | `/config/access/ldap/{realm}` | `get_config_access_ldap_realm` |
| PUT | `/config/access/ldap/{realm}` | `put_config_access_ldap_realm` |
| GET | `/config/access/openid` | `get_config_access_openid` |
| POST | `/config/access/openid` | `post_config_access_openid` |
| DELETE | `/config/access/openid/{realm}` | `delete_config_access_openid_realm` |
| GET | `/config/access/openid/{realm}` | `get_config_access_openid_realm` |
| PUT | `/config/access/openid/{realm}` | `put_config_access_openid_realm` |
| GET | `/config/access/tfa` | `get_config_access_tfa` |
| GET | `/config/access/tfa/webauthn` | `get_config_access_tfa_webauthn` |
| PUT | `/config/access/tfa/webauthn` | `put_config_access_tfa_webauthn` |
| GET | `/config/acme` | `get_config_acme` |
| GET | `/config/acme/account` | `get_config_acme_account` |
| POST | `/config/acme/account` | `post_config_acme_account` |
| DELETE | `/config/acme/account/{name}` | `delete_config_acme_account_name` |
| GET | `/config/acme/account/{name}` | `get_config_acme_account_name` |
| PUT | `/config/acme/account/{name}` | `put_config_acme_account_name` |
| GET | `/config/acme/challenge-schema` | `get_config_acme_challenge_schema` |
| GET | `/config/acme/directories` | `get_config_acme_directories` |
| GET | `/config/acme/plugins` | `get_config_acme_plugins` |
| POST | `/config/acme/plugins` | `post_config_acme_plugins` |
| DELETE | `/config/acme/plugins/{id}` | `delete_config_acme_plugins_id` |
| GET | `/config/acme/plugins/{id}` | `get_config_acme_plugins_id` |
| PUT | `/config/acme/plugins/{id}` | `put_config_acme_plugins_id` |
| GET | `/config/acme/tos` | `get_config_acme_tos` |
| GET | `/config/certificate` | `get_config_certificate` |
| PUT | `/config/certificate` | `put_config_certificate` |
| GET | `/config/notes` | `get_config_notes` |
| PUT | `/config/notes` | `put_config_notes` |
| GET | `/config/views` | `get_config_views` |
| POST | `/config/views` | `post_config_views` |
| DELETE | `/config/views/{id}` | `delete_config_views_id` |
| GET | `/config/views/{id}` | `get_config_views_id` |
| PUT | `/config/views/{id}` | `put_config_views_id` |

</details>

<details>
<summary><strong>PDM: Nodes & Guests</strong> (50 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/nodes` | `get_nodes` |
| GET | `/nodes/{node}` | `get_nodes_node` |
| GET | `/nodes/{node}/apt` | `get_nodes_node_apt` |
| GET | `/nodes/{node}/apt/changelog` | `get_nodes_node_apt_changelog` |
| GET | `/nodes/{node}/apt/repositories` | `get_nodes_node_apt_repositories` |
| POST | `/nodes/{node}/apt/repositories` | `post_nodes_node_apt_repositories` |
| PUT | `/nodes/{node}/apt/repositories` | `put_nodes_node_apt_repositories` |
| GET | `/nodes/{node}/apt/update` | `get_nodes_node_apt_update` |
| POST | `/nodes/{node}/apt/update` | `post_nodes_node_apt_update` |
| GET | `/nodes/{node}/apt/versions` | `get_nodes_node_apt_versions` |
| GET | `/nodes/{node}/certificates` | `get_nodes_node_certificates` |
| GET | `/nodes/{node}/certificates/acme` | `get_nodes_node_certificates_acme` |
| POST | `/nodes/{node}/certificates/acme/certificate` | `post_nodes_node_certificates_acme_certificate` |
| PUT | `/nodes/{node}/certificates/acme/certificate` | `put_nodes_node_certificates_acme_certificate` |
| DELETE | `/nodes/{node}/certificates/custom` | `delete_nodes_node_certificates_custom` |
| POST | `/nodes/{node}/certificates/custom` | `post_nodes_node_certificates_custom` |
| GET | `/nodes/{node}/certificates/info` | `get_nodes_node_certificates_info` |
| GET | `/nodes/{node}/config` | `get_nodes_node_config` |
| PUT | `/nodes/{node}/config` | `put_nodes_node_config` |
| GET | `/nodes/{node}/dns` | `get_nodes_node_dns` |
| PUT | `/nodes/{node}/dns` | `put_nodes_node_dns` |
| GET | `/nodes/{node}/journal` | `get_nodes_node_journal` |
| DELETE | `/nodes/{node}/network` | `delete_nodes_node_network` |
| GET | `/nodes/{node}/network` | `get_nodes_node_network` |
| POST | `/nodes/{node}/network` | `post_nodes_node_network` |
| PUT | `/nodes/{node}/network` | `put_nodes_node_network` |
| DELETE | `/nodes/{node}/network/{iface}` | `delete_nodes_node_network_iface` |
| GET | `/nodes/{node}/network/{iface}` | `get_nodes_node_network_iface` |
| PUT | `/nodes/{node}/network/{iface}` | `put_nodes_node_network_iface` |
| GET | `/nodes/{node}/report` | `get_nodes_node_report` |
| GET | `/nodes/{node}/rrddata` | `get_nodes_node_rrddata` |
| GET | `/nodes/{node}/sdn` | `get_nodes_node_sdn` |
| GET | `/nodes/{node}/sdn/vnets/{vnet}` | `get_nodes_node_sdn_vnets_vnet` |
| GET | `/nodes/{node}/sdn/vnets/{vnet}/mac-vrf` | `get_nodes_node_sdn_vnets_vnet_mac_vrf` |
| GET | `/nodes/{node}/sdn/zones/{zone}` | `get_nodes_node_sdn_zones_zone` |
| GET | `/nodes/{node}/sdn/zones/{zone}/ip-vrf` | `get_nodes_node_sdn_zones_zone_ip_vrf` |
| GET | `/nodes/{node}/status` | `get_nodes_node_status` |
| POST | `/nodes/{node}/status` | `post_nodes_node_status` |
| GET | `/nodes/{node}/subscription` | `get_nodes_node_subscription` |
| POST | `/nodes/{node}/subscription` | `post_nodes_node_subscription` |
| GET | `/nodes/{node}/syslog` | `get_nodes_node_syslog` |
| GET | `/nodes/{node}/tasks` | `get_nodes_node_tasks` |
| DELETE | `/nodes/{node}/tasks/{upid}` | `delete_nodes_node_tasks_upid` |
| GET | `/nodes/{node}/tasks/{upid}` | `get_nodes_node_tasks_upid` |
| GET | `/nodes/{node}/tasks/{upid}/log` | `get_nodes_node_tasks_upid_log` |
| GET | `/nodes/{node}/tasks/{upid}/status` | `get_nodes_node_tasks_upid_status` |
| POST | `/nodes/{node}/termproxy` | `post_nodes_node_termproxy` |
| GET | `/nodes/{node}/time` | `get_nodes_node_time` |
| PUT | `/nodes/{node}/time` | `put_nodes_node_time` |
| GET | `/nodes/{node}/vncwebsocket` | `get_nodes_node_vncwebsocket` |

</details>

<details>
<summary><strong>PDM: PBS Remotes</strong> (27 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/pbs` | `get_pbs` |
| POST | `/pbs/probe-tls` | `post_pbs_probe_tls` |
| GET | `/pbs/realms` | `get_pbs_realms` |
| GET | `/pbs/remotes` | `get_pbs_remotes` |
| GET | `/pbs/remotes/{remote}` | `get_pbs_remotes_remote` |
| GET | `/pbs/remotes/{remote}/datastore` | `get_pbs_remotes_remote_datastore` |
| GET | `/pbs/remotes/{remote}/datastore/{datastore}` | `get_pbs_remotes_remote_datastore_datastore` |
| GET | `/pbs/remotes/{remote}/datastore/{datastore}/namespaces` | `get_pbs_remotes_remote_datastore_datastore_namespaces` |
| GET | `/pbs/remotes/{remote}/datastore/{datastore}/rrddata` | `get_pbs_remotes_remote_datastore_datastore_rrddata` |
| GET | `/pbs/remotes/{remote}/datastore/{datastore}/snapshots` | `get_pbs_remotes_remote_datastore_datastore_snapshots` |
| GET | `/pbs/remotes/{remote}/nodes/{node}` | `get_pbs_remotes_remote_nodes_node` |
| GET | `/pbs/remotes/{remote}/nodes/{node}/apt` | `get_pbs_remotes_remote_nodes_node_apt` |
| GET | `/pbs/remotes/{remote}/nodes/{node}/apt/changelog` | `get_pbs_remotes_remote_nodes_node_apt_changelog` |
| GET | `/pbs/remotes/{remote}/nodes/{node}/apt/repositories` | `get_pbs_remotes_remote_nodes_node_apt_repositories` |
| GET | `/pbs/remotes/{remote}/nodes/{node}/apt/update` | `get_pbs_remotes_remote_nodes_node_apt_update` |
| POST | `/pbs/remotes/{remote}/nodes/{node}/apt/update` | `post_pbs_remotes_remote_nodes_node_apt_update` |
| GET | `/pbs/remotes/{remote}/nodes/{node}/subscription` | `get_pbs_remotes_remote_nodes_node_subscription` |
| POST | `/pbs/remotes/{remote}/nodes/{node}/termproxy` | `post_pbs_remotes_remote_nodes_node_termproxy` |
| GET | `/pbs/remotes/{remote}/nodes/{node}/vncwebsocket` | `get_pbs_remotes_remote_nodes_node_vncwebsocket` |
| GET | `/pbs/remotes/{remote}/rrddata` | `get_pbs_remotes_remote_rrddata` |
| GET | `/pbs/remotes/{remote}/status` | `get_pbs_remotes_remote_status` |
| GET | `/pbs/remotes/{remote}/tasks` | `get_pbs_remotes_remote_tasks` |
| DELETE | `/pbs/remotes/{remote}/tasks/{upid}` | `delete_pbs_remotes_remote_tasks_upid` |
| GET | `/pbs/remotes/{remote}/tasks/{upid}` | `get_pbs_remotes_remote_tasks_upid` |
| GET | `/pbs/remotes/{remote}/tasks/{upid}/log` | `get_pbs_remotes_remote_tasks_upid_log` |
| GET | `/pbs/remotes/{remote}/tasks/{upid}/status` | `get_pbs_remotes_remote_tasks_upid_status` |
| POST | `/pbs/scan` | `post_pbs_scan` |

</details>

<details>
<summary><strong>PDM: PVE Remotes</strong> (93 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/pve` | `get_pve` |
| GET | `/pve/firewall` | `get_pve_firewall` |
| GET | `/pve/firewall/status` | `get_pve_firewall_status` |
| POST | `/pve/probe-tls` | `post_pve_probe_tls` |
| GET | `/pve/realms` | `get_pve_realms` |
| GET | `/pve/remotes` | `get_pve_remotes` |
| GET | `/pve/remotes/{remote}` | `get_pve_remotes_remote` |
| GET | `/pve/remotes/{remote}/cluster-nextid` | `get_pve_remotes_remote_cluster_nextid` |
| GET | `/pve/remotes/{remote}/cluster-status` | `get_pve_remotes_remote_cluster_status` |
| GET | `/pve/remotes/{remote}/firewall` | `get_pve_remotes_remote_firewall` |
| GET | `/pve/remotes/{remote}/firewall/options` | `get_pve_remotes_remote_firewall_options` |
| PUT | `/pve/remotes/{remote}/firewall/options` | `put_pve_remotes_remote_firewall_options` |
| GET | `/pve/remotes/{remote}/firewall/rules` | `get_pve_remotes_remote_firewall_rules` |
| GET | `/pve/remotes/{remote}/firewall/status` | `get_pve_remotes_remote_firewall_status` |
| GET | `/pve/remotes/{remote}/lxc` | `get_pve_remotes_remote_lxc` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}` | `get_pve_remotes_remote_lxc_vmid` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}/config` | `get_pve_remotes_remote_lxc_vmid_config` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}/firewall` | `get_pve_remotes_remote_lxc_vmid_firewall` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}/firewall/options` | `get_pve_remotes_remote_lxc_vmid_firewall_options` |
| PUT | `/pve/remotes/{remote}/lxc/{vmid}/firewall/options` | `put_pve_remotes_remote_lxc_vmid_firewall_options` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}/firewall/rules` | `get_pve_remotes_remote_lxc_vmid_firewall_rules` |
| POST | `/pve/remotes/{remote}/lxc/{vmid}/migrate` | `post_pve_remotes_remote_lxc_vmid_migrate` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}/pending` | `get_pve_remotes_remote_lxc_vmid_pending` |
| POST | `/pve/remotes/{remote}/lxc/{vmid}/remote-migrate` | `post_pve_remotes_remote_lxc_vmid_remote_migrate` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}/rrddata` | `get_pve_remotes_remote_lxc_vmid_rrddata` |
| POST | `/pve/remotes/{remote}/lxc/{vmid}/shutdown` | `post_pve_remotes_remote_lxc_vmid_shutdown` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}/snapshot` | `get_pve_remotes_remote_lxc_vmid_snapshot` |
| POST | `/pve/remotes/{remote}/lxc/{vmid}/snapshot` | `post_pve_remotes_remote_lxc_vmid_snapshot` |
| DELETE | `/pve/remotes/{remote}/lxc/{vmid}/snapshot/{snapname}` | `delete_pve_remotes_remote_lxc_vmid_snapshot_snapname` |
| PUT | `/pve/remotes/{remote}/lxc/{vmid}/snapshot/{snapname}/config` | `put_pve_remotes_remote_lxc_vmid_snapshot_snapname_config` |
| POST | `/pve/remotes/{remote}/lxc/{vmid}/snapshot/{snapname}/rollback` | `post_pve_remotes_remote_lxc_vmid_snapshot_snapname_rollback` |
| POST | `/pve/remotes/{remote}/lxc/{vmid}/start` | `post_pve_remotes_remote_lxc_vmid_start` |
| GET | `/pve/remotes/{remote}/lxc/{vmid}/status` | `get_pve_remotes_remote_lxc_vmid_status` |
| POST | `/pve/remotes/{remote}/lxc/{vmid}/stop` | `post_pve_remotes_remote_lxc_vmid_stop` |
| GET | `/pve/remotes/{remote}/nodes` | `get_pve_remotes_remote_nodes` |
| GET | `/pve/remotes/{remote}/nodes/{node}` | `get_pve_remotes_remote_nodes_node` |
| GET | `/pve/remotes/{remote}/nodes/{node}/apt` | `get_pve_remotes_remote_nodes_node_apt` |
| GET | `/pve/remotes/{remote}/nodes/{node}/apt/changelog` | `get_pve_remotes_remote_nodes_node_apt_changelog` |
| GET | `/pve/remotes/{remote}/nodes/{node}/apt/repositories` | `get_pve_remotes_remote_nodes_node_apt_repositories` |
| GET | `/pve/remotes/{remote}/nodes/{node}/apt/update` | `get_pve_remotes_remote_nodes_node_apt_update` |
| POST | `/pve/remotes/{remote}/nodes/{node}/apt/update` | `post_pve_remotes_remote_nodes_node_apt_update` |
| GET | `/pve/remotes/{remote}/nodes/{node}/config` | `get_pve_remotes_remote_nodes_node_config` |
| GET | `/pve/remotes/{remote}/nodes/{node}/firewall` | `get_pve_remotes_remote_nodes_node_firewall` |
| GET | `/pve/remotes/{remote}/nodes/{node}/firewall/options` | `get_pve_remotes_remote_nodes_node_firewall_options` |
| PUT | `/pve/remotes/{remote}/nodes/{node}/firewall/options` | `put_pve_remotes_remote_nodes_node_firewall_options` |
| GET | `/pve/remotes/{remote}/nodes/{node}/firewall/rules` | `get_pve_remotes_remote_nodes_node_firewall_rules` |
| GET | `/pve/remotes/{remote}/nodes/{node}/firewall/status` | `get_pve_remotes_remote_nodes_node_firewall_status` |
| GET | `/pve/remotes/{remote}/nodes/{node}/network` | `get_pve_remotes_remote_nodes_node_network` |
| GET | `/pve/remotes/{remote}/nodes/{node}/rrddata` | `get_pve_remotes_remote_nodes_node_rrddata` |
| GET | `/pve/remotes/{remote}/nodes/{node}/sdn` | `get_pve_remotes_remote_nodes_node_sdn` |
| GET | `/pve/remotes/{remote}/nodes/{node}/sdn/vnets/{vnet}` | `get_pve_remotes_remote_nodes_node_sdn_vnets_vnet` |
| GET | `/pve/remotes/{remote}/nodes/{node}/sdn/vnets/{vnet}/mac-vrf` | `get_pve_remotes_remote_nodes_node_sdn_vnets_vnet_mac_vrf` |
| GET | `/pve/remotes/{remote}/nodes/{node}/sdn/zones/{zone}` | `get_pve_remotes_remote_nodes_node_sdn_zones_zone` |
| GET | `/pve/remotes/{remote}/nodes/{node}/sdn/zones/{zone}/ip-vrf` | `get_pve_remotes_remote_nodes_node_sdn_zones_zone_ip_vrf` |
| GET | `/pve/remotes/{remote}/nodes/{node}/status` | `get_pve_remotes_remote_nodes_node_status` |
| GET | `/pve/remotes/{remote}/nodes/{node}/storage` | `get_pve_remotes_remote_nodes_node_storage` |
| GET | `/pve/remotes/{remote}/nodes/{node}/storage/{storage}` | `get_pve_remotes_remote_nodes_node_storage_storage` |
| GET | `/pve/remotes/{remote}/nodes/{node}/storage/{storage}/rrddata` | `get_pve_remotes_remote_nodes_node_storage_storage_rrddata` |
| GET | `/pve/remotes/{remote}/nodes/{node}/storage/{storage}/status` | `get_pve_remotes_remote_nodes_node_storage_storage_status` |
| GET | `/pve/remotes/{remote}/nodes/{node}/subscription` | `get_pve_remotes_remote_nodes_node_subscription` |
| POST | `/pve/remotes/{remote}/nodes/{node}/termproxy` | `post_pve_remotes_remote_nodes_node_termproxy` |
| GET | `/pve/remotes/{remote}/nodes/{node}/vncwebsocket` | `get_pve_remotes_remote_nodes_node_vncwebsocket` |
| GET | `/pve/remotes/{remote}/options` | `get_pve_remotes_remote_options` |
| GET | `/pve/remotes/{remote}/qemu` | `get_pve_remotes_remote_qemu` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}` | `get_pve_remotes_remote_qemu_vmid` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/config` | `get_pve_remotes_remote_qemu_vmid_config` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/firewall` | `get_pve_remotes_remote_qemu_vmid_firewall` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/firewall/options` | `get_pve_remotes_remote_qemu_vmid_firewall_options` |
| PUT | `/pve/remotes/{remote}/qemu/{vmid}/firewall/options` | `put_pve_remotes_remote_qemu_vmid_firewall_options` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/firewall/rules` | `get_pve_remotes_remote_qemu_vmid_firewall_rules` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/migrate` | `get_pve_remotes_remote_qemu_vmid_migrate` |
| POST | `/pve/remotes/{remote}/qemu/{vmid}/migrate` | `post_pve_remotes_remote_qemu_vmid_migrate` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/pending` | `get_pve_remotes_remote_qemu_vmid_pending` |
| POST | `/pve/remotes/{remote}/qemu/{vmid}/remote-migrate` | `post_pve_remotes_remote_qemu_vmid_remote_migrate` |
| POST | `/pve/remotes/{remote}/qemu/{vmid}/resume` | `post_pve_remotes_remote_qemu_vmid_resume` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/rrddata` | `get_pve_remotes_remote_qemu_vmid_rrddata` |
| POST | `/pve/remotes/{remote}/qemu/{vmid}/shutdown` | `post_pve_remotes_remote_qemu_vmid_shutdown` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/snapshot` | `get_pve_remotes_remote_qemu_vmid_snapshot` |
| POST | `/pve/remotes/{remote}/qemu/{vmid}/snapshot` | `post_pve_remotes_remote_qemu_vmid_snapshot` |
| DELETE | `/pve/remotes/{remote}/qemu/{vmid}/snapshot/{snapname}` | `delete_pve_remotes_remote_qemu_vmid_snapshot_snapname` |
| PUT | `/pve/remotes/{remote}/qemu/{vmid}/snapshot/{snapname}/config` | `put_pve_remotes_remote_qemu_vmid_snapshot_snapname_config` |
| POST | `/pve/remotes/{remote}/qemu/{vmid}/snapshot/{snapname}/rollback` | `post_pve_remotes_remote_qemu_vmid_snapshot_snapname_rollback` |
| POST | `/pve/remotes/{remote}/qemu/{vmid}/start` | `post_pve_remotes_remote_qemu_vmid_start` |
| GET | `/pve/remotes/{remote}/qemu/{vmid}/status` | `get_pve_remotes_remote_qemu_vmid_status` |
| POST | `/pve/remotes/{remote}/qemu/{vmid}/stop` | `post_pve_remotes_remote_qemu_vmid_stop` |
| GET | `/pve/remotes/{remote}/resources` | `get_pve_remotes_remote_resources` |
| GET | `/pve/remotes/{remote}/tasks` | `get_pve_remotes_remote_tasks` |
| DELETE | `/pve/remotes/{remote}/tasks/{upid}` | `delete_pve_remotes_remote_tasks_upid` |
| GET | `/pve/remotes/{remote}/tasks/{upid}` | `get_pve_remotes_remote_tasks_upid` |
| GET | `/pve/remotes/{remote}/tasks/{upid}/log` | `get_pve_remotes_remote_tasks_upid_log` |
| GET | `/pve/remotes/{remote}/tasks/{upid}/status` | `get_pve_remotes_remote_tasks_upid_status` |
| GET | `/pve/remotes/{remote}/updates` | `get_pve_remotes_remote_updates` |
| POST | `/pve/scan` | `post_pve_scan` |

</details>

<details>
<summary><strong>PDM: Ping</strong> (1 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/ping` | `get_ping` |

</details>

<details>
<summary><strong>PDM: Remotes</strong> (19 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/remotes` | `get_remotes` |
| GET | `/remotes/metric-collection/status` | `get_remotes_metric_collection_status` |
| POST | `/remotes/metric-collection/trigger` | `post_remotes_metric_collection_trigger` |
| GET | `/remotes/remote` | `get_remotes_remote` |
| POST | `/remotes/remote` | `post_remotes_remote` |
| DELETE | `/remotes/remote/{id}` | `delete_remotes_remote_id` |
| GET | `/remotes/remote/{id}` | `get_remotes_remote_id` |
| PUT | `/remotes/remote/{id}` | `put_remotes_remote_id` |
| GET | `/remotes/remote/{id}/config` | `get_remotes_remote_id_config` |
| POST | `/remotes/remote/{id}/probe-certificate` | `post_remotes_remote_id_probe_certificate` |
| GET | `/remotes/remote/{id}/rrddata` | `get_remotes_remote_id_rrddata` |
| GET | `/remotes/remote/{id}/version` | `get_remotes_remote_id_version` |
| GET | `/remotes/tasks` | `get_remotes_tasks` |
| GET | `/remotes/tasks/list` | `get_remotes_tasks_list` |
| POST | `/remotes/tasks/refresh` | `post_remotes_tasks_refresh` |
| GET | `/remotes/tasks/statistics` | `get_remotes_tasks_statistics` |
| GET | `/remotes/updates` | `get_remotes_updates` |
| POST | `/remotes/updates/refresh` | `post_remotes_updates_refresh` |
| GET | `/remotes/updates/summary` | `get_remotes_updates_summary` |

</details>

<details>
<summary><strong>PDM: Resources</strong> (6 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/resources` | `get_resources` |
| GET | `/resources/list` | `get_resources_list` |
| GET | `/resources/location-info` | `get_resources_location_info` |
| GET | `/resources/status` | `get_resources_status` |
| GET | `/resources/subscription` | `get_resources_subscription` |
| GET | `/resources/top-entities` | `get_resources_top_entities` |

</details>

<details>
<summary><strong>PDM: Root</strong> (1 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/` | `get_` |

</details>

<details>
<summary><strong>PDM: SDN</strong> (6 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/sdn` | `get_sdn` |
| GET | `/sdn/controllers` | `get_sdn_controllers` |
| GET | `/sdn/vnets` | `get_sdn_vnets` |
| POST | `/sdn/vnets` | `post_sdn_vnets` |
| GET | `/sdn/zones` | `get_sdn_zones` |
| POST | `/sdn/zones` | `post_sdn_zones` |

</details>

<details>
<summary><strong>PDM: Subscriptions</strong> (17 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/subscriptions` | `get_subscriptions` |
| POST | `/subscriptions/adopt-all` | `post_subscriptions_adopt_all` |
| POST | `/subscriptions/adopt-key` | `post_subscriptions_adopt_key` |
| POST | `/subscriptions/apply-pending` | `post_subscriptions_apply_pending` |
| POST | `/subscriptions/auto-assign` | `post_subscriptions_auto_assign` |
| POST | `/subscriptions/bulk-assign` | `post_subscriptions_bulk_assign` |
| POST | `/subscriptions/check` | `post_subscriptions_check` |
| POST | `/subscriptions/clear-pending` | `post_subscriptions_clear_pending` |
| GET | `/subscriptions/keys` | `get_subscriptions_keys` |
| POST | `/subscriptions/keys` | `post_subscriptions_keys` |
| DELETE | `/subscriptions/keys/{key}` | `delete_subscriptions_keys_key` |
| GET | `/subscriptions/keys/{key}` | `get_subscriptions_keys_key` |
| DELETE | `/subscriptions/keys/{key}/assignment` | `delete_subscriptions_keys_key_assignment` |
| POST | `/subscriptions/keys/{key}/assignment` | `post_subscriptions_keys_key_assignment` |
| GET | `/subscriptions/node-status` | `get_subscriptions_node_status` |
| POST | `/subscriptions/queue-clear` | `post_subscriptions_queue_clear` |
| POST | `/subscriptions/revert-pending-clear` | `post_subscriptions_revert_pending_clear` |

</details>

<details>
<summary><strong>PDM: System</strong> (1 operations)</summary>

| Method | Path | Operation ID |
|---|---|---|
| GET | `/version` | `get_version` |

</details>

The catalog is generated deterministically from Proxmox's published API schema (`apidoc.js`): refresh it with `npm run regen` after downloading a new schema into `_source/`, then rebuild this section with `node scripts/generate-api-coverage.mjs`.

## Contributing

Contributions and issues are welcome. Please open an issue first before submitting a PR.

## License

AGPL-3.0: free for personal and open-source use. Organizations that cannot comply with the AGPL can purchase a commercial license, and hosted/managed versions are available. See [COMMERCIAL.md](https://github.com/NightSquawk/proxmox-mcp-server/blob/v1.0.0/COMMERCIAL.md) or contact hello@nightsquawk.tech.

### Copyright

For copyright concerns or takedown requests, contact hello@nightsquawk.tech.
