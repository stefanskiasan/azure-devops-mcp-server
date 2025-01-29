import { AzureDevOpsConnection } from '../../api/connection.js';
import { config } from '../../config/environment.js';

export async function triggerPipeline(args: {
  pipelineId: number;
  branch?: string;
  variables?: Record<string, string>;
}) {
  const connection = AzureDevOpsConnection.getInstance();
  const buildApi = await connection.getBuildApi();

  try {
    // Hole die Pipeline-Definition
    const definition = await buildApi.getDefinition(
      config.project,
      args.pipelineId
    );

    if (!definition) {
      throw new Error(`Pipeline with ID ${args.pipelineId} not found`);
    }

    // Erstelle die Build-Parameter
    const build = {
      definition: {
        id: definition.id
      },
      project: definition.project,
      sourceBranch: args.branch || definition.repository?.defaultBranch || 'main',
      parameters: args.variables ? JSON.stringify(args.variables) : undefined
    };

    // Triggere den Build
    const queuedBuild = await buildApi.queueBuild(
      build,
      config.project
    );

    return {
      id: queuedBuild.id,
      buildNumber: queuedBuild.buildNumber,
      status: queuedBuild.status,
      result: queuedBuild.result,
      queueTime: queuedBuild.queueTime,
      url: queuedBuild._links?.web?.href,
      sourceBranch: queuedBuild.sourceBranch,
      sourceVersion: queuedBuild.sourceVersion,
      definition: {
        id: queuedBuild.definition?.id,
        name: queuedBuild.definition?.name
      }
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to trigger pipeline: ${error.message}`);
    }
    throw new Error('Failed to trigger pipeline: Unknown error occurred');
  }
}