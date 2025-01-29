import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

interface CreateWorkItemArgs {
  type: string;
  title: string;
  description?: string;
  assignedTo?: string;
  state?: string;
  tags?: string[];
}

export async function createWorkItem(args: CreateWorkItemArgs, config: AzureDevOpsConfig) {
  if (!args.type || !args.title) {
    throw new McpError(ErrorCode.InvalidParams, 'Work item type and title are required');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();

  const patchDocument = [
    {
      op: 'add',
      path: '/fields/System.Title',
      value: args.title,
    },
  ];

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

  const workItem = await workItemTrackingApi.createWorkItem(
    undefined,
    patchDocument,
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