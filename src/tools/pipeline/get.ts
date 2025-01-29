import { AzureDevOpsConnection } from '../../api/connection.js';
import { config } from '../../config/environment.js';

interface PipelineInfo {
  id: number;
  name: string;
  path?: string;
  status?: string;
  revision?: number;
  type?: string;
  createdDate?: Date;
  project?: {
    id?: string;
    name?: string;
  };
}

export async function getPipelines(args: {
  folder?: string;
  name?: string;
}): Promise<PipelineInfo[]> {
  const connection = AzureDevOpsConnection.getInstance();
  const buildApi = await connection.getBuildApi();

  try {
    // Hole alle Definitionen mit minimalen Parametern
    const definitions = await buildApi.getDefinitions(config.project);

    // Filtere die Ergebnisse basierend auf den Argumenten
    let filteredDefinitions = definitions;
    
    if (args.folder) {
      filteredDefinitions = filteredDefinitions.filter(def => 
        def.path?.startsWith(args.folder || '')
      );
    }

    if (args.name) {
      filteredDefinitions = filteredDefinitions.filter(def => 
        def.name?.toLowerCase().includes(args.name?.toLowerCase() || '')
      );
    }

    // Transformiere die Ergebnisse in ein übersichtlicheres Format
    return filteredDefinitions.map(def => {
      const pipelineInfo: PipelineInfo = {
        id: def.id || 0,
        name: def.name || '',
        path: def.path,
        status: def.queueStatus?.toString(),
        revision: def.revision,
        type: def.type?.toString(),
        createdDate: def.createdDate,
        project: {
          id: def.project?.id,
          name: def.project?.name
        }
      };
      return pipelineInfo;
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch pipelines: ${error.message}`);
    }
    throw new Error('Failed to fetch pipelines: Unknown error occurred');
  }
}