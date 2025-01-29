import { AzureDevOpsConnection } from '../../api/connection.js';
export async function listProjects(args = {}) {
    try {
        const connection = AzureDevOpsConnection.getInstance();
        const coreApi = await connection.getCoreApi();
        const projects = await coreApi.getProjects();
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(projects.map((project) => ({
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        url: project.url,
                        state: project.state,
                        visibility: project.visibility,
                        lastUpdateTime: project.lastUpdateTime,
                    })), null, 2),
                },
            ],
        };
    }
    catch (error) {
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
