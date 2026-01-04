# Payment Processing Troubleshooting

If you cannot process Pro version purchases, follow this step-by-step guide.

---

## Quick Diagnosis

Your payment process requires these components to work:

1. ✅ Frontend (GitHub Pages) - Already built
2. ⚠️ API Backend (Vercel) - Needs setup
3. ⚠️ Stripe Account - Needs configuration
4. ⚠️ Environment Variables - Needs configuration

---

## Step 1: Verify Stripe Account Setup

### 1.1 Create/Access Stripe Account
1. Go to https://stripe.com
2. Sign up or log in
3. Go to **Developers** → **API Keys**
4. Copy your:
   - **Secret Key** (starts with `sk_test_...` or `sk_live_...`)
   - Note: Keep this PRIVATE - never commit to git!

### 1.2 Create a Product & Price
1. Go to **Products** → **Add Product**
2. Fill in:
   - **Name:** ZomiGPT Pro
   - **Description:** Premium AI features
   - **Price:** $9.99 USD
   - **Billing period:** Monthly recurring
3. Click **Save**
4. Copy the **Price ID** (starts with `price_...`)

### 1.3 Test Mode vs Live Mode
- **For Testing:** Use test keys (`pk_test_`, `sk_test_`)
- **For Real Payments:** Switch to live keys (`pk_live_`, `sk_live_`)
- Start with test mode!

---

## Step 2: Deploy API to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```

### 2.3 Deploy the API
```bash
cd /workspaces/Zomi-GPT
vercel --prod
```

Follow the prompts:
- "Set up and deploy?" → **Yes**
- "Which scope?" → Choose your account
- "Link to existing project?" → **No**
- "Project name?" → `zomigpt-api`
- "Directory?" → `./api`
- "Override settings?" → **No**

### 2.4 Note Your Vercel URL
After deployment, you'll see:
```
✓ Production: https://zomigpt-api.vercel.app
```
**Copy this URL!** You'll need it next.

---

## Step 3: Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Click your **zomigpt-api** project
3. Click **Settings** → **Environment Variables**
4. Add each variable:

| Name | Value | Example |
|------|-------|---------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key | `sk_test_51abc...` |
| `STRIPE_PRICE_ID` | Your Stripe price ID | `price_1abc...` |
| `APP_URL` | Your GitHub Pages URL | `https://mangpijasuan.github.io/Zomi-GPT/` |

5. Click **Save** after each one
6. Vercel will automatically redeploy

---

## Step 4: Update GitHub Secrets

1. Go to https://github.com/mangpijasuan/Zomi-GPT/settings/secrets/actions
2. Add/update:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your Vercel URL from Step 2.4 |
| `VITE_API_KEY` | Your Gemini API key (if not set) |

3. Click **Add secret**

---

## Step 5: Trigger Frontend Deployment

Push a small change to trigger GitHub Actions:

```bash
cd /workspaces/Zomi-GPT
git add .
git commit -m "chore: trigger deployment"
git push
```

Wait 2-3 minutes for GitHub Actions to complete.

---

## Step 6: Test the Payment Flow

### Test Mode Payment
1. Go to https://mangpijasuan.github.io/Zomi-GPT/
2. Click **Upgrade** (or similar button)
3. Click **Pro ah hih-thak in** button
4. You should be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
6. Complete the payment
7. You should be redirected back to the app with Pro access!

### If Test Fails

Check your browser console:
1. Open the app
2. Press **F12** for Developer Tools
3. Click **Console** tab
4. Look for red error messages
5. Common errors:

**Error: "Failed to create checkout session"**
- ❌ Vercel API not deployed
- ❌ Environment variables not set in Vercel
- ❌ Stripe API keys invalid

**Error: "VITE_API_URL is undefined"**
- ❌ GitHub secret `VITE_API_URL` not set
- ❌ Frontend not redeployed after setting secret

**Error: "Cannot find module 'stripe'"**
- ❌ Dependencies not installed on Vercel
- ✅ Usually auto-resolved on redeploy

---

## Step 7: Go Live (Real Payments)

Once testing works:

1. In Stripe Dashboard, switch to **Live Mode**
2. Copy your **Live Secret Key** and **Live Publishable Key**
3. In Vercel, update environment variables with live keys:
   - `STRIPE_SECRET_KEY`: `sk_live_...`
4. Test with a real credit card (small transaction)
5. Monitor Stripe Dashboard for payments

---

## Debugging Checklist

- [ ] Stripe account created and verified
- [ ] Product with price created in Stripe
- [ ] Stripe API keys copied (secret key)
- [ ] Stripe price ID copied
- [ ] Vercel CLI installed (`vercel --version`)
- [ ] API deployed to Vercel (`vercel --prod`)
- [ ] Environment variables set in Vercel
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_PRICE_ID`
  - [ ] `APP_URL`
- [ ] GitHub secrets set
  - [ ] `VITE_API_URL`
  - [ ] `VITE_API_KEY`
- [ ] Frontend redeployed after secrets
- [ ] Cleared browser cache (Ctrl+Shift+Delete)
- [ ] Tested in incognito window

---

## Common Issues & Solutions

### Issue: "Failed to create checkout session"

**Cause:** API not running or Stripe keys missing

**Fix:**
```bash
# Check Vercel logs
vercel logs zomigpt-api --prod

# Redeploy
vercel --prod
```

### Issue: Browser redirects to Stripe but shows error

**Cause:** Invalid Stripe keys or price ID

**Fix:**
1. Verify keys in Vercel: `vercel env list`
2. Compare with Stripe Dashboard
3. Try with test keys first

### Issue: Payment succeeds but Pro not activated

**Cause:** Webhook or verification issue

**Fix:**
1. Check browser console for errors
2. Check that `session_id` in URL after redirect
3. Verify `/api/verify-subscription` is working
4. Check Vercel logs: `vercel logs zomigpt-api --prod`

### Issue: CORS errors in browser console

**Cause:** API URL mismatch

**Fix:**
1. Check `VITE_API_URL` in GitHub secrets
2. Make sure it matches your Vercel URL exactly
3. Should not have trailing slash: `https://zomigpt-api.vercel.app`

---

## Need Help?

Check these files for more info:
- [STRIPE_SETUP.md](STRIPE_SETUP.md) - Detailed Stripe setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment info
- [README.md](README.md) - Project overview

---

## Security Reminder

⚠️ **NEVER:**
- Commit API keys to git
- Share secret keys (sk_...)
- Post keys in GitHub issues

✅ **Always:**
- Store keys in Vercel environment variables
- Use test mode first
- Rotate keys if accidentally exposed
- Monitor payments in Stripe Dashboard

