import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { WikiApi } from '../../api/wiki.js';

export async function getWikis(args: any) {
  try {
    const connection = AzureDevOpsConnection.getInstance();
    const wikiApi = new WikiApi(connection);

    const wikis = await wikiApi.getAllWikis();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(wikis, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get wikis: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getWikiPage(args: any) {
  if (!args.wikiIdentifier || typeof args.wikiIdentifier !== 'string') {
    throw new McpError(ErrorCode.InvalidParams, 'Wiki identifier is required');
  }

  if (!args.path || typeof args.path !== 'string') {
    throw new McpError(ErrorCode.InvalidParams, 'Page path is required');
  }

  try {
    const connection = AzureDevOpsConnection.getInstance();
    const wikiApi = new WikiApi(connection);

    const wikiPage = await wikiApi.getWikiPage(
      args.wikiIdentifier,
      args.path
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(wikiPage, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get wiki page: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}