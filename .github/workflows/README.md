# Cloudflare Pages Deployment Setup

## Required GitHub Secrets

To enable automatic deployment to Cloudflare Pages, you need to add the following secrets to your GitHub repository:

1. **CLOUDFLARE_API_TOKEN**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create a new API token with "Cloudflare Pages:Edit" permissions
   - Add the token as a GitHub secret

2. **CLOUDFLARE_ACCOUNT_ID**
   - Find your account ID at https://dash.cloudflare.com/
   - It's displayed in the right sidebar of your Cloudflare dashboard
   - Add it as a GitHub secret

## Adding Secrets to GitHub

1. Go to your repository settings: https://github.com/paulstenhouse/ten14/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret with the exact names above

## Deployment Behavior

- **Main branch**: Deploys to production environment
- **Dev branch**: Deploys to preview environment

The workflow will automatically run when you push to either branch.