import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

interface TriggerPipelineArgs {
  pipelineId: number;
  branch?: string;
  variables?: Record<string, string>;
}

export async function triggerPipeline(args: TriggerPipelineArgs, config: AzureDevOpsConfig) {
  if (!args.pipelineId) {
    throw new McpError(ErrorCode.InvalidParams, 'Pipeline ID is required');
  }

  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const pipelineApi = await connection.getBuildApi();

  try {
    // Get pipeline definition first
    const definition = await pipelineApi.getDefinition(
      config.project,
      args.pipelineId
    );

    if (!definition) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Pipeline with ID ${args.pipelineId} not found`
      );
    }

    // Create build parameters
    const build = {
      definition: {
        id: args.pipelineId,
      },
      project: definition.project,
      sourceBranch: args.branch || definition.repository?.defaultBranch || 'main',
      parameters: args.variables ? JSON.stringify(args.variables) : undefined,
    };

    // Queue new build
    const queuedBuild = await pipelineApi.queueBuild(build, config.project);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(queuedBuild, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    if (error instanceof McpError) throw error;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to trigger pipeline: ${errorMessage}`
    );
  }
}