#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import * as azdev from 'azure-devops-node-api';

// Environment variables for configuration
const PAT = process.env.AZURE_DEVOPS_PAT ?? '';
const ORG = process.env.AZURE_DEVOPS_ORG ?? '';
const PROJECT = process.env.AZURE_DEVOPS_PROJECT ?? '';

if (!PAT || !ORG || !PROJECT || PAT.trim() === '' || ORG.trim() === '' || PROJECT.trim() === '') {
  throw new Error(
    'Required environment variables AZURE_DEVOPS_PAT, AZURE_DEVOPS_ORG, and AZURE_DEVOPS_PROJECT must be set'
  );
}

class AzureDevOpsServer {
  private server: Server;
  private connection: azdev.WebApi;

  constructor() {
    // Initialize MCP server
    this.server = new Server(
      {
        name: 'azure-devops-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Azure DevOps connection
    const orgUrl = `https://dev.azure.com/${ORG}`;
    const authHandler = azdev.getPersonalAccessTokenHandler(PAT);
    this.connection = new azdev.WebApi(orgUrl, authHandler);

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_work_item',
          description: 'Get a work item by ID',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Work item ID',
              },
            },
            required: ['id'],
          },
        },
        {
          name: 'list_work_items',
          description: 'List work items from a board',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'WIQL query to filter work items',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'get_boards',
          description: 'List available boards in the project',
          inputSchema: {
            type: 'object',
            properties: {
              team: {
                type: 'string',
                description: 'Team name (optional)',
              },
            },
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'get_work_item':
            return await this.getWorkItem(request.params.arguments);
          case 'list_work_items':
            return await this.listWorkItems(request.params.arguments);
          case 'get_boards':
            return await this.getBoards(request.params.arguments);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error: unknown) {
        if (error instanceof McpError) throw error;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(
          ErrorCode.InternalError,
          `Azure DevOps API error: ${errorMessage}`
        );
      }
    });
  }

  private async getWorkItem(args: any) {
    if (!args.id || typeof args.id !== 'number') {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid work item ID');
    }

    const workItemTrackingApi = await this.connection.getWorkItemTrackingApi();
    const fields = ['System.Id', 'System.Title', 'System.State', 'System.Description'];
    const workItem = await workItemTrackingApi.getWorkItem(
      args.id,
      fields,
      undefined,
      undefined,
      PROJECT
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(workItem, null, 2),
        },
      ],
    };
  }

  private async listWorkItems(args: any) {
    if (!args.query || typeof args.query !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid WIQL query');
    }

    const workItemTrackingApi = await this.connection.getWorkItemTrackingApi();
    const queryResult = await workItemTrackingApi.queryByWiql(
      { query: args.query },
      { project: PROJECT }
    );

    if (!queryResult.workItems?.length) {
      return {
        content: [
          {
            type: 'text',
            text: 'No work items found',
          },
        ],
      };
    }

    const workItemIds = queryResult.workItems
      .map((wi) => wi.id)
      .filter((id): id is number => typeof id === 'number');

    const fields = ['System.Id', 'System.Title', 'System.State', 'System.Description'];
    // Get work items with minimal fields
    const workItems = await workItemTrackingApi.getWorkItems(
      workItemIds,
      fields
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(workItems, null, 2),
        },
      ],
    };
  }

  private async getBoards(args: any) {
    const workApi = await this.connection.getWorkApi();
    const teamContext = {
      project: PROJECT,
      team: args.team || PROJECT + ' Team',
    };

    const boards = await workApi.getBoards(teamContext);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(boards, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Azure DevOps MCP server running on stdio');
  }
}

const server = new AzureDevOpsServer();
server.run().catch(console.error);
