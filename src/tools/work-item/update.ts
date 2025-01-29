import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { config } from '../../config/environment.js';

export async function updateWorkItem(args: any) {
  if (!args.id || typeof args.id !== 'number') {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid work item ID');
  }

  const connection = AzureDevOpsConnection.getInstance();
  const client = await connection.getWorkItemTrackingApi();

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
      value: Array.isArray(args.tags) ? args.tags.join('; ') : args.tags,
    });
  }

  if (patchDocument.length === 0) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'No fields provided for update'
    );
  }

  try {
    const workItem = await client.updateWorkItem(
      null,
      patchDocument,
      args.id,
      config.project,
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
      `Failed to update work item: ${error?.message || 'Unknown error'}`
    );
  }
}