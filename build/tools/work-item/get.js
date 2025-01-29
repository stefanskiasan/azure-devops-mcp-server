import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { config } from '../../config/environment.js';
export async function getWorkItem(args) {
    if (!args.id || typeof args.id !== 'number') {
        throw new McpError(ErrorCode.InvalidParams, 'Invalid work item ID');
    }
    const connection = AzureDevOpsConnection.getInstance();
    const workItemTrackingApi = await connection.getWorkItemTrackingApi();
    const fields = ['System.Id', 'System.Title', 'System.State', 'System.Description'];
    const workItem = await workItemTrackingApi.getWorkItem(args.id, fields, undefined, undefined, config.project);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(workItem, null, 2),
            },
        ],
    };
}
