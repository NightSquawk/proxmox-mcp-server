import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createCatalogStore, type CatalogStore } from "@nightsquawktech/mcp-core/catalog";
import { Surface } from "../config.js";

/**
 * Types + loader for the Proxmox endpoint catalogs (one per surface).
 *
 * The catalogs are the single source of truth for every API operation and its
 * parameters, generated deterministically from Proxmox's published apidoc.js
 * schema (see scripts/extract.mjs + scripts/assemble-catalog.mjs). The
 * consolidated tools (list/describe/call) read from here, so we do NOT define
 * ~993 individual tools — six catalog-backed tools cover both surfaces.
 *
 * Structural fields come straight from Proxmox and are authoritative. An
 * optional, additive `enrichment/<operationId>.json` layer (usageNotes,
 * examples, destructiveReason) is merged in at describe time and never alters
 * structural fields.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  format?: string;
  enum?: any[];
  default?: any;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  typetext?: string;
  pattern?: string;
}

export interface EndpointSpec {
  operationId: string;
  surface: Surface;
  resource: string;
  category: string;
  name: string;
  method: HttpMethod;
  path: string;
  description: string;
  writeOperation: boolean;
  destructive: boolean;
  protected: boolean;
  allowtoken: boolean;
  /** Where non-path params go: "query" (GET/DELETE) or "body" (POST/PUT). */
  paramLocation: "query" | "body";
  pathParams: EndpointParam[];
  params: EndpointParam[];
  returns: any;
  permissions: any;
  requestSample: string;
}

export interface IndexEntry {
  operationId: string;
  resource: string;
  category: string;
  name: string;
  method: HttpMethod;
  path: string;
  description: string;
  writeOperation: boolean;
  destructive: boolean;
}

export interface CatalogIndex {
  surface: Surface;
  product: string;
  generatedFrom: string;
  defaultBaseUrl: string;
  authScheme: string;
  endpointCount: number;
  readCount: number;
  writeCount: number;
  categories: string[];
  endpoints: IndexEntry[];
}

/** Optional additive enrichment — never contains structural fields. */
export interface Enrichment {
  operationId: string;
  usageNotes?: string;
  examples?: any[];
  destructiveReason?: string;
  tips?: string[];
  relatedOperations?: string[];
}

// Path resolution stays HERE, in the server, so it points at this server's
// bundled catalog (dist/catalog-<surface>) and not at the mcp-core package.
// The core loader receives the resolved directory and never derives it from
// its own module location.
const baseDir = dirname(fileURLToPath(import.meta.url)); // dist/catalog
function surfaceDir(surface: Surface): string {
  return join(baseDir, "..", `catalog-${surface}`);
}

const stores = new Map<Surface, CatalogStore<CatalogIndex>>();
function store(surface: Surface): CatalogStore<CatalogIndex> {
  let s = stores.get(surface);
  if (!s) {
    s = createCatalogStore<CatalogIndex>(surfaceDir(surface));
    stores.set(surface, s);
  }
  return s;
}

export function loadIndex(surface: Surface): CatalogIndex {
  return store(surface).index();
}

export function loadEndpointSpec(surface: Surface, operationId: string): EndpointSpec | null {
  // Entries live under endpoints/; the core store guards against path traversal.
  return store(surface).entry<EndpointSpec>(operationId);
}

export function loadEnrichment(surface: Surface, operationId: string): Enrichment | null {
  // Optional additive layer under enrichment/ — missing files resolve to null.
  return store(surface).entry<Enrichment>(operationId, "enrichment");
}

export function isKnownEndpoint(surface: Surface, operationId: string): boolean {
  return loadIndex(surface).endpoints.some((e) => e.operationId === operationId);
}
