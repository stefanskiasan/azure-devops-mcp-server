import { AzureDevOpsConnection } from '../../api/connection.js';
export async function createPullRequest(args) {
    const connection = AzureDevOpsConnection.getInstance();
    const gitApi = await connection.getGitApi();
    try {
        // Erstelle das Pull Request Objekt
        const pullRequestToCreate = {
            sourceRefName: args.sourceRefName,
            targetRefName: args.targetRefName,
            title: args.title,
            description: args.description,
            reviewers: args.reviewers?.map(id => ({ id }))
        };
        // Erstelle den Pull Request
        const createdPR = await gitApi.createPullRequest(pullRequestToCreate, args.repositoryId);
        if (!createdPR) {
            throw new Error('Failed to create pull request');
        }
        return createdPR;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create pull request: ${error.message}`);
        }
        throw new Error('Failed to create pull request: Unknown error occurred');
    }
}
