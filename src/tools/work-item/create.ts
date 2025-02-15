import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';
import { JsonPatchOperation } from 'azure-devops-node-api/interfaces/common/VSSInterfaces.js';

export async function createWorkItem(args: { type: string; document: JsonPatchOperation[] }, config: AzureDevOpsConfig) {
  if (!args.type || !args.document || !args.document.length) {
    throw new McpError(ErrorCode.InvalidParams, 'Work item type and patch document are required');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();

  const workItem = await workItemTrackingApi.createWorkItem(
    undefined,
    args.document,
    config.project,
    args.type
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