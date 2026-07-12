import { z } from "zod";
import { ToolDefinition } from "@nightsquawktech/mcp-core/catalog";
import { Surface, SURFACE_DEFAULTS, writesAllowed, writeGateEnvHint } from "../config.js";
import { loadEndpointSpec, loadEnrichment, loadIndex } from "../catalog/endpoint-spec.js";

const schema = z.object({
  operation_id: z
    .string()
    .describe("The endpoint operationId, e.g. 'get_nodes' or 'post_nodes_node_qemu'. See list_endpoints."),
});

export function makeDescribeEndpointTool(surface: Surface): ToolDefinition<typeof schema> {
  const product = SURFACE_DEFAULTS[surface].product;
  return {
    name: `${surface}_describe_endpoint`,
    description:
      `Get the full spec for one ${product} endpoint: method, path, path params, query/body ` +
      `params (with types, formats, enums, constraints), the response schema, required permissions, ` +
      `and a request sample. Call before ${surface}_call_endpoint so you send exactly the right params.`,
    schema,
    handler: async ({ params }: any) => {
      const operationId: string = params?.operation_id;
      const spec = loadEndpointSpec(surface, operationId);

      if (!spec) {
        const known = loadIndex(surface).endpoints.map((e) => e.operationId);
        const suggestions = known
          .filter((id) => operationId && (id.includes(operationId) || operationId.includes(id)))
          .slice(0, 5);
        return {
          content: [
            {
              type: "text" as const,
              text:
                `Unknown endpoint "${operationId}" on ${surface}. ` +
                (suggestions.length ? `Did you mean: ${suggestions.join(", ")}? ` : "") +
                `Call ${surface}_list_endpoints to discover endpoints.`,
            },
          ],
        };
      }

      const enrichment = loadEnrichment(surface, operationId);

      const payload: Record<string, any> = {
        operation_id: spec.operationId,
        surface,
        name: spec.name,
        method: spec.method,
        path: spec.path,
        description: spec.description,
        category: spec.category,
        resource: spec.resource,
        writeOperation: spec.writeOperation,
        destructive: spec.destructive,
        protected: spec.protected,
        paramLocation: spec.paramLocation,
        pathParams: spec.pathParams,
        params: spec.params,
        returns: spec.returns,
        permissions: spec.permissions,
        requestSample: spec.requestSample,
      };

      if (spec.writeOperation) {
        payload.writeStatus = writesAllowed(surface)
          ? "Writes ENABLED for this surface."
          : `Writes DISABLED (read-only). Enable with ${writeGateEnvHint(surface)}.`;
      }
      if (enrichment) {
        payload.enrichment = {
          ...(enrichment.usageNotes ? { usageNotes: enrichment.usageNotes } : {}),
          ...(enrichment.examples ? { examples: enrichment.examples } : {}),
          ...(enrichment.destructiveReason ? { destructiveReason: enrichment.destructiveReason } : {}),
          ...(enrichment.tips ? { tips: enrichment.tips } : {}),
          ...(enrichment.relatedOperations ? { relatedOperations: enrichment.relatedOperations } : {}),
        };
      }

      return { content: [{ type: "text" as const, text: JSON.stringify(payload) }] };
    },
  };
}
