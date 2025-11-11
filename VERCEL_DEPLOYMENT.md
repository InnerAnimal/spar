# Vercel Deployment Guide - InnerAnimalMedia Platform

## Overview

This guide covers deploying the InnerAnimalMedia platform to Vercel with full Supabase, Stripe, and Cloudflare R2 integration.

## Prerequisites

- ✅ Vercel account and CLI installed
- ✅ Supabase project configured
- ✅ Stripe account with API keys
- ✅ Cloudflare R2 bucket created (optional)
- ✅ Environment variables set in `~/.env.inneranimal`

## Quick Deployment

```bash
cd /Users/samprimeaux/Desktop/inneranimalmedia
./deploy-vercel.sh
```

## Manual Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Locally (Optional but Recommended)

```bash
npm run build
```

### 3. Deploy to Vercel

```bash
vercel --prod
```

## Environment Variables Required

### Required Variables

These must be set in Vercel for the app to function:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Stripe
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# App
NEXT_PUBLIC_APP_URL
NODE_ENV=production
```

### Optional Variables

```bash
# Cloudflare R2 Storage
CLOUDFLARE_R2_ACCOUNT_ID
CLOUDFLARE_R2_ACCESS_KEY_ID
CLOUDFLARE_R2_SECRET_ACCESS_KEY
CLOUDFLARE_R2_BUCKET_NAME
CLOUDFLARE_R2_PUBLIC_URL

# Stripe Webhook
STRIPE_WEBHOOK_SECRET

# AI APIs
OPENAI_API_KEY
ANTHROPIC_API_KEY

# Email
RESEND_API_KEY

# Admin
ADMIN_EMAIL
ADMIN_PHONE
```

## Setting Environment Variables in Vercel

### Via Dashboard

1. Go to your Vercel project: https://vercel.com/meauxbilityorg/inneranimalmedia
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for **Production** environment
4. Click **Save**

### Via CLI

```bash
source ~/.env.inneranimal
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste the value when prompted
```

## Post-Deployment Checklist

### 1. Verify Environment Variables

Check that all required variables are set in Vercel dashboard.

### 2. Set Up Stripe Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook secret and add to Vercel as `STRIPE_WEBHOOK_SECRET`

### 3. Configure Supabase Auth

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel domain to:
   - **Site URL**: `https://your-domain.vercel.app`
   - **Redirect URLs**: `https://your-domain.vercel.app/auth/callback`

### 4. Set Up Cloudflare R2 (Optional)

1. Create R2 bucket in Cloudflare Dashboard
2. Create API token with R2 read/write permissions
3. Add R2 credentials to Vercel environment variables

### 5. Run Database Migrations

Ensure all Supabase migrations are applied:

```sql
-- Run migrations from supabase/migrations/001_initial_schema.sql
-- In Supabase Dashboard → SQL Editor
```

### 6. Test Deployment

Visit your deployed URL and test:
- ✅ Homepage loads
- ✅ Authentication works
- ✅ Dashboard accessible
- ✅ API routes respond
- ✅ Stripe checkout works (test mode)

## Project Structure

```
inneranimalmedia/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── stripe/        # Stripe webhook, checkout, portal
│   │   │   ├── r2/            # Cloudflare R2 uploads
│   │   │   └── ...
│   │   └── ...
│   ├── lib/
│   │   ├── stripe.ts          # Stripe integration
│   │   ├── r2.ts              # Cloudflare R2 storage
│   │   ├── supabase/          # Supabase clients
│   │   └── env.ts             # Environment validation
│   └── ...
├── next.config.ts             # Next.js configuration
├── vercel.json               # Vercel configuration
└── deploy-vercel.sh          # Deployment script
```

## API Routes

### Stripe

- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/portal` - Create billing portal session

### Cloudflare R2

- `POST /api/r2/upload` - Upload files to R2

## Troubleshooting

### Build Fails

1. Check Node.js version (requires 18+)
2. Verify all dependencies installed: `npm install`
3. Check for TypeScript errors: `npm run lint`

### Environment Variables Not Working

1. Verify variables are set in **Production** environment
2. Redeploy after adding new variables
3. Check variable names match exactly (case-sensitive)

### Stripe Webhook Fails

1. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
2. Check webhook endpoint URL matches deployed URL
3. Test webhook using Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### R2 Upload Fails

1. Verify R2 credentials are set
2. Check bucket name matches configuration
3. Verify bucket permissions allow uploads

## Performance Optimization

The project is configured with:

- ✅ Image optimization with Next.js Image component
- ✅ Security headers (HSTS, XSS protection, etc.)
- ✅ SWC minification enabled
- ✅ Package import optimization
- ✅ Automatic code splitting

## Monitoring

Monitor your deployment:

- **Vercel Dashboard**: https://vercel.com/meauxbilityorg/inneranimalmedia
- **Supabase Dashboard**: https://supabase.com/dashboard/project/sexdnwlyuhkyvseunqlx
- **Stripe Dashboard**: https://dashboard.stripe.com

## Support

For issues:
1. Check Vercel deployment logs
2. Check function logs in Vercel dashboard
3. Review Supabase logs
4. Check Stripe webhook logs

## Next Steps

After successful deployment:

1. Set up custom domain
2. Configure analytics
3. Set up monitoring and alerts
4. Enable preview deployments for PRs
5. Set up CI/CD pipeline

