# Setting Up ZomiGPT Plus (Paid Version)

## Overview

ZomiGPT currently has a simulated Pro/Plus version. To accept real payments, you need:

1. **Payment Processor** (Stripe recommended)
2. **Backend Server** (to handle payments securely)
3. **Subscription Management** (to track who paid)
4. **Authentication** (to verify users)

## Option 1: Stripe + Serverless (Recommended for GitHub Pages)

### Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and sign up
2. Complete business verification
3. Go to **Developers** → **API keys**
4. Copy your **Publishable key** and **Secret key**

### Step 2: Create Stripe Products

1. In Stripe Dashboard, go to **Products**
2. Click **Add product**:
   - **Name:** ZomiGPT Plus
   - **Price:** $9.99/month (or your price)
   - **Billing period:** Monthly
3. Copy the **Price ID** (starts with `price_...`)

### Step 3: Set Up Backend (Choose One)

#### A. Vercel Serverless Functions (FREE)

1. Create a Vercel account at [https://vercel.com](https://vercel.com)
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Create `api/create-checkout.js`:
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

   module.exports = async (req, res) => {
     if (req.method !== 'POST') return res.status(405).end();
     
     try {
       const session = await stripe.checkout.sessions.create({
         mode: 'subscription',
         payment_method_types: ['card'],
         line_items: [{
           price: process.env.STRIPE_PRICE_ID,
           quantity: 1,
         }],
         success_url: `${process.env.APP_URL}?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${process.env.APP_URL}`,
       });
       
       res.json({ url: session.url });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   };
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

5. Add environment variables in Vercel dashboard:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PRICE_ID`: Your Stripe price ID
   - `APP_URL`: https://mangpijasuan.github.io/Zomi-GPT/

#### B. Netlify Functions (Alternative)

Similar setup but use Netlify instead of Vercel.

### Step 4: Update ZomiGPT Frontend

I'll implement this for you now...

### Step 5: Environment Variables

Add to GitHub Secrets:
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `VITE_API_URL`: Your Vercel/Netlify API URL

## Option 2: Simple License Key System (No Backend Required)

### How It Works

1. You manually generate license keys
2. Users purchase via PayPal/Stripe payment link
3. You email them a license key
4. They enter the key in the app
5. App validates key format and stores locally

### Advantages
- No backend needed
- No monthly server costs
- You control everything

### Disadvantages
- Manual work
- Keys can be shared
- No automatic subscription management

I can implement this simpler version if you prefer!

## Which Option Do You Want?

**Type 1** for Stripe + Vercel (automatic, professional)
**Type 2** for License Key system (simple, manual)

I'll implement whichever you choose!

---

## Current Status

Your app already has:
- ✅ Pro/Plus UI in UpgradeView
- ✅ Credit limit tracking
- ✅ Pro feature gates
- ❌ Payment processing (not connected)
- ❌ User verification (local storage only)

Let me know which option you want and I'll set it up!
