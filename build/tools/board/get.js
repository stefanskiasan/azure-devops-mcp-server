import { AzureDevOpsConnection } from '../../api/connection.js';
import { config } from '../../config/environment.js';
export async function getBoards(args) {
    const connection = AzureDevOpsConnection.getInstance();
    const workApi = await connection.getWorkApi();
    const teamContext = {
        project: config.project,
        team: args.team || `${config.project} Team`,
    };
    const boards = await workApi.getBoards(teamContext);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(boards, null, 2),
            },
        ],
    };
}
