import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { WikiApi } from '../../api/wiki.js';
export async function createWiki(args) {
    if (!args.name || typeof args.name !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'Wiki name is required');
    }
    try {
        const connection = AzureDevOpsConnection.getInstance();
        const wikiApi = new WikiApi(connection);
        const wiki = await wikiApi.createWiki(args.name, args.projectId, args.mappedPath);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(wiki, null, 2),
                },
            ],
        };
    }
    catch (error) {
        throw new McpError(ErrorCode.InternalError, `Failed to create wiki: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
