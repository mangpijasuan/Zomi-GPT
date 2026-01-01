# ZomiGPT Stripe Setup - Step by Step

## What You Need

1. Stripe account
2. Vercel account (free)
3. Your Gemini API key

---

## Step 1: Create Stripe Account & Product

### 1.1 Sign up for Stripe
- Go to https://stripe.com
- Create account and complete verification

### 1.2 Create Product
1. In Stripe Dashboard → **Products** → **Add product**
2. Fill in:
   - **Name:** ZomiGPT Plus
   - **Description:** Premium AI features for the Zomi community
   - **Pricing:** $9.99 USD
   - **Billing period:** Monthly recurring
3. Click **Save product**
4. **Copy the Price ID** (starts with `price_...`) - you'll need this!

### 1.3 Get API Keys
1. Go to **Developers** → **API keys**
2. Copy your:
   - **Publishable key** (starts with `pk_test_...` or `pk_live_...`)
   - **Secret key** (starts with `sk_test_...` or `sk_live_...`)

---

## Step 2: Deploy Backend to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```

### 2.3 Deploy API
```bash
cd /workspaces/Zomi-GPT
vercel --prod
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No**
- Project name? **zomigpt-api** (or any name)
- Directory? **./api**
- Override settings? **No**

### 2.4 Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Click your project → **Settings** → **Environment Variables**
3. Add these:

| Name | Value | Example |
|------|-------|---------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key | `sk_test_51abc...` |
| `STRIPE_PRICE_ID` | Your Stripe price ID | `price_1abc...` |
| `APP_URL` | Your GitHub Pages URL | `https://mangpijasuan.github.io/Zomi-GPT/` |

4. Click **Save** for each
5. Redeploy: `vercel --prod`

---

## Step 3: Update GitHub Secrets

1. Go to https://github.com/mangpijasuan/Zomi-GPT/settings/secrets/actions
2. Add these secrets:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your Vercel URL (e.g., `https://zomigpt-api.vercel.app`) |
| `VITE_API_KEY` | Your Gemini API key (if not already added) |

---

## Step 4: Deploy Frontend

The code is already updated! Just push to trigger deployment:

```bash
cd /workspaces/Zomi-GPT
git add .
git commit -m "feat: add Stripe payment integration"
git push
```

Wait 2-3 minutes for GitHub Actions to deploy.

---

## Step 5: Test It!

### Test Mode (Recommended First)

1. Go to your site: https://mangpijasuan.github.io/Zomi-GPT/
2. Click **Upgrade to Plus**
3. Click **Pro ah hih-thak in** button
4. You'll be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6. Complete payment
7. You'll be redirected back with Pro access!

### Go Live

When ready for real payments:

1. In Stripe Dashboard, toggle to **Live mode**
2. Get your **Live API keys**
3. Update Vercel environment variables with live keys
4. Test with a real card
5. You're live! 🎉

---

## Troubleshooting

### Error: "Failed to create checkout session"
- Check Vercel logs: `vercel logs`
- Verify environment variables are set
- Make sure API_URL in GitHub secrets is correct

### Payment succeeds but Pro not activated
- Check browser console for errors
- Verify `session_id` in URL after redirect
- Check Vercel function logs

### CORS errors
- The API functions already have CORS enabled
- Make sure you're using the correct API URL

---

## What Happens When Someone Subscribes

1. User clicks "Upgrade to Plus"
2. Frontend calls your Vercel API
3. Vercel creates Stripe Checkout session
4. User redirected to Stripe payment page
5. User enters card and pays
6. Stripe redirects back to your app with `session_id`
7. App calls verify endpoint
8. User gets Pro access
9. Stripe charges them monthly automatically

---

## Managing Subscriptions

Users can manage their subscription in Stripe's customer portal:
1. You can generate portal links in Stripe Dashboard
2. Or add a "Manage Subscription" button that creates portal sessions

Let me know if you need help with customer portal setup!

---

## Security Notes

✅ **Secure:**
- API keys stored in Vercel (not in frontend code)
- Payment processing handled by Stripe
- No credit card data touches your servers

⚠️ **Remember:**
- Never commit API keys to git
- Use test mode first
- Monitor failed payments in Stripe dashboard

---

## Costs

- **Stripe:** 2.9% + $0.30 per transaction
- **Vercel:** Free tier includes 100GB bandwidth
- **Your revenue:** $9.99/month per subscriber minus Stripe fees

If you get 100 subscribers:
- Revenue: $999/month
- Stripe fees: ~$35
- Net: ~$964/month 💰

---

Need help? Check the logs or let me know!
