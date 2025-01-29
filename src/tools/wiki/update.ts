import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

interface UpdateWikiPageArgs {
  wikiIdentifier: string;
  path: string;
  content: string;
  comment?: string;
}

export async function updateWikiPage(args: UpdateWikiPageArgs, config: AzureDevOpsConfig) {
  if (!args.wikiIdentifier || !args.path || !args.content) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Wiki identifier, page path, and content are required'
    );
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const wikiApi = await connection.getWikiApi();

  try {
    const wiki = await wikiApi.getWiki(config.project, args.wikiIdentifier);
    if (!wiki || !wiki.id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Wiki ${args.wikiIdentifier} not found`
      );
    }

    const updateParams = {
      content: args.content,
      comment: args.comment || `Updated page ${args.path}`,
    };

    // Da die Wiki-API keine direkte Methode zum Aktualisieren von Seiten bietet,
    // geben wir vorerst nur die Wiki-Informationen zurück
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            wiki,
            path: args.path,
            message: 'Wiki page update is not supported in the current API version',
            requestedUpdate: updateParams
          }, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    if (error instanceof McpError) throw error;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to update wiki page: ${errorMessage}`
    );
  }
}