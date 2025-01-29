import { listProjects } from './list.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

const definitions = [
  {
    name: 'list_projects',
    description: 'List all projects in the Azure DevOps organization',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

export const projectTools = {
  initialize: (config: AzureDevOpsConfig) => ({
    listProjects: (args?: Record<string, unknown>) => listProjects(args, config),
    definitions,
  }),
  definitions,
};