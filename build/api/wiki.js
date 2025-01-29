import { config } from '../config/environment.js';
import fetch from 'node-fetch';
export class WikiApi {
    connection;
    baseUrl;
    constructor(connection) {
        this.connection = connection;
        this.baseUrl = `${config.orgUrl}/${config.project}/_apis/wiki`;
    }
    async getAuthHeader() {
        const token = Buffer.from(`:${config.pat}`).toString('base64');
        return `Basic ${token}`;
    }
    async createWiki(name, projectId, mappedPath) {
        const response = await fetch(`${this.baseUrl}/wikis?api-version=7.0`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': await this.getAuthHeader(),
            },
            body: JSON.stringify({
                name,
                projectId: projectId || config.project,
                type: 'projectWiki',
                mappedPath: mappedPath || '/',
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create wiki: ${response.statusText}`);
        }
        return await response.json();
    }
    async updateWikiPage(wikiId, path, content, comment) {
        const response = await fetch(`${this.baseUrl}/wikis/${wikiId}/pages?path=${encodeURIComponent(path)}&api-version=7.0`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': await this.getAuthHeader(),
            },
            body: JSON.stringify({
                content,
                comment: comment || 'Updated via MCP tool',
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to update wiki page: ${response.statusText}`);
        }
        return await response.json();
    }
    async getWikiPage(wikiId, path) {
        const response = await fetch(`${this.baseUrl}/wikis/${wikiId}/pages?path=${encodeURIComponent(path)}&includeContent=true&api-version=7.0`, {
            headers: {
                'Authorization': await this.getAuthHeader(),
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to get wiki page: ${response.statusText}`);
        }
        return await response.json();
    }
    async getAllWikis() {
        const response = await fetch(`${this.baseUrl}/wikis?api-version=7.0`, {
            headers: {
                'Authorization': await this.getAuthHeader(),
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to get wikis: ${response.statusText}`);
        }
        return await response.json();
    }
}
