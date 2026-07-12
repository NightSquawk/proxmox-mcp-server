/**
 * Per-surface configuration, resolved lazily from environment variables so the
 * server can boot (and serve the catalog) without credentials. A surface's
 * `call` tool only errors at call time if its vars are unset.
 *
 * Auth note: PVE uses `PVEAPIToken=USER@REALM!TOKENID=SECRET`. Other Proxmox
 * products may differ in scheme name or the id/secret separator, so both are
 * overridable via `<SURFACE>_AUTH_SCHEME` / `<SURFACE>_AUTH_SEP`.
 */

export type Surface = "pve" | "pdm";

export const SURFACE_DEFAULTS: Record<
  Surface,
  { product: string; port: number; authScheme: string }
> = {
  pve: { product: "Proxmox VE", port: 8006, authScheme: "PVEAPIToken" },
  pdm: { product: "Proxmox Datacenter Manager", port: 8443, authScheme: "PDMAPIToken" },
};

export interface ResolvedSurfaceConfig {
  baseUrl: string;
  authHeader: string;
  rejectUnauthorized: boolean;
}

/** Resolve a surface's connection config, or report which env vars are missing. */
export function resolveSurfaceConfig(surface: Surface): {
  config: ResolvedSurfaceConfig | null;
  missing: string[];
} {
  const S = surface.toUpperCase();
  const d = SURFACE_DEFAULTS[surface];

  const host = process.env[`${S}_HOST`];
  const baseUrl = process.env[`${S}_BASE_URL`] || (host ? `https://${host}:${d.port}/api2/json` : "");
  const tokenId = process.env[`${S}_TOKEN_ID`];
  const tokenSecret = process.env[`${S}_TOKEN_SECRET`];
  const scheme = process.env[`${S}_AUTH_SCHEME`] || d.authScheme;
  const sep = process.env[`${S}_AUTH_SEP`] ?? "=";

  const missing: string[] = [];
  if (!baseUrl) missing.push(`${S}_HOST (or ${S}_BASE_URL)`);
  if (!tokenId) missing.push(`${S}_TOKEN_ID`);
  if (!tokenSecret) missing.push(`${S}_TOKEN_SECRET`);
  if (missing.length) return { config: null, missing };

  return {
    config: {
      baseUrl: baseUrl.replace(/\/+$/, ""),
      authHeader: `${scheme}=${tokenId}${sep}${tokenSecret}`,
      // Self-signed certs are the Proxmox default; opt out of verification per surface.
      rejectUnauthorized: process.env[`${S}_TLS_REJECT_UNAUTHORIZED`] !== "false",
    },
    missing: [],
  };
}

/**
 * Whether write operations (POST/PUT/DELETE) may execute for a surface.
 * Read-only by default. Enable globally with PROXMOX_ALLOW_WRITES=true, or
 * per-surface with e.g. PVE_ALLOW_WRITES=true.
 */
export function writesAllowed(surface: Surface): boolean {
  const S = surface.toUpperCase();
  return (
    process.env[`${S}_ALLOW_WRITES`] === "true" ||
    process.env.PROXMOX_ALLOW_WRITES === "true"
  );
}

/** The env var(s) that gate writes for a surface, for help text. */
export function writeGateEnvHint(surface: Surface): string {
  const S = surface.toUpperCase();
  return `PROXMOX_ALLOW_WRITES=true (all surfaces) or ${S}_ALLOW_WRITES=true (this surface only)`;
}
