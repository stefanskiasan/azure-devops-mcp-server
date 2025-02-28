# Azure DevOps MCP Server for Cline
[![smithery badge](https://smithery.ai/badge/@stefanskiasan/azure-devops-mcp-server)](https://smithery.ai/server/@stefanskiasan/azure-devops-mcp-server)

This Model Context Protocol (MCP) server provides integration with Azure DevOps, allowing Cline to interact with Azure DevOps services.

<a href="https://glama.ai/mcp/servers/jw1m3bd8lw"><img width="380" height="200" src="https://glama.ai/mcp/servers/jw1m3bd8lw/badge" alt="Azure DevOps Server for Cline MCP server" /></a>

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
git clone https://github.com/stefanskiasan/azure-devops-mcp-server.git
cd azure-devops-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

Note: The build output (`build/` directory) is not included in version control. You must run the build command after cloning the repository.

## Configuration

### 1. Get Azure DevOps Personal Access Token (PAT)

1. Go to Azure DevOps and sign in
2. Click on your profile picture in the top right
3. Select "Security"
4. Click "New Token"
5. Give your token a name and select the required scopes:
   - `Code (read, write)` - For Pull Request operations
   - `Work Items (read, write)` - For Work Item management
   - `Build (read, execute)` - For Pipeline operations
   - `Wiki (read, write)` - For Wiki operations
   - `Project and Team (read)` - For Project and Board information
6. Copy the generated token

### 2. Configure Cline MCP Settings

Add the server configuration to your Cline MCP settings file:

- For VSCode extension: `%APPDATA%/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`
- For Claude desktop app: `%LOCALAPPDATA%/Claude/claude_desktop_config.json`

Add the following configuration to the `mcpServers` object:

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "node",
      "args": ["/absolute/path/to/azure-devops-server/build/index.js"],
      "env": {
        "AZURE_DEVOPS_ORG": "your-organization",
        "AZURE_DEVOPS_PAT": "your-personal-access-token",
        "AZURE_DEVOPS_PROJECT": "your-project-name"
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
- `your-personal-access-token`: The PAT you generated in step 1

## Available Tools

### Work Items
- `get_work_item`: Get a work item by ID
- `list_work_items`: Query work items using WIQL
- `create_work_item`: Create a new work item (Bug, Task, User Story)
- `update_work_item`: Update an existing work item

### Boards
- `get_boards`: Get available boards in the project

### Pipelines
- `list_pipelines`: List all pipelines in the project
- `trigger_pipeline`: Execute a pipeline

### Pull Requests
- `list_pull_requests`: List pull requests
- `create_pull_request`: Create a new pull request
- `update_pull_request`: Update a pull request
- `get_pull_request`: Get pull request details

### Wiki
- `get_wikis`: List all wikis in the project
- `get_wiki_page`: Get a wiki page
- `create_wiki`: Create a new wiki
- `update_wiki_page`: Create or update a wiki page

### Projects
- `list_projects`: List all projects in the Azure DevOps organization

## Verification

1. Restart Cline (or VSCode) after adding the configuration
2. The Azure DevOps MCP server should now be listed in Cline's capabilities
3. You can verify the installation using the MCP Inspector:
```bash
npm run inspector
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

## License

MIT License - See [LICENSE](LICENSE) for details
