import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { WikiApi } from '../../api/wiki.js';
export async function updateWikiPage(args) {
    if (!args.wikiIdentifier || typeof args.wikiIdentifier !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'Wiki identifier is required');
    }
    if (!args.path || typeof args.path !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'Page path is required');
    }
    if (!args.content || typeof args.content !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'Page content is required');
    }
    try {
        const connection = AzureDevOpsConnection.getInstance();
        const wikiApi = new WikiApi(connection);
        const updatedPage = await wikiApi.updateWikiPage(args.wikiIdentifier, args.path, args.content, args.comment);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(updatedPage, null, 2),
                },
            ],
        };
    }
    catch (error) {
        throw new McpError(ErrorCode.InternalError, `Failed to update wiki page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
