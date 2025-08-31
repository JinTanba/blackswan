#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { InsuranceApiClient } from "./clients/InsuranceApiClient.js";
import { InsuranceStatus } from "./types/insurance.js";

// Create an MCP server
const server = new McpServer({
  name: "blackswan-mcp",
  version: "1.0.1"
});

// Initialize the API client
const apiClient = new InsuranceApiClient("http://127.0.0.1:3030");

// Tool: Create Insurance Card
server.registerTool(
  "create-insurance-card",
  {
    title: "Create Insurance Card",
    description: "Create a new insurance card with agent data",
    inputSchema: {
      name: z.string().describe("Name of the insurance card"),
      detail: z.string().describe("Detailed description of the insurance card"),
      creator: z.string().describe("Creator of the insurance card"),
      metadata: z.record(z.any()).describe("Additional metadata"),
      status: z.enum(["FINISHED", "ACTIVE", "WAITING", "FAILED"]).describe("Status of the insurance card"),
      talebMade: z.boolean().optional().describe("Whether the taleb is made"),
      agentData: z.object({
        systemPrompt: z.string().describe("System prompt for the agent"),
        tools: z.array(z.any()).describe("Tools available to the agent"),
        sources: z.array(z.string()).describe("Sources for the agent"),
        metadata: z.record(z.any()).describe("Agent metadata")
      }).describe("Agent configuration data")
    }
  },
  async (input) => {
    try {
      const result = await apiClient.createInsuranceCard({
        ...input,
        status: input.status as InsuranceStatus
      });
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error creating insurance card: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Get Insurance Card
server.registerTool(
  "get-insurance-card",
  {
    title: "Get Insurance Card",
    description: "Retrieve an insurance card by ID",
    inputSchema: {
      id: z.string().describe("Insurance card ID")
    }
  },
  async ({ id }) => {
    try {
      const result = await apiClient.getInsuranceCard(id);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error retrieving insurance card: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Update Insurance Card
server.registerTool(
  "update-insurance-card",
  {
    title: "Update Insurance Card",
    description: "Update an existing insurance card",
    inputSchema: {
      id: z.string().describe("Insurance card ID"),
      name: z.string().optional().describe("Name of the insurance card"),
      detail: z.string().optional().describe("Detailed description of the insurance card"),
      creator: z.string().optional().describe("Creator of the insurance card"),
      metadata: z.record(z.any()).optional().describe("Additional metadata"),
      status: z.enum(["FINISHED", "ACTIVE", "WAITING", "FAILED"]).optional().describe("Status of the insurance card"),
      talebMade: z.boolean().optional().describe("Whether the taleb is made")
    }
  },
  async ({ id, ...updateData }) => {
    try {
      const result = await apiClient.updateInsuranceCard(id, {
        ...updateData,
        status: updateData.status ? updateData.status as InsuranceStatus : undefined
      });
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error updating insurance card: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Search Insurance Cards
server.registerTool(
  "search-insurance-cards",
  {
    title: "Search Insurance Cards",
    description: "Search for insurance cards using semantic search",
    inputSchema: {
      queries: z.array(z.string()).describe("Array of search queries")
    }
  },
  async ({ queries }) => {
    try {
      const result = await apiClient.searchInsuranceCards({ queries });
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error searching insurance cards: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Update Insurance Status
server.registerTool(
  "update-insurance-status",
  {
    title: "Update Insurance Status",
    description: "Update the status of an insurance card",
    inputSchema: {
      id: z.string().describe("Insurance card ID"),
      status: z.enum(["FINISHED", "ACTIVE", "WAITING", "FAILED"]).describe("New status for the insurance card")
    }
  },
  async ({ id, status }) => {
    try {
      const result = await apiClient.updateInsuranceStatus(id, { status: status as InsuranceStatus });
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error updating insurance status: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Claim Insurance
server.registerTool(
  "claim-insurance",
  {
    title: "Claim Insurance",
    description: "Submit an insurance claim",
    inputSchema: {
      id: z.string().describe("Insurance card ID")
    }
  },
  async ({ id }) => {
    try {
      const result = await apiClient.claimInsurance(id);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error claiming insurance: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Health Check
server.registerTool(
  "health-check",
  {
    title: "Health Check",
    description: "Check the health status of the insurance API server",
    inputSchema: {}
  },
  async () => {
    try {
      const result = await apiClient.healthCheck();
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error checking health: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);
