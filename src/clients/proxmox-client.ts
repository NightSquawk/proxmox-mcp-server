import { fetch, Agent } from "undici";
import { formatError } from "@nightsquawktech/mcp-core/catalog";
import { Surface, resolveSurfaceConfig } from "../config.js";
import { EndpointSpec } from "../catalog/endpoint-spec.js";
import { ToolResponse } from "@nightsquawktech/mcp-core/catalog";

export interface RequestArgs {
  /** Values for {placeholder} path parameters. */
  pathParams?: Record<string, any>;
  /** Query params (GET/DELETE) or JSON body fields (POST/PUT). */
  params?: Record<string, any>;
}

/**
 * Thin Proxmox REST client for one surface (PVE or PDM). Handles token auth,
 * self-signed TLS (per-surface), path-param substitution, and routing of
 * non-path params to the query string or JSON body per the endpoint spec.
 *
 * Lazily reads env on first request so missing credentials surface as a clear
 * tool error rather than crashing the server at startup.
 */
export class ProxmoxClient {
  private initialized = false;
  private baseUrl = "";
  private authHeader = "";
  private dispatcher: Agent | null = null;

  constructor(private surface: Surface) {}

  private ensureInitialized(): void {
    if (this.initialized) return;
    const { config, missing } = resolveSurfaceConfig(this.surface);
    if (!config) {
      throw new Error(
        `${this.surface.toUpperCase()} is not configured. Missing: ${missing.join(", ")}.`
      );
    }
    this.baseUrl = config.baseUrl;
    this.authHeader = config.authHeader;
    this.dispatcher = new Agent({ connect: { rejectUnauthorized: config.rejectUnauthorized } });
    this.initialized = true;
  }

  async request(spec: EndpointSpec, args: RequestArgs = {}): Promise<ToolResponse<any>> {
    try {
      this.ensureInitialized();

      // Substitute {placeholder} path params.
      let path = spec.path;
      for (const pp of spec.pathParams) {
        const v = args.pathParams?.[pp.name];
        if (v === undefined || v === null || v === "") {
          throw new Error(`Missing path parameter "${pp.name}" for ${spec.method} ${spec.path}`);
        }
        path = path.replace(`{${pp.name}}`, encodeURIComponent(String(v)));
      }

      let url = `${this.baseUrl}${path}`;
      const headers: Record<string, string> = { Authorization: this.authHeader };
      let body: string | undefined;

      const entries = Object.entries(args.params ?? {}).filter(
        ([, v]) => v !== undefined && v !== null
      );

      if (spec.paramLocation === "body" && entries.length) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(Object.fromEntries(entries));
      } else if (entries.length) {
        const qs = entries
          .map(([k, v]) => {
            const val = Array.isArray(v)
              ? v.join(",")
              : typeof v === "boolean"
                ? v ? "1" : "0"
                : String(v);
            return `${encodeURIComponent(k)}=${encodeURIComponent(val)}`;
          })
          .join("&");
        url += `?${qs}`;
      }

      const res = await fetch(url, {
        method: spec.method,
        headers,
        body,
        dispatcher: this.dispatcher!,
      });

      const text = await res.text();
      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (!res.ok) {
        const detail = typeof data === "string" ? data : JSON.stringify(data);
        return { result: null, isError: true, error: `HTTP ${res.status} ${res.statusText}: ${detail}` };
      }

      // Proxmox wraps payloads as { data: ... }. Return the whole object.
      return { result: data, isError: false, error: null };
    } catch (error) {
      return { result: null, isError: true, error: formatError(error) };
    }
  }
}
