import { listProjects } from './list.js';

export const projectTools = {
  listProjects,
  definitions: [
    {
      name: 'list_projects',
      description: 'List all projects in the Azure DevOps organization',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  ],
};