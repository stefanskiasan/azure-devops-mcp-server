import * as azdev from 'azure-devops-node-api';
import { WebApi } from 'azure-devops-node-api';
import { AzureDevOpsConfig } from '../config/environment.js';
import { WikiApi } from './wiki.js';

export class AzureDevOpsConnection {
  private static instance: WebApi | null = null;
  private static config: AzureDevOpsConfig;
  private static wikiApi: WikiApi | null = null;

  public static initialize(config: AzureDevOpsConfig): void {
    this.config = config;
    // Reset instances when config changes
    this.instance = null;
    this.wikiApi = null;
  }

  public static getInstance(): WebApi {
    if (!this.config) {
      throw new Error('AzureDevOpsConnection must be initialized with config before use');
    }

    if (!this.instance) {
      const authHandler = azdev.getPersonalAccessTokenHandler(this.config.pat);
      this.instance = new azdev.WebApi(this.config.orgUrl, authHandler);
    }
    return this.instance;
  }

  public static getWikiApi(): WikiApi {
    if (!this.config) {
      throw new Error('AzureDevOpsConnection must be initialized with config before use');
    }

    if (!this.wikiApi) {
      const connection = this.getInstance();
      this.wikiApi = new WikiApi(connection, this.config);
    }
    return this.wikiApi;
  }
}