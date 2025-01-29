import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';
import { PullRequestStatus } from 'azure-devops-node-api/interfaces/GitInterfaces.js';

interface GetPullRequestsArgs {
  status?: 'active' | 'completed' | 'abandoned';
  creatorId?: string;
  repositoryId?: string;
}

export async function getPullRequests(args: GetPullRequestsArgs, config: AzureDevOpsConfig) {
  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const gitApi = await connection.getGitApi();

  try {
    let statusFilter: PullRequestStatus | undefined;
    if (args.status) {
      switch (args.status) {
        case 'active':
          statusFilter = 1; // PullRequestStatus.Active
          break;
        case 'completed':
          statusFilter = 3; // PullRequestStatus.Completed
          break;
        case 'abandoned':
          statusFilter = 2; // PullRequestStatus.Abandoned
          break;
      }
    }

    const searchCriteria = {
      status: statusFilter,
      creatorId: args.creatorId,
      repositoryId: args.repositoryId,
    };

    const pullRequests = await gitApi.getPullRequests(
      args.repositoryId || config.project,
      searchCriteria
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(pullRequests, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    if (error instanceof McpError) throw error;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get pull requests: ${errorMessage}`
    );
  }
}