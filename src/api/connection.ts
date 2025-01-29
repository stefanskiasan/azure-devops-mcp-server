import * as azdev from 'azure-devops-node-api';
import { WebApi } from 'azure-devops-node-api';
import { AzureDevOpsConfig } from '../config/environment.js';

export class AzureDevOpsConnection {
  private static instance: WebApi | null = null;
  private static config: AzureDevOpsConfig;

  public static initialize(config: AzureDevOpsConfig): void {
    this.config = config;
    // Reset instance when config changes
    this.instance = null;
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
}