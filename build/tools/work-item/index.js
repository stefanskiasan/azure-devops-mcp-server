import { getWorkItem } from './get.js';
import { listWorkItems } from './list.js';
import { createWorkItem } from './create.js';
import { updateWorkItem } from './update.js';
export const workItemTools = {
    getWorkItem,
    listWorkItems,
    createWorkItem,
    updateWorkItem,
    definitions: [
        {
            name: 'get_work_item',
            description: 'Get a work item by ID',
            inputSchema: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        description: 'Work item ID',
                    },
                },
                required: ['id'],
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
            description: 'Create a new work item',
            inputSchema: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'Work item type (e.g., "Bug", "Task", "User Story")',
                    },
                    title: {
                        type: 'string',
                        description: 'Title of the work item',
                    },
                    description: {
                        type: 'string',
                        description: 'Description of the work item',
                    },
                    assignedTo: {
                        type: 'string',
                        description: 'Email or name of the person to assign the work item to',
                    },
                    state: {
                        type: 'string',
                        description: 'State of the work item (e.g., "New", "Active", "Closed")',
                    },
                    tags: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Tags to apply to the work item',
                    },
                },
                required: ['type', 'title'],
            },
        },
        {
            name: 'update_work_item',
            description: 'Update an existing work item',
            inputSchema: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        description: 'ID of the work item to update',
                    },
                    title: {
                        type: 'string',
                        description: 'New title of the work item',
                    },
                    description: {
                        type: 'string',
                        description: 'New description of the work item',
                    },
                    assignedTo: {
                        type: 'string',
                        description: 'Email or name of the person to assign the work item to',
                    },
                    state: {
                        type: 'string',
                        description: 'New state of the work item',
                    },
                    tags: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'New tags for the work item',
                    },
                },
                required: ['id'],
            },
        },
    ],
};
