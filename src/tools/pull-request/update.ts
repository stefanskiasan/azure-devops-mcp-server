import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';
import { 
  GitPullRequest, 
  PullRequestStatus,
  GitPullRequestMergeStrategy 
} from 'azure-devops-node-api/interfaces/GitInterfaces.js';

interface UpdatePullRequestArgs {
  pullRequestId: number;
  status?: 'active' | 'abandoned' | 'completed';
  title?: string;
  description?: string;
  mergeStrategy?: 'squash' | 'rebase' | 'merge';
}

export async function updatePullRequest(args: UpdatePullRequestArgs, config: AzureDevOpsConfig) {
  if (!args.pullRequestId) {
    throw new McpError(ErrorCode.InvalidParams, 'Pull Request ID is required');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const gitApi = await connection.getGitApi();

  try {
    // Get current PR
    const currentPr = await gitApi.getPullRequestById(args.pullRequestId, config.project);
    if (!currentPr) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Pull Request with ID ${args.pullRequestId} not found`
      );
    }

    if (!currentPr.repository?.id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Repository information not found for PR ${args.pullRequestId}`
      );
    }

    // Prepare update
    const prUpdate: GitPullRequest = {
      ...currentPr,
      title: args.title || currentPr.title,
      description: args.description || currentPr.description,
    };

    // Handle status changes
    if (args.status) {
      switch (args.status) {
        case 'active':
          prUpdate.status = 1 as PullRequestStatus; // Active
          break;
        case 'abandoned':
          prUpdate.status = 2 as PullRequestStatus; // Abandoned
          break;
        case 'completed':
          prUpdate.status = 3 as PullRequestStatus; // Completed
          if (args.mergeStrategy) {
            let mergeStrategyValue: GitPullRequestMergeStrategy;
            switch (args.mergeStrategy) {
              case 'squash':
                mergeStrategyValue = 3; // GitPullRequestMergeStrategy.Squash
                break;
              case 'rebase':
                mergeStrategyValue = 2; // GitPullRequestMergeStrategy.Rebase
                break;
              case 'merge':
                mergeStrategyValue = 1; // GitPullRequestMergeStrategy.NoFastForward
                break;
              default:
                mergeStrategyValue = 1; // Default to no-fast-forward
            }
            
            prUpdate.completionOptions = {
              mergeStrategy: mergeStrategyValue,
              deleteSourceBranch: true,
              squashMerge: args.mergeStrategy === 'squash',
            };
          }
          break;
      }
    }

    // Update PR
    const updatedPr = await gitApi.updatePullRequest(
      prUpdate,
      currentPr.repository.id,
      args.pullRequestId,
      config.project
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(updatedPr, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    if (error instanceof McpError) throw error;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to update pull request: ${errorMessage}`
    );
  }
}