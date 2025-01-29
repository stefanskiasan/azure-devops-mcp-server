import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { config } from '../../config/environment.js';

export async function createWorkItem(args: any) {
  if (!args.type || typeof args.type !== 'string') {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid work item type');
  }
  if (!args.title || typeof args.title !== 'string') {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid work item title');
  }

  const connection = AzureDevOpsConnection.getInstance();
  const client = await connection.getWorkItemTrackingApi();

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
      value: Array.isArray(args.tags) ? args.tags.join('; ') : args.tags,
    });
  }

  try {
    const workItem = await client.createWorkItem(
      null,
      patchDocument,
      config.project,
      args.type,
      false,
      true
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(workItem, null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to create work item: ${error?.message || 'Unknown error'}`
    );
  }
}