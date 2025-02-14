import { WebApi } from 'azure-devops-node-api';
import { AzureDevOpsConfig } from '../config/environment.js';
import fetch from 'node-fetch';

export class WikiApi {
  private connection: WebApi;
  private baseUrl: string;
  private config: AzureDevOpsConfig;

  constructor(connection: WebApi, config: AzureDevOpsConfig) {
    this.connection = connection;
    this.config = config;
    this.baseUrl = `${config.orgUrl}/${config.project}/_apis/wiki`;
  }

  private async getAuthHeader(): Promise<string> {
    const token = Buffer.from(`:${this.config.pat}`).toString('base64');
    return `Basic ${token}`;
  }

  async createWiki(name: string, projectId?: string, mappedPath?: string): Promise<any> {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${this.baseUrl}?api-version=7.0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        name,
        projectId: projectId || this.config.project,
        type: 'projectWiki',
        mappedPath: mappedPath || '/',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create wiki: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllWikis(): Promise<any> {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${this.baseUrl}?api-version=7.0`, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get wikis: ${response.statusText}`);
    }

    return response.json();
  }

  async getWikiPage(wikiIdentifier: string, path: string): Promise<any> {
    const authHeader = await this.getAuthHeader();
    const encodedPath = encodeURIComponent(path);
    const response = await fetch(
      `${this.baseUrl}/${wikiIdentifier}/pages?path=${encodedPath}&api-version=7.0`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get wiki page: ${response.statusText}`);
    }

    return response.json();
  }

  async updateWikiPage(
    wikiIdentifier: string,
    path: string,
    content: string,
    comment?: string
  ): Promise<any> {
    const authHeader = await this.getAuthHeader();
    const encodedPath = encodeURIComponent(path);
    const response = await fetch(
      `${this.baseUrl}/${wikiIdentifier}/pages?path=${encodedPath}&api-version=7.0`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          content,
          comment: comment || `Updated page ${path}`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update wiki page: ${response.statusText}`);
    }

    return response.json();
  }
}