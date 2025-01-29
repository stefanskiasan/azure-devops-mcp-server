export interface AzureDevOpsConfig {
  pat: string;
  org: string;
  project: string;
  orgUrl: string;
}

export function createConfig(options?: Partial<Omit<AzureDevOpsConfig, 'orgUrl'>>): AzureDevOpsConfig {
  const PAT = options?.pat ?? process.env.AZURE_DEVOPS_PAT ?? '';
  const ORG = options?.org ?? process.env.AZURE_DEVOPS_ORG ?? '';
  const PROJECT = options?.project ?? process.env.AZURE_DEVOPS_PROJECT ?? '';

  if (!PAT || !ORG || !PROJECT || PAT.trim() === '' || ORG.trim() === '' || PROJECT.trim() === '') {
    throw new Error(
      'Required configuration values pat, org, and project must be provided either through environment variables or constructor options'
    );
  }

  return {
    pat: PAT,
    org: ORG,
    project: PROJECT,
    orgUrl: `https://dev.azure.com/${ORG}`,
  };
}