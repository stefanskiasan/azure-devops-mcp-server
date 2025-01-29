import { AzureDevOpsConnection } from '../../api/connection.js';
import * as azdev from 'azure-devops-node-api';

type StatusType = 'active' | 'completed' | 'abandoned';

export async function getPullRequests(args: {
  status?: StatusType;
  creatorId?: string;
  repositoryId?: string;
}) {
  const connection = AzureDevOpsConnection.getInstance();
  const gitApi = await connection.getGitApi();

  if (!args.repositoryId) {
    throw new Error('Repository ID is required');
  }

  // Mapping von unseren Status-Strings zu den API-Status-Werten
  const statusMap: Record<StatusType, number> = {
    active: 1,      // PullRequestStatus.Active
    completed: 3,   // PullRequestStatus.Completed
    abandoned: 2    // PullRequestStatus.Abandoned
  };

  const searchCriteria = {
    status: args.status ? statusMap[args.status] : undefined,
    creatorId: args.creatorId,
    repositoryId: args.repositoryId
  };

  try {
    const pullRequests = await gitApi.getPullRequests(
      args.repositoryId,
      searchCriteria
    );
    return pullRequests;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch pull requests: ${error.message}`);
    }
    throw new Error('Failed to fetch pull requests: Unknown error occurred');
  }
}

export async function getPullRequest(args: {
  pullRequestId: number;
  includeWorkItems?: boolean;
}) {
  const connection = AzureDevOpsConnection.getInstance();
  const gitApi = await connection.getGitApi();

  try {
    const pullRequest = await gitApi.getPullRequestById(args.pullRequestId);
    
    if (!pullRequest) {
      throw new Error(`Pull request ${args.pullRequestId} not found`);
    }

    if (args.includeWorkItems && pullRequest.repository?.id) {
      const workItemRefs = await gitApi.getPullRequestWorkItemRefs(
        pullRequest.repository.id,
        args.pullRequestId
      );
      
      return {
        ...pullRequest,
        workItemRefs
      };
    }

    return pullRequest;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch pull request ${args.pullRequestId}: ${error.message}`);
    }
    throw new Error(`Failed to fetch pull request ${args.pullRequestId}: Unknown error occurred`);
  }
}