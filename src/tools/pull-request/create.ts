import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces.js';

interface CreatePullRequestArgs {
  repositoryId: string;
  sourceRefName: string;
  targetRefName: string;
  title: string;
  description?: string;
  reviewers?: string[];
}

export async function createPullRequest(args: CreatePullRequestArgs, config: AzureDevOpsConfig) {
  if (!args.repositoryId || !args.sourceRefName || !args.targetRefName || !args.title) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Repository ID, source branch, target branch, and title are required'
    );
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const gitApi = await connection.getGitApi();

  try {
    const pullRequestToCreate: GitPullRequest = {
      sourceRefName: args.sourceRefName,
      targetRefName: args.targetRefName,
      title: args.title,
      description: args.description,
      reviewers: args.reviewers?.map(id => ({ id })),
    };

    const createdPr = await gitApi.createPullRequest(
      pullRequestToCreate,
      args.repositoryId,
      config.project
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(createdPr, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    if (error instanceof McpError) throw error;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to create pull request: ${errorMessage}`
    );
  }
}