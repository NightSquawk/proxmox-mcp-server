import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RegisterTool } from "@nightsquawktech/mcp-core/catalog";
import { Surface } from "../config.js";
import { loadIndex } from "../catalog/endpoint-spec.js";
import { ProxmoxClient } from "../clients/proxmox-client.js";
import { makeListEndpointsTool } from "../tools/list-endpoints.js";
import { makeDescribeEndpointTool } from "../tools/describe-endpoint.js";
import { makeCallEndpointTool } from "../tools/call-endpoint.js";

/**
 * Registers the three catalog-backed tools for one surface:
 *   <surface>_list_endpoints      discover endpoints
 *   <surface>_describe_endpoint   full param + response spec (+ enrichment)
 *   <surface>_call_endpoint       validate, write-gate, execute
 *
 * Boot-time sanity check: the catalog index must load and be non-empty, so a
 * missing/uncopied catalog fails fast at startup rather than on first call.
 */
export function registerSurfaceTools(server: McpServer, surface: Surface): void {
  const index = loadIndex(surface);
  if (!index.endpoints || index.endpoints.length === 0) {
    throw new Error(
      `${surface} catalog is empty or missing — expected src/catalog-${surface}/index.json. ` +
        `Did the build copy the catalog into dist/? Run scripts/extract.mjs + scripts/assemble-catalog.mjs.`
    );
  }

  const client = new ProxmoxClient(surface);
  RegisterTool(server, makeListEndpointsTool(surface));
  RegisterTool(server, makeDescribeEndpointTool(surface));
  RegisterTool(server, makeCallEndpointTool(surface, client));
}
