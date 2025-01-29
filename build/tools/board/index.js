import { getBoards } from './get.js';
export const boardTools = {
    getBoards,
    definitions: [
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
    ],
};
