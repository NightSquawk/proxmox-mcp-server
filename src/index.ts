#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ProxmoxMCPServer } from "./server/proxmox-mcp-server.js";
import { registerSurfaceTools } from "./helpers/register-surface-tools.js";

const server = ProxmoxMCPServer.GetServer();

// Both surfaces are always registered (the catalogs ship in-repo). A surface's
// call tool only errors at call time if its credentials are unset — configure
// one or both via environment variables.
registerSurfaceTools(server, "pve");
registerSurfaceTools(server, "pdm");

const transport = new StdioServerTransport();
await server.connect(transport);
