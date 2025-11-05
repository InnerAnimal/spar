# Custom Domain Configuration Guide for InnerAnimalMedia Platform

## Overview

This guide will help you configure custom domains for your InnerAnimalMedia platform deployed on Vercel.

## Prerequisites

- Vercel project deployed and working
- Domain(s) registered and accessible
- DNS access to your domain registrar

## Step 1: Add Domain in Vercel Dashboard

1. Go to your Vercel project dashboard: https://vercel.com/meauxbilityorg/inneranimalmedia
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `inneranimalmedia.com`)

## Step 2: Configure DNS Records

For each domain, add the following DNS records:

### Primary Domain (e.g., inneranimalmedia.com)

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

### WWW Subdomain (e.g., www.inneranimalmedia.com)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Alternative: Use Vercel's Nameservers (Recommended)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Click on your domain
3. Copy the nameservers provided by Vercel
4. Update your domain registrar's nameservers to use Vercel's

## Step 3: Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` in Vercel:

```bash
cd /Users/samprimeaux/Desktop/inneranimalmedia
source ~/.env.inneranimal

# Update production environment variable
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://inneranimalmedia.com (or your custom domain)
```

Or update via Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_APP_URL`
3. Set to your custom domain (e.g., `https://inneranimalmedia.com`)

## Step 4: Configure Supabase Redirect URLs

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your custom domain to:
   - **Site URL**: `https://inneranimalmedia.com`
   - **Redirect URLs**: 
     - `https://inneranimalmedia.com/**`
     - `https://www.inneranimalmedia.com/**`
     - `https://inneranimalmedia.com/auth/callback`

## Step 5: SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. This happens automatically after DNS propagation (usually 24-48 hours).

## Step 6: Force HTTPS Redirect

Vercel automatically redirects HTTP to HTTPS. No additional configuration needed.

## Step 7: Verify Domain Configuration

After DNS propagation (24-48 hours):

```bash
# Check DNS records
dig inneranimalmedia.com
dig www.inneranimalmedia.com

# Verify SSL certificate
curl -I https://inneranimalmedia.com
```

## Multiple Domains

If you want to configure multiple domains:

1. **Primary Domain**: `inneranimalmedia.com` (main)
2. **Secondary Domains**: Add each in Vercel dashboard

For each domain:
- Add domain in Vercel dashboard
- Configure DNS records
- Update Supabase redirect URLs

## Domains You Can Configure

Based on your environment variables:
- `inneranimalmedia.com` (main)
- `inneranimal.app` (if you own it)
- `inneranimals.com` (if you own it)
- `meauxbility.org` (if you own it)
- `iautodidact.app` (if you own it)

## Troubleshooting

### Domain Not Resolving

1. Check DNS propagation: https://dnschecker.org
2. Verify DNS records are correct
3. Wait 24-48 hours for full propagation

### SSL Certificate Issues

1. Ensure DNS is properly configured
2. Vercel will auto-provision SSL (may take time)
3. Check Vercel dashboard for SSL status

### Redirect Loop

1. Verify `NEXT_PUBLIC_APP_URL` matches your domain
2. Check Supabase redirect URLs are correct
3. Clear browser cache

## Post-Deployment Checklist

- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured correctly
- [ ] `NEXT_PUBLIC_APP_URL` updated in Vercel
- [ ] Supabase redirect URLs updated
- [ ] SSL certificate issued (check Vercel dashboard)
- [ ] Test all pages load correctly
- [ ] Test authentication flow
- [ ] Verify sitemap.xml is accessible: `https://yourdomain.com/sitemap.xml`

## Quick Commands

```bash
# Update app URL environment variable
cd /Users/samprimeaux/Desktop/inneranimalmedia
source ~/.env.inneranimal
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://inneranimalmedia.com

# Redeploy after domain changes
vercel --prod
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify DNS configuration
3. Check Supabase authentication settings
4. Review environment variables

---

**Last Updated**: $(date)
**Platform**: InnerAnimalMedia
**Deployment**: Vercel

