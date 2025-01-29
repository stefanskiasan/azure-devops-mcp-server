import { getWikis, getWikiPage } from './get.js';
import { createWiki } from './create.js';
import { updateWikiPage } from './update.js';

export const wikiTools = {
  getWikis,
  getWikiPage,
  createWiki,
  updateWikiPage,
  definitions: [
    {
      name: 'get_wikis',
      description: 'List all wikis in the project',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_wiki_page',
      description: 'Get a wiki page by path',
      inputSchema: {
        type: 'object',
        properties: {
          wikiIdentifier: {
            type: 'string',
            description: 'Wiki identifier',
          },
          path: {
            type: 'string',
            description: 'Page path',
          },
          version: {
            type: 'string',
            description: 'Version (optional, defaults to main)',
          },
          includeContent: {
            type: 'boolean',
            description: 'Include page content (optional, defaults to true)',
          },
        },
        required: ['wikiIdentifier', 'path'],
      },
    },
    {
      name: 'create_wiki',
      description: 'Create a new wiki',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Wiki name',
          },
          projectId: {
            type: 'string',
            description: 'Project ID (optional, defaults to current project)',
          },
          mappedPath: {
            type: 'string',
            description: 'Mapped path (optional, defaults to /)',
          },
        },
        required: ['name'],
      },
    },
    {
      name: 'update_wiki_page',
      description: 'Create or update a wiki page',
      inputSchema: {
        type: 'object',
        properties: {
          wikiIdentifier: {
            type: 'string',
            description: 'Wiki identifier',
          },
          path: {
            type: 'string',
            description: 'Page path',
          },
          content: {
            type: 'string',
            description: 'Page content in markdown format',
          },
          comment: {
            type: 'string',
            description: 'Comment for the update (optional)',
          },
        },
        required: ['wikiIdentifier', 'path', 'content'],
      },
    },
  ],
};