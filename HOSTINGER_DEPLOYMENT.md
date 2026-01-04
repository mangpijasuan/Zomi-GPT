# Hostinger Deployment Guide for ZomiGPT

This guide explains how to deploy ZomiGPT to zomigpt.com using Hostinger hosting.

## Architecture Overview

- **Frontend (Static Files)**: Deployed to Hostinger at zomigpt.com
- **API Functions (Stripe)**: Deployed to Vercel (free tier) for serverless functions

## Prerequisites

1. Hostinger hosting account with domain zomigpt.com
2. Vercel account (free) for API functions
3. Google Gemini API key
4. Stripe account with API keys (if using payment features)

---

## Part 1: Deploy API Functions to Vercel

Your Stripe payment functions need a serverless environment.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy API Functions

```bash
vercel --prod
```

### Step 4: Note Your Vercel API URL

After deployment, Vercel will give you a URL like:
```
https://zomi-gpt.vercel.app
```

**Important**: Keep this URL - you'll need it for API calls.

### Step 5: Configure Vercel Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add these variables:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PRICE_ID`: Your Stripe price ID
   - `APP_URL`: `https://zomigpt.com`

### Step 6: Set Custom Domain for API (Optional)

You can set up a subdomain like `api.zomigpt.com` pointing to Vercel:

1. In Vercel dashboard → Domains
2. Add `api.zomigpt.com`
3. Follow DNS instructions (add CNAME record in Hostinger)

---

## Part 2: Build Frontend for Hostinger

### Step 1: Create Environment File

Create `.env.production` in your project root:

```env
VITE_API_KEY=your_gemini_api_key_here
```

**Security Note**: Never commit this file to GitHub. It's already in `.gitignore`.

### Step 2: Build the Project

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Step 3: Test Build Locally (Optional)

```bash
npm run preview
```

---

## Part 3: Deploy to Hostinger

### Method 1: File Manager (Simple)

1. **Login to Hostinger Control Panel**
   - Go to hpanel.hostinger.com

2. **Navigate to File Manager**
   - Go to **Files** → **File Manager**

3. **Navigate to public_html**
   - Open the `public_html` folder (or your domain's root folder)

4. **Clear Existing Files** (if any)
   - Delete old files or backup them first

5. **Upload Build Files**
   - Upload ALL contents from the `dist/` folder
   - Make sure files are in the root, not in a subfolder named "dist"

6. **Verify Structure**
   - You should see `index.html`, `assets/`, etc. directly in `public_html`

### Method 2: FTP/SFTP (Recommended for larger projects)

1. **Get FTP Credentials**
   - In Hostinger panel, go to **Files** → **FTP Accounts**
   - Note: hostname, username, password, port

2. **Connect via FTP Client** (FileZilla, Cyberduck, etc.)
   - Host: Your Hostinger FTP hostname
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (FTP) or 22 (SFTP)

3. **Upload dist/ Contents**
   - Navigate to `public_html` on remote
   - Upload all contents from local `dist/` folder
   - Ensure files are in root, not in a subdirectory

### Method 3: Git Deployment (Advanced)

If your Hostinger plan supports SSH:

```bash
# Connect to Hostinger via SSH
ssh your-username@your-server.hostinger.com

# Clone repository
cd public_html
git clone https://github.com/mangpijasuan/Zomi-GPT.git .

# Install dependencies
npm install

# Build
npm run build

# Move build files to root
mv dist/* .
rm -rf dist
```

---

## Part 4: Configure Domain (if not already)

1. **In Hostinger Control Panel**
   - Go to **Domains**
   - Ensure `zomigpt.com` points to your hosting

2. **SSL Certificate**
   - Go to **SSL** in control panel
   - Enable free SSL certificate for zomigpt.com
   - Wait for activation (5-15 minutes)

3. **Force HTTPS** (Recommended)
   - Create/edit `.htaccess` in `public_html`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Handle React Router (SPA)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Part 5: Update API Endpoints (If Using Stripe)

If you're using the Stripe payment features, update your API endpoint URLs:

The API functions on Vercel will be at:
- `https://your-vercel-url.vercel.app/api/create-checkout`
- `https://your-vercel-url.vercel.app/api/check-subscription`
- `https://your-vercel-url.vercel.app/api/verify-subscription`

Or if you set up `api.zomigpt.com`:
- `https://api.zomigpt.com/api/create-checkout`

Make sure your frontend code points to these URLs.

---

## Deployment Checklist

- [ ] Vercel API functions deployed
- [ ] Vercel environment variables configured
- [ ] Frontend built with `npm run build`
- [ ] Build files uploaded to Hostinger `public_html`
- [ ] SSL certificate active
- [ ] `.htaccess` configured for SPA routing
- [ ] Domain DNS propagated (may take up to 24 hours)
- [ ] Test all features on live site
- [ ] API endpoints working correctly

---

## Testing Your Deployment

1. **Visit**: https://zomigpt.com
2. **Test Features**:
   - AI Chat
   - Dictionary
   - Translation
   - Image generation
   - Payment flow (if configured)

3. **Check Browser Console**: Open DevTools and ensure no errors

---

## Updating Your Site

Whenever you make changes:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload to Hostinger**:
   - Upload contents of `dist/` folder to `public_html`
   - Overwrite existing files

3. **Clear cache** (if needed):
   - Add version query to assets: `style.css?v=2`
   - Or use Hostinger's cache clearing tool

---

## Troubleshooting

### Issue: White/Blank Page

- Check browser console for errors
- Verify all files uploaded correctly
- Ensure API_KEY is set in build
- Check `.htaccess` exists for SPA routing

### Issue: 404 on Route Changes

- Verify `.htaccess` file exists
- Ensure mod_rewrite is enabled (contact Hostinger if not)

### Issue: API Calls Failing

- Check Vercel API URL is correct
- Verify CORS settings allow zomigpt.com
- Check Vercel function logs

### Issue: Slow Loading

- Enable gzip compression in `.htaccess`
- Optimize images before uploading
- Use Hostinger's CDN if available

---

## Security Best Practices

1. **Never commit API keys** to repository
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** (SSL certificate)
4. **Set secure CORS headers** on API
5. **Regularly update dependencies**: `npm update`

---

## Support Resources

- **Hostinger Support**: https://www.hostinger.com/contact
- **Vercel Docs**: https://vercel.com/docs
- **ZomiGPT Issues**: https://github.com/mangpijasuan/Zomi-GPT/issues

---

## Estimated Deployment Time

- First-time setup: 30-60 minutes
- Subsequent updates: 5-10 minutes

---

**Congratulations! 🎉** Your ZomiGPT app should now be live at https://zomigpt.com
