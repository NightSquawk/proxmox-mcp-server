import { z } from "zod";
import { ToolDefinition } from "@nightsquawktech/mcp-core/catalog";
import { Surface, SURFACE_DEFAULTS } from "../config.js";
import { loadIndex } from "../catalog/endpoint-spec.js";

const schema = z.object({
  category: z.string().optional().describe("Filter by category (call with no args to see all categories)."),
  resource: z.string().optional().describe("Filter by resource = the path's first segment, e.g. 'nodes', 'cluster', 'access'."),
  method: z.string().optional().describe("Filter by HTTP method: GET, POST, PUT, or DELETE."),
  reads_only: z.boolean().optional().describe("Only read (GET) endpoints."),
  writes_only: z.boolean().optional().describe("Only write (POST/PUT/DELETE) endpoints."),
  search: z.string().optional().describe("Case-insensitive substring match on operationId, path, name, or description."),
  limit: z.number().optional().describe("Max endpoints to return (default 200). Narrow with filters/search for big surfaces."),
});

export function makeListEndpointsTool(surface: Surface): ToolDefinition<typeof schema> {
  const product = SURFACE_DEFAULTS[surface].product;
  return {
    name: `${surface}_list_endpoints`,
    description:
      `List ${product} API endpoints (operationId, method, path, category, description, ` +
      `read/write, destructive). Filter by category, resource, method, reads/writes, or search. ` +
      `Use this to discover an endpoint, then ${surface}_describe_endpoint for its parameters and ` +
      `${surface}_call_endpoint to execute it.`,
    schema,
    handler: async ({ params }: any) => {
      const index = loadIndex(surface);
      let eps = index.endpoints;

      const category: string | undefined = params?.category;
      const resource: string | undefined = params?.resource;
      const method: string | undefined = params?.method?.toUpperCase();
      const search: string | undefined = params?.search?.toLowerCase();

      if (category) eps = eps.filter((e) => e.category.toLowerCase() === category.toLowerCase());
      if (resource) eps = eps.filter((e) => e.resource.toLowerCase() === resource.toLowerCase());
      if (method) eps = eps.filter((e) => e.method === method);
      if (params?.reads_only) eps = eps.filter((e) => !e.writeOperation);
      if (params?.writes_only) eps = eps.filter((e) => e.writeOperation);
      if (search) {
        eps = eps.filter(
          (e) =>
            e.operationId.toLowerCase().includes(search) ||
            e.path.toLowerCase().includes(search) ||
            e.name.toLowerCase().includes(search) ||
            e.description.toLowerCase().includes(search)
        );
      }

      const categories = [...new Set(index.endpoints.map((e) => e.category))].sort();
      const limit: number = params?.limit ?? 200;
      const matched = eps.length;
      const truncated = matched > limit;
      const shown = eps.slice(0, limit);

      const payload = {
        surface,
        product,
        matched,
        shown: shown.length,
        truncated,
        totalEndpoints: index.endpointCount,
        readCount: index.readCount,
        writeCount: index.writeCount,
        categories,
        ...(truncated
          ? { note: `Showing ${shown.length} of ${matched}. Narrow with category/resource/method/search or raise limit.` }
          : {}),
        endpoints: shown.map((e) => ({
          operation_id: e.operationId,
          method: e.method,
          path: e.path,
          name: e.name,
          category: e.category,
          resource: e.resource,
          description: e.description,
          writeOperation: e.writeOperation,
          ...(e.destructive ? { destructive: true } : {}),
        })),
      };

      return { content: [{ type: "text" as const, text: JSON.stringify(payload) }] };
    },
  };
}
