# Payment Issue Diagnostic Tool

Run this checklist to find out what's preventing payments:

---

## What Exactly Happens When You Try to Buy?

Please check:

1. **Do you see the "Pro ah hih-thak in" button?**
   - [ ] Yes
   - [ ] No (then Pro feature might not be loading)

2. **When you click the button, what happens?**
   - [ ] Button shows "Processing..." then error appears
   - [ ] Button shows "Processing..." and nothing else happens
   - [ ] Browser redirects to Stripe, but shows an error
   - [ ] Payment goes through but Pro access not activated

---

## Check Your Browser Console

This tells us WHERE the error is:

1. **Open the app** in your browser
2. **Press F12** (or right-click → Inspect)
3. **Click Console tab**
4. **Refresh the page** (F5)
5. Look for **red error messages**
6. Screenshot or copy the error and share it

### Common Error Messages:

**"Failed to create checkout session"**
```
This means: The frontend can't talk to the API
Cause: VITE_API_URL not set or wrong Vercel URL
```

**"STRIPE_SECRET_KEY undefined"**
```
This means: The API can't process Stripe
Cause: Environment variable not set in Vercel
```

**"Cannot GET /api/create-checkout"**
```
This means: API not deployed
Cause: Run: vercel --prod
```

---

## Verify Each Part Works

### Part 1: Check if Vercel API is deployed

Try this in your browser address bar:
```
https://zomigpt-api.vercel.app/api/create-checkout
```

You should see an error like:
```json
{"error": "Method not allowed"}
```

**If you see this:** ✅ API is deployed correctly

**If you see 404 or blank page:** ❌ API not deployed

---

### Part 2: Check if GitHub secrets are set

Go to: https://github.com/mangpijasuan/Zomi-GPT/settings/secrets/actions

You should see:
- [ ] `VITE_API_URL` = `https://zomigpt-api.vercel.app`
- [ ] `VITE_API_KEY` = Your Gemini API key

**If missing:** Add them!

---

### Part 3: Check if Vercel environment variables are set

Go to: https://vercel.com/dashboard

Click **zomigpt-api** project → **Settings** → **Environment Variables**

You should see:
- [ ] `STRIPE_SECRET_KEY` = `sk_test_...` or `sk_live_...`
- [ ] `STRIPE_PRICE_ID` = `price_...`
- [ ] `APP_URL` = `https://mangpijasuan.github.io/Zomi-GPT/`

**If missing:** Add them!

---

### Part 4: Check if frontend is using correct API URL

In your browser, open DevTools Console and paste:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('API Key:', import.meta.env.VITE_API_KEY ? '✓ Set' : '✗ Missing')
```

You should see:
```
API URL: https://zomigpt-api.vercel.app
API Key: ✓ Set
```

**If API URL is undefined:** The secret wasn't set in GitHub

---

## Quick Fix Checklist

Try these in order:

### 1️⃣ API Not Deployed
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy API
cd /workspaces/Zomi-GPT
vercel login
vercel --prod
```

### 2️⃣ Environment Variables Not Set

**In Vercel:**
- Go to your zomigpt-api project
- Settings → Environment Variables
- Add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `APP_URL`

**In GitHub:**
- Settings → Secrets → Actions
- Add `VITE_API_URL` = your Vercel URL

### 3️⃣ Frontend Not Redeployed
```bash
cd /workspaces/Zomi-GPT
git add .
git commit -m "chore: redeploy"
git push
```

Wait 2-3 minutes for GitHub Actions.

### 4️⃣ Clear Cache
Press `Ctrl+Shift+Delete` and clear cached images/files

---

## Tell Me What Error You See

Once you complete these checks, share:

1. **The exact error message** from browser console
2. **Which part fails** (API deploy? Secrets? Payment?)
3. **What happens when you click the button** (error? redirect? nothing?)

This will help me fix it! 🔧

