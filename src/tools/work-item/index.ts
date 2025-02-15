import { getWorkItem } from './get.js';
import { listWorkItems } from './list.js';
import { createWorkItem } from './create.js';
import { updateWorkItem } from './update.js';
import { AzureDevOpsConfig } from '../../config/environment.js';
import type { WorkItem, WorkItemBatchGetRequest, Wiql } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces.js';
import type { JsonPatchOperation } from 'azure-devops-node-api/interfaces/common/VSSInterfaces.js';

const definitions = [
  {
    name: 'get_work_item',
    description: 'Get work items by IDs',
    inputSchema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'number'
          },
          description: 'Work item IDs',
        },
        fields: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Fields to include (e.g., "System.Title", "System.State")',
        },
        asOf: {
          type: 'string',
          format: 'date-time',
          description: 'As of a specific date (ISO 8601)',
        },
        $expand: {
          type: 'number',
          enum: [0, 1, 2, 3, 4],
          description: 'Expand options (None=0, Relations=1, Fields=2, Links=3, All=4)',
        },
        errorPolicy: {
          type: 'number',
          enum: [1, 2],
          description: 'Error policy (Fail=1, Omit=2)',
        }
      },
      required: ['ids'],
    },
  },
  {
    name: 'list_work_items',
    description: 'List work items from a board',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'WIQL query to filter work items',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'create_work_item',
    description: 'Create a new work item using JSON patch operations',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Work item type (e.g., "Bug", "Task", "User Story")',
        },
        document: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              op: {
                type: 'string',
                enum: ['add', 'remove', 'replace', 'move', 'copy', 'test'],
                description: 'The patch operation to perform',
              },
              path: {
                type: 'string',
                description: 'The path for the operation (e.g., /fields/System.Title)',
              },
              value: {
                description: 'The value for the operation',
              },
            },
            required: ['op', 'path'],
          },
          description: 'Array of JSON patch operations to apply',
        },
      },
      required: ['type', 'document'],
    },
  },
  {
    name: 'update_work_item',
    description: 'Update an existing work item using JSON patch operations',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'ID of the work item to update',
        },
        document: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              op: {
                type: 'string',
                enum: ['add', 'remove', 'replace', 'move', 'copy', 'test'],
                description: 'The patch operation to perform',
              },
              path: {
                type: 'string',
                description: 'The path for the operation (e.g., /fields/System.Title)',
              },
              value: {
                description: 'The value for the operation',
              },
            },
            required: ['op', 'path'],
          },
          description: 'Array of JSON patch operations to apply',
        },
      },
      required: ['id', 'document'],
    },
  },
];

export const workItemTools = {
  initialize: (config: AzureDevOpsConfig) => ({
    getWorkItem: (args: WorkItemBatchGetRequest) => getWorkItem(args, config),
    listWorkItems: (args: Wiql) => listWorkItems(args, config),
    createWorkItem: (args: { type: string; document: JsonPatchOperation[] }) => createWorkItem(args, config),
    updateWorkItem: (args: { id: number; document: JsonPatchOperation[] }) => updateWorkItem(args, config),
    definitions,
  }),
  definitions,
};