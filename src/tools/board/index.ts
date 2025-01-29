import { getBoards } from './get.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

const definitions = [
  {
    name: 'get_boards',
    description: 'List available boards in the project',
    inputSchema: {
      type: 'object',
      properties: {
        team: {
          type: 'string',
          description: 'Team name (optional)',
        },
      },
    },
  },
];

export const boardTools = {
  initialize: (config: AzureDevOpsConfig) => ({
    getBoards: (args: any) => getBoards(args, config),
    definitions,
  }),
  definitions,
};