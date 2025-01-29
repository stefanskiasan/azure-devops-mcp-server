import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AzureDevOpsConnection } from '../../api/connection.js';
import { AzureDevOpsConfig } from '../../config/environment.js';

interface GetPipelinesArgs {
  folder?: string;
  name?: string;
}

export async function getPipelines(args: GetPipelinesArgs, config: AzureDevOpsConfig) {
  AzureDevOpsConnection.initialize(config);
  const connection = AzureDevOpsConnection.getInstance();
  const pipelineApi = await connection.getBuildApi();

  try {
    const pipelines = await pipelineApi.getDefinitions(
      config.project,
      args.name,
      args.folder
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(pipelines, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    if (error instanceof McpError) throw error;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get pipelines: ${errorMessage}`
    );
  }
}