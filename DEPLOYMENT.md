# Deployment Guide for ZomiGPT

This guide explains how to deploy ZomiGPT to GitHub Pages.

## Prerequisites

Before deploying, ensure you have:

1. A GitHub account with this repository
2. A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Node.js v18+ installed locally (for local testing)

## Automated Deployment (Recommended)

The project is configured with GitHub Actions for automatic deployment on every push to the `master` branch.

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select **GitHub Actions**
4. Save the settings

### Step 2: Add API Key as Secret

Your Gemini API key should never be committed to the repository. Instead, add it as a GitHub secret:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secret:
   - **Name:** `VITE_API_KEY`
   - **Value:** Your Gemini API key (e.g., `AIzaSy...`)
4. Click **Add secret**

### Step 3: Deploy

Once configured, deployment happens automatically:

1. Make changes to your code
2. Commit and push to the `master` branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```
3. GitHub Actions will automatically:
   - Install dependencies
   - Run the build process
   - Deploy to GitHub Pages

4. Your site will be live at:
   ```
   https://[your-username].github.io/Zomi-GPT/
   ```

### Monitoring Deployment

1. Go to the **Actions** tab in your repository
2. Click on the latest workflow run
3. Monitor the build and deploy process
4. If there are errors, check the logs for details

## Manual Deployment

If you prefer to deploy manually:

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build the Project

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Step 3: Deploy to GitHub Pages

```bash
npm run deploy
```

This command:
1. Builds the project
2. Pushes the `dist/` directory to the `gh-pages` branch
3. GitHub Pages serves from this branch

## Environment Variables

The application uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_KEY` | Google Gemini API key | Yes |
| `API_KEY` | Alternative name (both work) | Yes |

### For Local Development

Create a `.env` file in the project root:

```env
VITE_API_KEY=your_actual_api_key_here
```

### For GitHub Pages (Production)

Add `VITE_API_KEY` as a repository secret (see Step 2 above).

## Troubleshooting

### Build Fails

**Error:** `terser not found`
- **Solution:** Run `npm install -D terser`

**Error:** TypeScript errors
- **Solution:** Run `npm run build` locally to see detailed errors
- Fix TypeScript issues before pushing

### Deployment Fails

**Error:** "Permission denied" or "403"
- **Solution:** Check that GitHub Pages is enabled and set to "GitHub Actions"
- Verify you have write permissions to the repository

**Error:** "Page not found" after deployment
- **Solution:** Check that `base` in `vite.config.ts` matches your repository name:
  ```typescript
  base: '/Zomi-GPT/', // Must match repository name
  ```

### API Key Issues

**Error:** "Invalid API key"
- **Solution:** 
  1. Verify your API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)
  2. Check that the secret is named exactly `VITE_API_KEY`
  3. Redeploy after updating the secret

**Warning:** API key exposed in client code
- **Note:** This is expected. The API key is bundled in the client-side code. Use Google AI Studio to set up domain restrictions and usage quotas to protect your key.

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain:
   ```
   yourdomain.com
   ```

2. Update `vite.config.ts`:
   ```typescript
   base: '/', // Change from '/Zomi-GPT/' to '/'
   ```

3. Configure your DNS provider:
   - Add a CNAME record pointing to `[username].github.io`

4. In GitHub Settings → Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## Production Checklist

Before deploying to production:

- [ ] Test the build locally: `npm run build && npm run preview`
- [ ] Verify all environment variables are set correctly
- [ ] Check that all links and assets load properly
- [ ] Test on mobile devices
- [ ] Verify GitHub Pages is enabled
- [ ] Confirm VITE_API_KEY secret is added
- [ ] Push to master branch
- [ ] Monitor the Actions tab for deployment status
- [ ] Test the live site after deployment

## Continuous Deployment

The project is configured for continuous deployment:

- **Trigger:** Every push to `master` branch
- **Build time:** ~2-3 minutes
- **Workflow file:** `.github/workflows/deploy.yml`

To disable automatic deployment:
1. Go to **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click the "..." menu → "Disable workflow"

## Support

If you encounter issues:

1. Check the [GitHub Actions logs](https://github.com/mangpijasuan/Zomi-GPT/actions)
2. Review the [GitHub Pages documentation](https://docs.github.com/en/pages)
3. Open an issue in the repository

## Security Notes

- ⚠️ **Never commit `.env` files** to the repository
- ⚠️ **Always use GitHub Secrets** for API keys in production
- ✅ Set up **API key restrictions** in Google AI Studio
- ✅ Monitor **API usage quotas** regularly

---

Last updated: January 2026
