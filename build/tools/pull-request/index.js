import { getPullRequests, getPullRequest } from './get.js';
import { createPullRequest } from './create.js';
import { updatePullRequest } from './update.js';
export const pullRequestTools = {
    getPullRequests,
    getPullRequest,
    createPullRequest,
    updatePullRequest,
    definitions: [
        {
            name: 'list_pull_requests',
            description: 'List all pull requests in the project',
            inputSchema: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        description: 'Filter by PR status (active, completed, abandoned)',
                        enum: ['active', 'completed', 'abandoned']
                    },
                    creatorId: {
                        type: 'string',
                        description: 'Filter by creator ID (optional)'
                    },
                    repositoryId: {
                        type: 'string',
                        description: 'Filter by repository ID (optional)'
                    }
                }
            }
        },
        {
            name: 'get_pull_request',
            description: 'Get a specific pull request by ID',
            inputSchema: {
                type: 'object',
                properties: {
                    pullRequestId: {
                        type: 'number',
                        description: 'Pull Request ID'
                    },
                    includeWorkItems: {
                        type: 'boolean',
                        description: 'Include linked work items (optional)',
                        default: false
                    }
                },
                required: ['pullRequestId']
            }
        },
        {
            name: 'create_pull_request',
            description: 'Create a new pull request',
            inputSchema: {
                type: 'object',
                properties: {
                    repositoryId: {
                        type: 'string',
                        description: 'Repository ID'
                    },
                    sourceRefName: {
                        type: 'string',
                        description: 'Source branch name (e.g. refs/heads/feature)'
                    },
                    targetRefName: {
                        type: 'string',
                        description: 'Target branch name (e.g. refs/heads/main)'
                    },
                    title: {
                        type: 'string',
                        description: 'Pull request title'
                    },
                    description: {
                        type: 'string',
                        description: 'Pull request description'
                    },
                    reviewers: {
                        type: 'array',
                        description: 'List of reviewer IDs (optional)',
                        items: {
                            type: 'string'
                        }
                    }
                },
                required: ['repositoryId', 'sourceRefName', 'targetRefName', 'title']
            }
        },
        {
            name: 'update_pull_request',
            description: 'Update an existing pull request',
            inputSchema: {
                type: 'object',
                properties: {
                    pullRequestId: {
                        type: 'number',
                        description: 'Pull Request ID'
                    },
                    status: {
                        type: 'string',
                        description: 'New status (active, abandoned, completed)',
                        enum: ['active', 'abandoned', 'completed']
                    },
                    title: {
                        type: 'string',
                        description: 'New title (optional)'
                    },
                    description: {
                        type: 'string',
                        description: 'New description (optional)'
                    },
                    mergeStrategy: {
                        type: 'string',
                        description: 'Merge strategy (optional)',
                        enum: ['squash', 'rebase', 'merge']
                    }
                },
                required: ['pullRequestId']
            }
        }
    ]
};
