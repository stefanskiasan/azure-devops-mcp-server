import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { config } from '../../config/environment.js';
export async function listWorkItems(args) {
    if (!args.query || typeof args.query !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'Invalid WIQL query');
    }
    const connection = AzureDevOpsConnection.getInstance();
    const workItemTrackingApi = await connection.getWorkItemTrackingApi();
    const queryResult = await workItemTrackingApi.queryByWiql({ query: args.query }, { project: config.project });
    if (!queryResult.workItems?.length) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'No work items found',
                },
            ],
        };
    }
    const workItemIds = queryResult.workItems
        .map((wi) => wi.id)
        .filter((id) => typeof id === 'number');
    const fields = ['System.Id', 'System.Title', 'System.State', 'System.Description'];
    const workItems = await workItemTrackingApi.getWorkItems(workItemIds, fields);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(workItems, null, 2),
            },
        ],
    };
}
