import { z } from "zod";
import { ToolDefinition } from "@nightsquawktech/mcp-core/catalog";
import { Surface, SURFACE_DEFAULTS, writesAllowed, writeGateEnvHint } from "../config.js";
import { loadEndpointSpec, loadEnrichment, loadIndex } from "../catalog/endpoint-spec.js";
import { ProxmoxClient } from "../clients/proxmox-client.js";

const schema = z.object({
  operation_id: z
    .string()
    .describe("The endpoint operationId to call, e.g. 'get_nodes'. See list_endpoints / describe_endpoint."),
  path_params: z
    .record(z.any())
    .optional()
    .describe("Values for {placeholder} path params, e.g. { node: 'pve1', vmid: 100 }."),
  params: z
    .record(z.any())
    .optional()
    .describe("Non-path params: query params for GET/DELETE, JSON body fields for POST/PUT. See describe_endpoint."),
  confirm: z
    .boolean()
    .optional()
    .describe("Must be true to execute a DESTRUCTIVE operation (delete/stop/reset/migrate/etc.), even when writes are enabled."),
});

function errorText(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function makeCallEndpointTool(surface: Surface, client: ProxmoxClient): ToolDefinition<typeof schema> {
  const product = SURFACE_DEFAULTS[surface].product;
  return {
    name: `${surface}_call_endpoint`,
    description:
      `Call a ${product} API endpoint and return its JSON response. Validates the operationId and ` +
      `required path params against the catalog, enforces the read-only write gate, then executes. ` +
      `Reads (GET) always run; writes (POST/PUT/DELETE) run only when enabled via ${writeGateEnvHint(surface)}. ` +
      `Use ${surface}_describe_endpoint first to learn the exact params.`,
    schema,
    handler: async ({ params }: any) => {
      const operationId: string = params?.operation_id;
      const spec = loadEndpointSpec(surface, operationId);

      if (!spec) {
        const known = loadIndex(surface).endpoints.map((e) => e.operationId);
        const suggestions = known
          .filter((id) => operationId && (id.includes(operationId) || operationId.includes(id)))
          .slice(0, 5);
        return errorText(
          `Unknown endpoint "${operationId}" on ${surface}. ` +
            (suggestions.length ? `Did you mean: ${suggestions.join(", ")}? ` : "") +
            `Call ${surface}_list_endpoints to discover endpoints.`
        );
      }

      // Required path params (hard — the URL can't be built without them).
      const provided = params?.path_params ?? {};
      const missing = spec.pathParams
        .filter((p) => p.required)
        .filter((p) => {
          const v = provided[p.name];
          return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
        });
      if (missing.length) {
        return errorText(
          `Missing required path parameter(s) for "${spec.operationId}" (${spec.method} ${spec.path}): ` +
            `${missing.map((p) => p.name).join(", ")}. Call ${surface}_describe_endpoint("${spec.operationId}").`
        );
      }

      // Write gate — read-only unless explicitly enabled.
      if (spec.writeOperation && !writesAllowed(surface)) {
        return errorText(
          `"${spec.operationId}" is a WRITE (${spec.method} ${spec.path}) and writes are disabled (read-only mode). ` +
            `Enable with ${writeGateEnvHint(surface)}, then retry.`
        );
      }

      // Destructive ops need an explicit confirm even when writes are enabled.
      if (spec.destructive && params?.confirm !== true) {
        const enrichment = loadEnrichment(surface, operationId);
        const reason = enrichment?.destructiveReason || "This operation can cause data loss or service disruption.";
        return errorText(
          `"${spec.operationId}" (${spec.method} ${spec.path}) is flagged DESTRUCTIVE. ${reason} ` +
            `Re-call with confirm:true to proceed.`
        );
      }

      const response = await client.request(spec, {
        pathParams: provided,
        params: params?.params,
      });

      if (response.isError) {
        return errorText(`Error calling ${spec.operationId} (${spec.method} ${spec.path}): ${response.error}`);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              operation_id: spec.operationId,
              surface,
              method: spec.method,
              path: spec.path,
              result: response.result,
            }),
          },
        ],
      };
    },
  };
}
