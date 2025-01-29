import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

interface UpdateWorkItemArgs {
  id: number;
  title?: string;
  description?: string;
  assignedTo?: string;
  state?: string;
  tags?: string[];
}

export async function updateWorkItem(args: UpdateWorkItemArgs, config: AzureDevOpsConfig) {
  if (!args.id || typeof args.id !== 'number') {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid work item ID');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();

  const patchDocument = [];

  if (args.title) {
    patchDocument.push({
      op: 'add',
      path: '/fields/System.Title',
      value: args.title,
    });
  }

  if (args.description) {
    patchDocument.push({
      op: 'add',
      path: '/fields/System.Description',
      value: args.description,
    });
  }

  if (args.assignedTo) {
    patchDocument.push({
      op: 'add',
      path: '/fields/System.AssignedTo',
      value: args.assignedTo,
    });
  }

  if (args.state) {
    patchDocument.push({
      op: 'add',
      path: '/fields/System.State',
      value: args.state,
    });
  }

  if (args.tags) {
    patchDocument.push({
      op: 'add',
      path: '/fields/System.Tags',
      value: args.tags.join('; '),
    });
  }

  if (patchDocument.length === 0) {
    throw new McpError(ErrorCode.InvalidParams, 'No fields provided for update');
  }

  const workItem = await workItemTrackingApi.updateWorkItem(
    undefined,
    patchDocument,
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