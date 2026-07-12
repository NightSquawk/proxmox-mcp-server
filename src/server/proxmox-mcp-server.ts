import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export class ProxmoxMCPServer {
  private static instance: McpServer | null = null;

  private constructor() {}

  public static GetServer(): McpServer {
    if (ProxmoxMCPServer.instance === null) {
      ProxmoxMCPServer.instance = new McpServer(
        {
          name: "Proxmox MCP Server",
          version: "0.1.0",
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );
    }
    return ProxmoxMCPServer.instance;
  }
}
