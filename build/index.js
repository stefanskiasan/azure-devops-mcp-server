#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
// Import all tools
import { workItemTools } from './tools/work-item/index.js';
import { boardTools } from './tools/board/index.js';
import { wikiTools } from './tools/wiki/index.js';
import { projectTools } from './tools/project/index.js';
import { pipelineTools } from './tools/pipeline/index.js';
import { pullRequestTools } from './tools/pull-request/index.js';
// Combine all tool definitions
const toolDefinitions = [
    ...workItemTools.definitions,
    ...boardTools.definitions,
    ...wikiTools.definitions,
    ...projectTools.definitions,
    ...pipelineTools.definitions,
    ...pullRequestTools.definitions,
];
// Type Validations
function validateArgs(args, errorMessage) {
    if (!args) {
        throw new McpError(ErrorCode.InvalidParams, errorMessage);
    }
    return args;
}
// Response Formatting
function formatResponse(data) {
    if (data && typeof data === 'object' && 'content' in data) {
        return data;
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
    server;
    constructor() {
        this.server = new Server({
            name: 'azure-devops-server',
            version: '0.1.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: toolDefinitions,
        }));
        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
            try {
                let result;
                switch (request.params.name) {
                    // Work Item Tools
                    case 'get_work_item':
                        result = await workItemTools.getWorkItem(request.params.arguments);
                        break;
                    case 'list_work_items':
                        result = await workItemTools.listWorkItems(request.params.arguments);
                        break;
                    // Board Tools
                    case 'get_boards':
                        result = await boardTools.getBoards(request.params.arguments);
                        break;
                    // Wiki Tools
                    case 'get_wikis':
                        result = await wikiTools.getWikis(request.params.arguments);
                        break;
                    case 'get_wiki_page':
                        result = await wikiTools.getWikiPage(request.params.arguments);
                        break;
                    case 'create_wiki':
                        result = await wikiTools.createWiki(request.params.arguments);
                        break;
                    case 'update_wiki_page':
                        result = await wikiTools.updateWikiPage(request.params.arguments);
                        break;
                    // Project Tools
                    case 'list_projects':
                        result = await projectTools.listProjects(request.params.arguments);
                        break;
                    // Pipeline Tools
                    case 'list_pipelines':
                        result = await pipelineTools.getPipelines(validateArgs(request.params.arguments, 'Pipeline arguments required'));
                        break;
                    case 'trigger_pipeline':
                        result = await pipelineTools.triggerPipeline(validateArgs(request.params.arguments, 'Pipeline trigger arguments required'));
                        break;
                    // Pull Request Tools
                    case 'list_pull_requests':
                        result = await pullRequestTools.getPullRequests(validateArgs(request.params.arguments, 'Pull request list arguments required'));
                        break;
                    case 'get_pull_request':
                        result = await pullRequestTools.getPullRequest(validateArgs(request.params.arguments, 'Pull request ID required'));
                        break;
                    case 'create_pull_request':
                        result = await pullRequestTools.createPullRequest(validateArgs(request.params.arguments, 'Pull request creation arguments required'));
                        break;
                    case 'update_pull_request':
                        result = await pullRequestTools.updatePullRequest(validateArgs(request.params.arguments, 'Pull request update arguments required'));
                        break;
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
                // Ensure consistent response format
                const response = formatResponse(result);
                return {
                    _meta: request.params._meta,
                    ...response
                };
            }
            catch (error) {
                if (error instanceof McpError)
                    throw error;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new McpError(ErrorCode.InternalError, `Azure DevOps API error: ${errorMessage}`);
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Azure DevOps MCP server running on stdio');
    }
}
const server = new AzureDevOpsServer();
server.run().catch(console.error);
