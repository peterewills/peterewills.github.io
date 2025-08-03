# Deployment Guide

## GitHub Actions Deployment

This project uses GitHub Actions to build and deploy to GitHub Pages.

### Setting up Secrets

1. Navigate to your repository on GitHub
2. Click on **Settings** (in the repository navigation)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add the following secret:
   - **Name**: `REACT_APP_ARTEMIS_API_KEY`
   - **Value**: Your Artemis API key

### How it Works

When you push to the `master` branch:
1. GitHub Actions runs the workflow defined in `.github/workflows/deploy.yml`
2. The workflow installs dependencies and builds the project
3. The `REACT_APP_ARTEMIS_API_KEY` secret is injected as an environment variable during build
4. The built files are deployed to GitHub Pages

### Manual Deployment

You can also trigger a deployment manually:
1. Go to the **Actions** tab in your repository
2. Select the "Build and Deploy to GitHub Pages" workflow
3. Click **Run workflow**

## Local Development

For local development, you need to provide the API key as an environment variable:

```bash
# Set the environment variable and start the dev server
REACT_APP_ARTEMIS_API_KEY=your-api-key-here npm run start

# Or for local endpoint testing
REACT_APP_ARTEMIS_API_KEY=your-api-key-here npm run start:local
```

### Creating a .env file (Optional)

For convenience during local development, you can create a `.env` file:

1. Create a file named `.env` in the project root
2. Add your API key:
   ```
   REACT_APP_ARTEMIS_API_KEY=your-api-key-here
   ```
3. This file is already in `.gitignore` and won't be committed

Note: Webpack's DefinePlugin will automatically load this file during development.