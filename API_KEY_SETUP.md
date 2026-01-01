# Setting Up Your API Key for ZomiGPT

## Option 1: Automatic Setup (GitHub Actions) ⭐ **Recommended**

This allows visitors to use the app without entering an API key manually.

### Step-by-step:

1. **Get your Gemini API key:**
   - Go to https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click **"Create API Key"**
   - **Copy the API key** (starts with `AIza...`)

2. **Create GitHub Secret:**
   - Go to: https://github.com/mangpijasuan/Zomi-GPT/settings/secrets/actions
   - Click **"New repository secret"**
   - **Name:** `VITE_API_KEY`
   - **Value:** Paste your API key
   - Click **"Add secret"**

3. **Trigger a rebuild:**
   ```bash
   git commit --allow-empty -m "chore: rebuild with API key"
   git push
   ```

4. **Wait 2-3 minutes** for GitHub Actions to complete the build

5. **Hard refresh your site** (Ctrl+Shift+R or Cmd+Shift+R) and test!

---

## Option 2: Manual Entry (Fallback)

If Option 1 doesn't work, visitors can enter their own API key when they first visit:

1. Open your ZomiGPT site
2. You'll see a modal: **"Enter your API Key"**
3. Paste your Gemini API key
4. Click **"Save API Key"**
5. The key is saved to your browser's local storage (private, not shared)
6. You won't be asked again on that device

---

## Troubleshooting

### "API Key is missing" error
- Option 1: Check that the GitHub secret was created correctly (name must be exactly `VITE_API_KEY`)
- Option 2: Manually enter your API key when prompted

### App still shows blank after rebuild
- Clear your browser cache (Ctrl+Shift+Delete)
- Hard refresh the page (Ctrl+Shift+R)

### "Failed to authenticate"
- Your API key might be invalid or revoked
- Get a new key from https://aistudio.google.com/app/apikey
- Update the GitHub secret

---

## Why Two Options?

- **Option 1** = Better for visitors (no manual entry needed)
- **Option 2** = Fallback if GitHub secret not working, or for development/testing

---

**Need help?** Check the logs in your browser DevTools (F12 → Console tab) for error messages.
