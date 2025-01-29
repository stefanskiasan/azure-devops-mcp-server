import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

interface ListWorkItemsArgs {
  query: string;
}

export async function listWorkItems(args: ListWorkItemsArgs, config: AzureDevOpsConfig) {
  if (!args.query || typeof args.query !== 'string') {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid WIQL query');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();
  
  const queryResult = await workItemTrackingApi.queryByWiql(
    { query: args.query },
    { project: config.project }
  );

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(queryResult, null, 2),
      },
    ],
  };
}