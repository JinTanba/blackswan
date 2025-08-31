import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import express from 'express';
import { InsuranceController } from '../web/InsuranceController';
import { ManageData } from '../../application/usecases/ManageData';
import { InsuranceManager } from '../../application/usecases/InsuranceClaim';
import { InsuranceStatus } from '../../generated/prisma';

export class BlackSwanMcpServer {
  private server: McpServer;
  private insuranceController: InsuranceController;
  private app: express.Application;
  private serverInstance: any;

  constructor(
    manageData: ManageData,
    insuranceManager: InsuranceManager,
    port: number = 3001
  ) {
    this.server = new McpServer({
      name: "blackswan-protocol-server",
      version: "1.0.0"
    });

    this.insuranceController = new InsuranceController(manageData, insuranceManager);
    this.app = express();
    this.app.use(express.json());
    
    this.setupApiTools();
    this.setupApiResources();
    this.setupExpressServer(port);
  }

  private setupApiTools(): void {
    // Create Insurance Card Tool
    this.server.registerTool(
      "create_insurance_card",
      {
        title: "Create Insurance Card",
        description: "Create a new insurance card",
        inputSchema: {
          cardNumber: z.string().describe("Unique card identifier"),
          holderName: z.string().describe("Name of the insurance holder"),
          holderAddress: z.string().describe("Address of the insurance holder"),
          holderPhone: z.string().describe("Phone number of the insurance holder"),
          insuranceType: z.string().describe("Type of insurance"),
          premiumAmount: z.number().describe("Premium amount"),
          coverageAmount: z.number().describe("Coverage amount"),
          startDate: z.string().describe("Start date (ISO format)"),
          endDate: z.string().describe("End date (ISO format)")
        }
      },
      async (input) => {
        try {
          const mockReq = {
            body: input
          } as any;
          
          const mockRes = {
            status: (code: number) => ({
              json: (data: any) => ({ statusCode: code, data }),
              send: () => ({ statusCode: code })
            }),
            json: (data: any) => ({ statusCode: 200, data })
          } as any;

          await this.insuranceController.createInsuranceCard(mockReq, mockRes);
          
          return {
            content: [{
              type: "text",
              text: `Insurance card created successfully with card number: ${input.cardNumber}`
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

    // Get Insurance Card Tool
    this.server.registerTool(
      "get_insurance_card",
      {
        title: "Get Insurance Card",
        description: "Retrieve an insurance card by ID",
        inputSchema: {
          id: z.string().describe("Insurance card ID")
        }
      },
      async ({ id }) => {
        try {
          const mockReq = { params: { id } } as any;
          let result: any;
          
          const mockRes = {
            status: (code: number) => ({
              json: (data: any) => { result = { statusCode: code, data }; return result; }
            }),
            json: (data: any) => { result = { statusCode: 200, data }; return result; }
          } as any;

          await this.insuranceController.getInsuranceCard(mockReq, mockRes);
          
          return {
            content: [{
              type: "text",
              text: `Insurance card data: ${JSON.stringify(result?.data || 'Not found', null, 2)}`
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

    // Update Insurance Card Tool
    this.server.registerTool(
      "update_insurance_card",
      {
        title: "Update Insurance Card",
        description: "Update an existing insurance card",
        inputSchema: {
          id: z.string().describe("Insurance card ID"),
          cardNumber: z.string().optional().describe("Unique card identifier"),
          holderName: z.string().optional().describe("Name of the insurance holder"),
          holderAddress: z.string().optional().describe("Address of the insurance holder"),
          holderPhone: z.string().optional().describe("Phone number of the insurance holder"),
          insuranceType: z.string().optional().describe("Type of insurance"),
          premiumAmount: z.number().optional().describe("Premium amount"),
          coverageAmount: z.number().optional().describe("Coverage amount"),
          startDate: z.string().optional().describe("Start date (ISO format)"),
          endDate: z.string().optional().describe("End date (ISO format)")
        }
      },
      async ({ id, ...updateData }) => {
        try {
          const mockReq = {
            params: { id },
            body: updateData
          } as any;
          
          let result: any;
          const mockRes = {
            status: (code: number) => ({
              json: (data: any) => { result = { statusCode: code, data }; return result; }
            }),
            json: (data: any) => { result = { statusCode: 200, data }; return result; }
          } as any;

          await this.insuranceController.updateInsuranceCard(mockReq, mockRes);
          
          return {
            content: [{
              type: "text",
              text: `Insurance card updated: ${JSON.stringify(result?.data || 'Update failed', null, 2)}`
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

    // Search Insurance Cards Tool
    this.server.registerTool(
      "search_insurance_cards",
      {
        title: "Search Insurance Cards",
        description: "Search for insurance cards using vector queries",
        inputSchema: {
          queries: z.array(z.string()).describe("Array of search queries")
        }
      },
      async ({ queries }) => {
        try {
          const mockReq = {
            body: { queries }
          } as any;
          
          let result: any;
          const mockRes = {
            status: (code: number) => ({
              json: (data: any) => { result = { statusCode: code, data }; return result; }
            }),
            json: (data: any) => { result = { statusCode: 200, data }; return result; }
          } as any;

          await this.insuranceController.searchInsuranceCards(mockReq, mockRes);
          
          return {
            content: [{
              type: "text",
              text: `Search results: ${JSON.stringify(result?.data || 'No results', null, 2)}`
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

    // Update Insurance Status Tool
    this.server.registerTool(
      "update_insurance_status",
      {
        title: "Update Insurance Status",
        description: "Update the status of an insurance card",
        inputSchema: {
          id: z.string().describe("Insurance card ID"),
          status: z.enum([
            InsuranceStatus.ACTIVE,
            InsuranceStatus.SUSPENDED,
            InsuranceStatus.CANCELLED,
            InsuranceStatus.EXPIRED
          ]).describe("New insurance status")
        }
      },
      async ({ id, status }) => {
        try {
          const mockReq = {
            params: { id },
            body: { status }
          } as any;
          
          let result: any;
          const mockRes = {
            status: (code: number) => ({
              json: (data: any) => { result = { statusCode: code, data }; return result; }
            }),
            json: (data: any) => { result = { statusCode: 200, data }; return result; }
          } as any;

          await this.insuranceController.updateInsuranceStatus(mockReq, mockRes);
          
          return {
            content: [{
              type: "text",
              text: `Insurance status updated: ${JSON.stringify(result?.data || 'Update failed', null, 2)}`
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

    // Claim Insurance Tool
    this.server.registerTool(
      "claim_insurance",
      {
        title: "Claim Insurance",
        description: "Process an insurance claim",
        inputSchema: {
          id: z.string().describe("Insurance card ID")
        }
      },
      async ({ id }) => {
        try {
          const mockReq = { params: { id } } as any;
          
          let result: any;
          const mockRes = {
            status: (code: number) => ({
              json: (data: any) => { result = { statusCode: code, data }; return result; }
            }),
            json: (data: any) => { result = { statusCode: 200, data }; return result; }
          } as any;

          await this.insuranceController.claimInsurance(mockReq, mockRes);
          
          return {
            content: [{
              type: "text",
              text: `Insurance claim processed: ${JSON.stringify(result?.data || 'Claim failed', null, 2)}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error processing insurance claim: ${(error as Error).message}`
            }],
            isError: true
          };
        }
      }
    );
  }

  private setupApiResources(): void {
    // API Status Resource
    this.server.registerResource(
      "api-status",
      "blackswan://api/status",
      {
        title: "API Status",
        description: "Current status of the BlackSwan Protocol API",
        mimeType: "application/json"
      },
      async (uri) => ({
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            status: "operational",
            version: "1.0.0",
            endpoints: [
              "POST /api/insurance-cards - Create insurance card",
              "GET /api/insurance-cards/:id - Get insurance card",
              "PUT /api/insurance-cards/:id - Update insurance card", 
              "POST /api/insurance-cards/search - Search insurance cards",
              "PATCH /api/insurance-cards/:id/status - Update insurance status",
              "POST /api/insurance-cards/:id/claim - Claim insurance"
            ],
            timestamp: new Date().toISOString()
          }, null, 2)
        }]
      })
    );

    // Insurance Card Schema Resource
    this.server.registerResource(
      "insurance-schema",
      "blackswan://schema/insurance-card",
      {
        title: "Insurance Card Schema",
        description: "Schema definition for insurance cards",
        mimeType: "application/json"
      },
      async (uri) => ({
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            type: "object",
            properties: {
              cardNumber: { type: "string", description: "Unique card identifier" },
              holderName: { type: "string", description: "Name of the insurance holder" },
              holderAddress: { type: "string", description: "Address of the insurance holder" },
              holderPhone: { type: "string", description: "Phone number of the insurance holder" },
              insuranceType: { type: "string", description: "Type of insurance" },
              premiumAmount: { type: "number", description: "Premium amount" },
              coverageAmount: { type: "number", description: "Coverage amount" },
              startDate: { type: "string", format: "date-time", description: "Start date" },
              endDate: { type: "string", format: "date-time", description: "End date" },
              status: { 
                type: "string", 
                enum: ["ACTIVE", "SUSPENDED", "CANCELLED", "EXPIRED"],
                description: "Insurance status"
              }
            },
            required: ["cardNumber", "holderName", "insuranceType", "premiumAmount", "coverageAmount"]
          }, null, 2)
        }]
      })
    );

    // Dynamic Insurance Card Resource
    this.server.registerResource(
      "insurance-card",
      new ResourceTemplate("blackswan://insurance-cards/{id}", { list: undefined }),
      {
        title: "Insurance Card",
        description: "Individual insurance card data"
      },
      async (uri, { id }) => {
        try {
          const mockReq = { params: { id } } as any;
          let cardData: any;
          
          const mockRes = {
            status: (code: number) => ({
              json: (data: any) => { cardData = data; return { statusCode: code, data }; }
            }),
            json: (data: any) => { cardData = data; return { statusCode: 200, data }; }
          } as any;

          await this.insuranceController.getInsuranceCard(mockReq, mockRes);
          
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify(cardData || { error: "Insurance card not found" }, null, 2),
              mimeType: "application/json"
            }]
          };
        } catch (error) {
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify({ error: (error as Error).message }, null, 2),
              mimeType: "application/json"
            }]
          };
        }
      }
    );
  }

  private setupExpressServer(port: number): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK',
        mcp: 'operational',
        timestamp: new Date().toISOString()
      });
    });

    // MCP info endpoint
    this.app.get('/mcp/info', (req, res) => {
      res.json({
        name: "blackswan-protocol-server",
        version: "1.0.0",
        description: "MCP server for BlackSwan Protocol insurance API",
        capabilities: ["tools", "resources"],
        tools: [
          "create_insurance_card",
          "get_insurance_card", 
          "update_insurance_card",
          "search_insurance_cards",
          "update_insurance_status",
          "claim_insurance"
        ],
        resources: [
          "api-status",
          "insurance-schema",
          "insurance-card"
        ]
      });
    });

    this.serverInstance = this.app.listen(port, () => {
      console.log(`BlackSwan MCP HTTP server running on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      console.log(`MCP info: http://localhost:${port}/mcp/info`);
    });
  }

  async connectStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("BlackSwan MCP server connected via stdio");
  }

  async close(): Promise<void> {
    if (this.serverInstance) {
      this.serverInstance.close();
    }
    await this.server.close();
  }
}