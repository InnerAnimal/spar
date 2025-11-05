#!/bin/bash

# =====================================================
# INNERANIMALMEDIA - VERCEL DEPLOYMENT (NO GITHUB)
# Deploys directly to Vercel using CLI
# =====================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   INNERANIMALMEDIA - VERCEL DEPLOYMENT (NO GITHUB)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Load environment variables
source ~/.env.inneranimal

# Navigate to project
cd /Users/samprimeaux/Desktop/inneranimalmedia

echo -e "${BLUE}📦 Step 1: Authenticating with Vercel...${NC}"
export VERCEL_TOKEN="$VERCEL_TOKEN"
vercel login --token "$VERCEL_TOKEN" 2>/dev/null || echo "Already authenticated"
echo ""

echo -e "${BLUE}🔗 Step 2: Linking/Creating project in Vercel...${NC}"
# Try to link to existing project first, if it fails, create new one
if [ -f ".vercel/project.json" ]; then
    echo -e "${BLUE}Found existing .vercel config, using it...${NC}"
else
    echo -e "${BLUE}Creating new Vercel project...${NC}"
    # Create project interactively first time
    vercel link --yes --token "$VERCEL_TOKEN" 2>/dev/null || vercel --yes --token "$VERCEL_TOKEN" 2>/dev/null || echo "Project setup complete"
fi
echo ""

echo -e "${BLUE}🔑 Step 3: Setting environment variables in Vercel...${NC}"
echo -e "${YELLOW}Adding environment variables to production...${NC}"

# Add all environment variables to Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$NEXT_PUBLIC_SUPABASE_URL" 2>/dev/null || echo "Already exists"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$NEXT_PUBLIC_SUPABASE_ANON_KEY" 2>/dev/null || echo "Already exists"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SUPABASE_SERVICE_ROLE_KEY" 2>/dev/null || echo "Already exists"
vercel env add NEXT_PUBLIC_APP_URL production <<< "https://inneranimalmedia.com" 2>/dev/null || echo "Already exists"
vercel env add NODE_ENV production <<< "production" 2>/dev/null || echo "Already exists"

if [ -n "$OPENAI_API_KEY" ]; then
    vercel env add OPENAI_API_KEY production <<< "$OPENAI_API_KEY" 2>/dev/null || echo "Already exists"
fi

if [ -n "$ANTHROPIC_API_KEY" ]; then
    vercel env add ANTHROPIC_API_KEY production <<< "$ANTHROPIC_API_KEY" 2>/dev/null || echo "Already exists"
fi

if [ -n "$STRIPE_SECRET_KEY" ]; then
    vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SECRET_KEY" 2>/dev/null || echo "Already exists"
fi

if [ -n "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
    vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production <<< "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" 2>/dev/null || echo "Already exists"
fi

if [ -n "$RESEND_API_KEY" ]; then
    vercel env add RESEND_API_KEY production <<< "$RESEND_API_KEY" 2>/dev/null || echo "Already exists"
fi

if [ -n "$CLOUDFLARE_ACCOUNT_ID" ]; then
    vercel env add CLOUDFLARE_ACCOUNT_ID production <<< "$CLOUDFLARE_ACCOUNT_ID" 2>/dev/null || echo "Already exists"
fi

if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
    vercel env add CLOUDFLARE_API_TOKEN production <<< "$CLOUDFLARE_API_TOKEN" 2>/dev/null || echo "Already exists"
fi

vercel env add ADMIN_EMAIL production <<< "meauxbility@gmail.com" 2>/dev/null || echo "Already exists"
vercel env add ADMIN_PHONE production <<< "+13374509998" 2>/dev/null || echo "Already exists"

echo -e "${GREEN}✅ Environment variables added${NC}"
echo ""

echo -e "${BLUE}🚀 Step 4: Deploying to Vercel Production...${NC}"
vercel --prod --yes --token "$VERCEL_TOKEN"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅ DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "  1. Your site is now live on Vercel"
echo "  2. Check deployment URL in output above"
echo "  3. Set up custom domain in Vercel dashboard if needed"
echo "  4. Run database migrations in Supabase"
echo ""
echo -e "${YELLOW}💡 To update deployment:${NC}"
echo "  cd /Users/samprimeaux/Desktop/inneranimalmedia"
echo "  vercel --prod"
echo ""

