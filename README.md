# Azure DevOps MCP Server for Cline

This Model Context Protocol (MCP) server provides integration with Azure DevOps, allowing Cline to interact with Azure DevOps services.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- A Cline installation
- Azure DevOps account with access tokens

## Installation

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
5. Give your token a name and select the required scopes (at minimum: `Code (read)`, `Work Items (read)`)
6. Copy the generated token

### 2. Configure Cline MCP Settings

Add the server configuration to your Cline MCP settings file:

- For VSCode extension: `~/Library/Application Support/Windsurf/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
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
        "AZURE_DEVOPS_PROJECT": "your-project",
        "AZURE_DEVOPS_TOKEN": "your-personal-access-token"
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
- `your-project`: Your Azure DevOps project name
- `your-personal-access-token`: The PAT you generated in step 1

## Verification

1. Restart Cline (or VSCode) after adding the configuration
2. The Azure DevOps MCP server should now be listed in Cline's capabilities
3. You can verify the installation using the MCP Inspector:
```bash
npm run inspector
```

## Usage

Once configured, Cline will have access to Azure DevOps functionality through MCP tools and resources. Example capabilities include:

- Accessing work items
- Querying repositories
- Reading pull requests
- And more based on the implemented features

## Troubleshooting

1. If the server isn't connecting:
   - Check that the path in your MCP settings is correct
   - Verify your Azure DevOps credentials
   - Check the Cline logs for any error messages

2. If you get authentication errors:
   - Verify your PAT hasn't expired
   - Ensure the PAT has the necessary scopes
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

[Your License Here]
