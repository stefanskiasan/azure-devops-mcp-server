# Azure DevOps MCP Server for Cline
[![smithery badge](https://smithery.ai/badge/@stefanskiasan/azure-devops-mcp-server)](https://smithery.ai/server/@stefanskiasan/azure-devops-mcp-server)

This Model Context Protocol (MCP) server provides integration with Azure DevOps, allowing Cline to interact with Azure DevOps services.

## Prerequisites

- Node.js (v20 LTS or higher)
- npm (comes with Node.js)
- A Cline installation
- Azure DevOps account with access tokens

## Installation

### Installing via Smithery

To install Azure DevOps Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@stefanskiasan/azure-devops-mcp-server):

```bash
npx -y @smithery/cli install @stefanskiasan/azure-devops-mcp-server --client claude
```

### Manual Installation
1. Clone this repository:
```bash
git clone [your-repo-url]
cd azure-devops-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

## Configuration

### 1. Get Azure DevOps Personal Access Token (PAT)

1. Go to Azure DevOps and sign in
2. Click on your profile picture in the top right
3. Select "Security"
4. Click "New Token"
5. Give your token a name and select the required scopes:
   - `Code (read, write)` - Für Pull Request-Operationen
   - `Work Items (read, write)` - Für Work Item-Verwaltung
   - `Build (read, execute)` - Für Pipeline-Operationen
   - `Wiki (read, write)` - Für Wiki-Operationen
   - `Project and Team (read)` - Für Projekt- und Board-Informationen
6. Copy the generated token

### 2. Configure Cline MCP Settings

Add the server configuration to your Cline MCP settings file:

- For VSCode extension: `~/Library/Application Support/Windsurf/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`
- For Claude desktop app: `~/Library/Application Support/Claude/claude_desktop_config.json`

Add the following configuration to the `mcpServers` object:

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "node",
      "args": ["/absolute/path/to/azure-devops-server/build/index.js"],
      "env": {
        "AZURE_DEVOPS_ORG": "your-organization",
        "AZURE_DEVOPS_PAD": "your-personal-access-token",
        // Entweder Projekt-Name ODER Projekt-ID verwenden:
        "AZURE_DEVOPS_PROJECT_NAME": "your-project-name",
        // ODER
        "AZURE_DEVOPS_PROJECT_ID": "your-project-id"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Replace the following values:
- `/absolute/path/to/azure-devops-server`: The absolute path to where you cloned this repository
- `your-organization`: Your Azure DevOps organization name
- `your-project-name`: Your Azure DevOps project name
- `your-project-id`: Alternatively, you can use the project ID instead of the project name
- `your-personal-access-token`: The PAT you generated in step 1

**Note**: You can use either `AZURE_DEVOPS_PROJECT_NAME` or `AZURE_DEVOPS_PROJECT_ID` for project identification. Using the project ID is recommended for more stable references, as project names might change.

## Available Tools

### Work Items
- `get_work_item`: Abrufen eines Work Items anhand seiner ID
- `list_work_items`: Abfragen von Work Items mit WIQL
- `create_work_item`: Erstellen eines neuen Work Items (Bug, Task, User Story)
- `update_work_item`: Aktualisieren eines bestehenden Work Items

### Boards
- `get_boards`: Abrufen verfügbarer Boards im Projekt

### Pipelines
- `list_pipelines`: Auflisten aller Pipelines im Projekt
- `trigger_pipeline`: Ausführen einer Pipeline

### Pull Requests
- `list_pull_requests`: Auflisten von Pull Requests
- `create_pull_request`: Erstellen eines neuen Pull Requests
- `update_pull_request`: Aktualisieren eines Pull Requests
- `get_pull_request`: Details eines Pull Requests abrufen

### Wiki
- `get_wikis`: Auflisten aller Wikis im Projekt
- `get_wiki_page`: Abrufen einer Wiki-Seite
- `create_wiki`: Erstellen eines neuen Wikis
- `update_wiki_page`: Erstellen oder Aktualisieren einer Wiki-Seite

### Projekte
- `list_projects`: Auflisten aller Projekte in der Azure DevOps Organisation

## Verification

1. Restart Cline (or VSCode) after adding the configuration
2. The Azure DevOps MCP server should now be listed in Cline's capabilities
3. You can verify the installation using the MCP Inspector:
```bash
npm run inspector
```

## Usage Examples

### Work Items
```typescript
// Abrufen eines Work Items
{
  "id": 123
}

// Erstellen eines Work Items
{
  "type": "User Story",
  "title": "Neue Funktion implementieren",
  "description": "Als Benutzer möchte ich...",
  "assignedTo": "max.mustermann@example.com",
  "state": "New"
}
```

### Pull Requests
```typescript
// Erstellen eines Pull Requests
{
  "repositoryId": "repo-id",
  "sourceRefName": "refs/heads/feature",
  "targetRefName": "refs/heads/main",
  "title": "Feature implementiert",
  "description": "Diese Änderungen fügen..."
}
```

### Wiki
```typescript
// Wiki-Seite aktualisieren
{
  "wikiIdentifier": "wiki-id",
  "path": "/Dokumentation/Setup",
  "content": "# Setup Guide\n...",
  "comment": "Dokumentation aktualisiert"
}
```

## Troubleshooting

1. If the server isn't connecting:
   - Check that the path in your MCP settings is correct
   - Verify your Azure DevOps credentials
   - Check the Cline logs for any error messages

2. If you get authentication errors:
   - Verify your PAT hasn't expired
   - Ensure the PAT has all necessary scopes
   - Double-check the organization and project names

3. For other issues:
   - Run the inspector tool to verify the server is working correctly
   - Check the server logs for any error messages

## Development

To modify or extend the server:

1. Make your changes in the `src` directory
2. Run `npm run watch` for development
3. Build with `npm run build` when ready
4. Test using the inspector: `npm run inspector`

## Dependencies

- @modelcontextprotocol/sdk: ^0.6.0
- azure-devops-node-api: ^14.1.0
- node-fetch: ^2.7.0
- TypeScript: ^5.3.3

## License

MIT License

Copyright (c) 2025 Asan Stefanski

For full license text, see [LICENSE](LICENSE)
