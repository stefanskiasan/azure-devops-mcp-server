import { AzureDevOpsConnection } from '../../api/connection.js';
import { config } from '../../config/environment.js';

interface ProjectResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

export async function listProjects(args: Record<string, unknown> = {}): Promise<ProjectResponse> {
  try {
    const connection = AzureDevOpsConnection.getInstance();
    const coreApi = await connection.getCoreApi();
    const projects = await coreApi.getProjects();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            projects.map((project) => ({
              id: project.id,
              name: project.name,
              description: project.description,
              url: project.url,
              state: project.state,
              visibility: project.visibility,
              lastUpdateTime: project.lastUpdateTime,
            })),
            null,
            2
          ),
        },
      ],
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return {
      content: [
        {
          type: 'text',
          text: `Error listing projects: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}