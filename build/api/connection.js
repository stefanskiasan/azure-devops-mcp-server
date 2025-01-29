import * as azdev from 'azure-devops-node-api';
import { config } from '../config/environment.js';
export class AzureDevOpsConnection {
    static instance;
    static getInstance() {
        if (!AzureDevOpsConnection.instance) {
            const authHandler = azdev.getPersonalAccessTokenHandler(config.pat);
            AzureDevOpsConnection.instance = new azdev.WebApi(config.orgUrl, authHandler);
        }
        return AzureDevOpsConnection.instance;
    }
}
