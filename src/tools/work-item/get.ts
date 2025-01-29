import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

interface GetWorkItemArgs {
  id: number;
}

export async function getWorkItem(args: GetWorkItemArgs, config: AzureDevOpsConfig) {
  if (!args.id || typeof args.id !== 'number') {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid work item ID');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();
  const fields = ['System.Id', 'System.Title', 'System.State', 'System.Description'];
  
  const workItem = await workItemTrackingApi.getWorkItem(
    args.id,
    fields,
    undefined,
    undefined,
    config.project
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