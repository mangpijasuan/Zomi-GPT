# Quick Setup Guide - Fix 404 Error

## Current Status
✅ Code pushed to GitHub
⏳ Need to configure GitHub Pages

## Steps to Enable GitHub Pages

### Step 1: Enable GitHub Pages with GitHub Actions

1. Go to your repository: https://github.com/mangpijasuan/Zomi-GPT
2. Click on **Settings** (top navigation)
3. Scroll down and click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Select **GitHub Actions** (not "Deploy from a branch")
5. The page will refresh - no need to save

### Step 2: Add Your Gemini API Key

Your API key needs to be added as a secret:

1. In Settings, click **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - **Name:** `VITE_API_KEY`
   - **Secret:** Your actual Gemini API key (get from https://aistudio.google.com/app/apikey)
4. Click **Add secret**

### Step 3: Trigger Deployment

The deployment should start automatically, but you can trigger it manually:

1. Go to the **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click **Run workflow** → **Run workflow**

OR simply make a small commit:
```bash
git commit --allow-empty -m "trigger deployment"
git push
```

### Step 4: Wait for Deployment

1. Go to **Actions** tab
2. Watch the "Deploy to GitHub Pages" workflow
3. It takes 2-3 minutes to complete
4. Status indicators:
   - 🟡 Yellow = In progress
   - ✅ Green = Success
   - ❌ Red = Failed (check logs)

### Step 5: Access Your Site

Once deployment succeeds, your site will be at:
```
https://mangpijasuan.github.io/Zomi-GPT/
```

## Troubleshooting

### Still getting 404?

**Wait a few minutes** - GitHub Pages can take 5-10 minutes to propagate after first deployment.

### Workflow failed?

Check these common issues:

1. **Missing API key secret**
   - Go to Settings → Secrets and variables → Actions
   - Verify `VITE_API_KEY` exists

2. **Wrong secret name**
   - Must be exactly: `VITE_API_KEY` (not `API_KEY` or `GEMINI_API_KEY`)

3. **Pages not enabled**
   - Go to Settings → Pages
   - Verify source is set to "GitHub Actions"

### How to check deployment status

Run this command to see recent workflow runs:
```bash
gh run list --limit 5
```

Or visit: https://github.com/mangpijasuan/Zomi-GPT/actions

## Quick Checklist

- [ ] Pushed changes to GitHub ✅ (Already done!)
- [ ] Enabled GitHub Pages with "GitHub Actions" source
- [ ] Added `VITE_API_KEY` secret
- [ ] Triggered workflow (automatic or manual)
- [ ] Waited 2-3 minutes for build
- [ ] Checked Actions tab for success
- [ ] Visited https://mangpijasuan.github.io/Zomi-GPT/

## Need Help?

If you're still having issues:
1. Check the workflow logs in the Actions tab
2. Look for specific error messages
3. Common fixes are in [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Next Steps:** Complete Steps 1 & 2 above, then wait for the deployment to complete!
