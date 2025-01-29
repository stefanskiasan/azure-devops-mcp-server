import { AzureDevOpsConnection } from '../../api/connection.js';
export async function updatePullRequest(args) {
    const connection = AzureDevOpsConnection.getInstance();
    const gitApi = await connection.getGitApi();
    try {
        // Hole den aktuellen Pull Request
        const currentPR = await gitApi.getPullRequestById(args.pullRequestId);
        if (!currentPR) {
            throw new Error(`Pull request ${args.pullRequestId} not found`);
        }
        if (!currentPR.repository?.id) {
            throw new Error('Repository ID not found in pull request');
        }
        // Mapping von unseren Status-Strings zu den API-Status-Werten
        const statusMap = {
            active: 1, // PullRequestStatus.Active
            completed: 3, // PullRequestStatus.Completed
            abandoned: 2 // PullRequestStatus.Abandoned
        };
        // Mapping von unseren Merge-Strategie-Strings zu den API-Werten
        const mergeStrategyMap = {
            squash: 3, // GitPullRequestMergeStrategy.Squash
            rebase: 2, // GitPullRequestMergeStrategy.Rebase
            merge: 1 // GitPullRequestMergeStrategy.NoFastForward
        };
        // Erstelle das Update-Objekt
        const pullRequestToUpdate = {
            ...currentPR,
            status: args.status ? statusMap[args.status] : currentPR.status,
            title: args.title || currentPR.title,
            description: args.description || currentPR.description
        };
        // Wenn eine Merge-Strategie angegeben wurde und der Status auf 'completed' gesetzt wird
        if (args.mergeStrategy && args.status === 'completed') {
            await gitApi.updatePullRequest({
                ...pullRequestToUpdate,
                completionOptions: {
                    mergeStrategy: mergeStrategyMap[args.mergeStrategy],
                    deleteSourceBranch: true
                }
            }, currentPR.repository.id, args.pullRequestId);
        }
        else {
            // Normales Update ohne Merge
            await gitApi.updatePullRequest(pullRequestToUpdate, currentPR.repository.id, args.pullRequestId);
        }
        // Hole den aktualisierten Pull Request
        const updatedPR = await gitApi.getPullRequestById(args.pullRequestId);
        return updatedPR;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to update pull request: ${error.message}`);
        }
        throw new Error('Failed to update pull request: Unknown error occurred');
    }
}
