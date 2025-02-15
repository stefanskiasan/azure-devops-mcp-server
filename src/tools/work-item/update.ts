import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';
import { JsonPatchOperation } from 'azure-devops-node-api/interfaces/common/VSSInterfaces.js';
import { WorkItemUpdate } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces.js';

export async function updateWorkItem(args: { id: number; document: JsonPatchOperation[] }, config: AzureDevOpsConfig) {
  if (!args.id || !args.document || !args.document.length) {
    throw new McpError(ErrorCode.InvalidParams, 'Work item ID and patch document are required');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();

  const workItem = await workItemTrackingApi.updateWorkItem(
    undefined,
    args.document,
    args.id,
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