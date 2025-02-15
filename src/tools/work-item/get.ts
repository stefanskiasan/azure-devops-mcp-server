import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';
import { WorkItemBatchGetRequest, WorkItemExpand, WorkItemErrorPolicy } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces.js';

export async function getWorkItem(args: WorkItemBatchGetRequest, config: AzureDevOpsConfig) {
  if (!args.ids || !args.ids.length) {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid work item ID');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();
  const workItems = await workItemTrackingApi.getWorkItems(
    args.ids,
    args.fields || ['System.Id', 'System.Title', 'System.State', 'System.Description'],
    args.asOf,
    WorkItemExpand.All,
    args.errorPolicy,
    config.project
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