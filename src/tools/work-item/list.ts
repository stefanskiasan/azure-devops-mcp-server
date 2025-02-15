import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';
import { Wiql } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces.js';

export async function listWorkItems(args: Wiql, config: AzureDevOpsConfig) {
  if (!args.query) {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid WIQL query');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();
  
  const queryResult = await workItemTrackingApi.queryByWiql(
    args,
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