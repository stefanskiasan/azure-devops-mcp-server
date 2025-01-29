#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import all tools
import { workItemTools } from './tools/work-item/index.js';
import { boardTools } from './tools/board/index.js';
import { wikiTools } from './tools/wiki/index.js';
import { projectTools } from './tools/project/index.js';
import { pipelineTools } from './tools/pipeline/index.js';
import { pullRequestTools } from './tools/pull-request/index.js';
import { AzureDevOpsConfig, createConfig } from './config/environment.js';

// Type Validations
function validateArgs<T>(args: Record<string, unknown> | undefined, errorMessage: string): T {
  if (!args) {
    throw new McpError(ErrorCode.InvalidParams, errorMessage);
  }
  return args as T;
}

// Response Types
interface ContentItem {
  type: string;
  text: string;
}

interface McpResponse {
  content: ContentItem[];
  isError?: boolean;
}

// Response Formatting
function formatResponse(data: unknown): McpResponse {
  if (data && typeof data === 'object' && 'content' in data) {
    return data as McpResponse;
  }
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

class AzureDevOpsServer {
  private server: Server;
  private config: AzureDevOpsConfig;
  private toolDefinitions: any[];

  constructor(options?: Partial<Omit<AzureDevOpsConfig, 'orgUrl'>>) {
    this.config = createConfig(options);
    
    // Initialize tools with config
    const toolInstances = {
      workItem: workItemTools.initialize(this.config),
      board: boardTools.initialize(this.config),
      wiki: wikiTools.initialize(this.config),
      project: projectTools.initialize(this.config),
      pipeline: pipelineTools.initialize(this.config),
      pullRequest: pullRequestTools.initialize(this.config),
    };

    // Combine all tool definitions
    this.toolDefinitions = [
      ...toolInstances.workItem.definitions,
      ...toolInstances.board.definitions,
      ...toolInstances.wiki.definitions,
      ...toolInstances.project.definitions,
      ...toolInstances.pipeline.definitions,
      ...toolInstances.pullRequest.definitions,
    ];

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

    this.setupToolHandlers(toolInstances);
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(tools: any) {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.toolDefinitions,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
      try {
        let result;
        switch (request.params.name) {
          // Work Item Tools
          case 'get_work_item':
            result = await tools.workItem.getWorkItem(request.params.arguments);
            break;
          case 'list_work_items':
            result = await tools.workItem.listWorkItems(request.params.arguments);
            break;
          
          // Board Tools
          case 'get_boards':
            result = await tools.board.getBoards(request.params.arguments);
            break;
          
          // Wiki Tools
          case 'get_wikis':
            result = await tools.wiki.getWikis(request.params.arguments);
            break;
          case 'get_wiki_page':
            result = await tools.wiki.getWikiPage(request.params.arguments);
            break;
          case 'create_wiki':
            result = await tools.wiki.createWiki(request.params.arguments);
            break;
          case 'update_wiki_page':
            result = await tools.wiki.updateWikiPage(request.params.arguments);
            break;
          
          // Project Tools
          case 'list_projects':
            result = await tools.project.listProjects(request.params.arguments);
            break;

          // Pipeline Tools
          case 'list_pipelines':
            result = await tools.pipeline.getPipelines(
              validateArgs(request.params.arguments, 'Pipeline arguments required')
            );
            break;
          case 'trigger_pipeline':
            result = await tools.pipeline.triggerPipeline(
              validateArgs(request.params.arguments, 'Pipeline trigger arguments required')
            );
            break;

          // Pull Request Tools
          case 'list_pull_requests':
            result = await tools.pullRequest.getPullRequests(
              validateArgs(request.params.arguments, 'Pull request list arguments required')
            );
            break;
          case 'get_pull_request':
            result = await tools.pullRequest.getPullRequest(
              validateArgs(request.params.arguments, 'Pull request ID required')
            );
            break;
          case 'create_pull_request':
            result = await tools.pullRequest.createPullRequest(
              validateArgs(request.params.arguments, 'Pull request creation arguments required')
            );
            break;
          case 'update_pull_request':
            result = await tools.pullRequest.updatePullRequest(
              validateArgs(request.params.arguments, 'Pull request update arguments required')
            );
            break;
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }

        // Ensure consistent response format
        const response = formatResponse(result);
        return {
          _meta: request.params._meta,
          ...response
        };
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

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Azure DevOps MCP server running on stdio');
  }
}

// Allow configuration through constructor or environment variables
const server = new AzureDevOpsServer();
server.run().catch(console.error);
