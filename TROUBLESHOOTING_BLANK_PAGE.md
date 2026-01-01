# Troubleshooting Blank Page

## Latest Fix Applied ✅

I just pushed a fix for asset path issues. The deployment is currently running.

## What Was Fixed

**Problem:** The app was loading with incorrect paths for CSS and JavaScript files.

**Solution:** 
- Removed absolute paths from index.html
- Added CSS import to index.tsx 
- Vite now correctly applies the `/Zomi-GPT/` base path

## Wait for Deployment

Current status: **Deployment in progress** ⏳

Check status: https://github.com/mangpijasuan/Zomi-GPT/actions

Estimated time: **1-2 minutes** from now

## After Deployment Completes

### Step 1: Clear Your Browser Cache

The blank page might be cached. Try:

**Chrome/Edge:**
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"

**Or use Hard Refresh:**
- Windows: `Ctrl+Shift+R` or `Ctrl+F5`
- Mac: `Cmd+Shift+R`

### Step 2: Check Browser Console

If still blank:

1. Open the page: https://mangpijasuan.github.io/Zomi-GPT/
2. Press `F12` to open Developer Tools
3. Click the **Console** tab
4. Look for any red error messages
5. Share any errors you see

### Step 3: Verify Files Are Loading

In Developer Tools:

1. Click the **Network** tab
2. Refresh the page (`F5`)
3. Check that these files load successfully (status 200):
   - `index.html`
   - `assets/index-*.js`
   - `assets/index-*.css`
   - `assets/vendor-*.js`

## Common Issues & Solutions

### Issue 1: API Key Not Set

**Symptom:** Console shows "API_KEY is undefined" or similar

**Solution:**
1. Go to https://github.com/mangpijasuan/Zomi-GPT/settings/secrets/actions
2. Verify `VITE_API_KEY` secret exists
3. If missing, add it with your Gemini API key
4. Trigger a new deployment

### Issue 2: 404 Errors for Assets

**Symptom:** Network tab shows 404 for CSS/JS files

**Solution:** This should be fixed now. If still happening:
1. Check that `vite.config.ts` has: `base: '/Zomi-GPT/'`
2. Redeploy

### Issue 3: White Screen No Errors

**Symptom:** Blank page, no console errors

**Possible causes:**
- Browser cache (try hard refresh)
- Deployment still propagating (wait 5 minutes)
- DNS/CDN caching (wait up to 10 minutes)

## Testing Locally

To verify the fix works:

```bash
cd /workspaces/Zomi-GPT
npm run build
npm run preview
```

Visit: http://localhost:4173/Zomi-GPT/

If it works locally but not on GitHub Pages, it's a deployment/cache issue.

## Quick Checklist

- [ ] Deployment completed (check Actions tab)
- [ ] Cleared browser cache
- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Checked console for errors
- [ ] Verified files loading in Network tab
- [ ] Waited at least 5 minutes after deployment

## Next Steps

1. **Wait** for current deployment to complete (~2 minutes)
2. **Visit** https://mangpijasuan.github.io/Zomi-GPT/
3. **Hard refresh** your browser (Ctrl+Shift+R)
4. **Check console** (F12) if still blank
5. **Report** any errors you see in the console

---

**Expected result:** You should see the ZomiGPT interface with a sidebar and chat view.

If you're still seeing a blank page after following all steps, share the console errors!
