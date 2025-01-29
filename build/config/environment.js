// Environment variables for configuration
const PAT = process.env.AZURE_DEVOPS_PAT ?? '';
const ORG = process.env.AZURE_DEVOPS_ORG ?? '';
const PROJECT = process.env.AZURE_DEVOPS_PROJECT ?? '';
if (!PAT || !ORG || !PROJECT || PAT.trim() === '' || ORG.trim() === '' || PROJECT.trim() === '') {
    throw new Error('Required environment variables AZURE_DEVOPS_PAT, AZURE_DEVOPS_ORG, and AZURE_DEVOPS_PROJECT must be set');
}
export const config = {
    pat: PAT,
    org: ORG,
    project: PROJECT,
    orgUrl: `https://dev.azure.com/${ORG}`,
};
