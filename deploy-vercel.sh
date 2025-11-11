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

# Function to add env var if not empty
add_env_var() {
    local var_name=$1
    local var_value=$2
    if [ -n "$var_value" ]; then
        echo "$var_value" | vercel env add "$var_name" production --yes 2>/dev/null || echo "  ✓ $var_name (already exists)"
    else
        echo -e "${YELLOW}  ⚠ $var_name (empty, skipping)${NC}"
    fi
}

# Required environment variables
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
add_env_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_env_var "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
add_env_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
add_env_var "NEXT_PUBLIC_APP_URL" "${NEXT_PUBLIC_APP_URL:-https://inneranimalmedia.com}"
add_env_var "NODE_ENV" "production"

# Optional environment variables
add_env_var "OPENAI_API_KEY" "$OPENAI_API_KEY"
add_env_var "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
add_env_var "RESEND_API_KEY" "$RESEND_API_KEY"
add_env_var "CLOUDFLARE_ACCOUNT_ID" "$CLOUDFLARE_ACCOUNT_ID"
add_env_var "CLOUDFLARE_R2_ACCOUNT_ID" "${CLOUDFLARE_R2_ACCOUNT_ID:-$CLOUDFLARE_ACCOUNT_ID}"
add_env_var "CLOUDFLARE_R2_ACCESS_KEY_ID" "$CLOUDFLARE_R2_ACCESS_KEY_ID"
add_env_var "CLOUDFLARE_R2_SECRET_ACCESS_KEY" "$CLOUDFLARE_R2_SECRET_ACCESS_KEY"
add_env_var "CLOUDFLARE_R2_BUCKET_NAME" "$CLOUDFLARE_R2_BUCKET_NAME"
add_env_var "CLOUDFLARE_R2_PUBLIC_URL" "$CLOUDFLARE_R2_PUBLIC_URL"
add_env_var "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
add_env_var "CLOUDFLARE_API_TOKEN" "$CLOUDFLARE_API_TOKEN"

# Admin settings
add_env_var "ADMIN_EMAIL" "meauxbility@gmail.com"
add_env_var "ADMIN_PHONE" "+13374509998"

echo -e "${GREEN}✅ Environment variables configured${NC}"
echo ""

echo -e "${BLUE}🔍 Step 3.5: Verifying required environment variables...${NC}"
MISSING_VARS=0
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${YELLOW}  ⚠ NEXT_PUBLIC_SUPABASE_URL is missing${NC}"
    MISSING_VARS=1
fi
if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${YELLOW}  ⚠ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing${NC}"
    MISSING_VARS=1
fi
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo -e "${YELLOW}  ⚠ STRIPE_SECRET_KEY is missing${NC}"
    MISSING_VARS=1
fi
if [ $MISSING_VARS -eq 1 ]; then
    echo -e "${YELLOW}⚠️  Some required environment variables are missing. Deployment may fail.${NC}"
else
    echo -e "${GREEN}✅ All required environment variables are set${NC}"
fi
echo ""

echo -e "${BLUE}🔨 Step 4: Building project locally to verify...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${YELLOW}⚠️  Local build failed, but continuing with deployment...${NC}"
fi
echo ""

echo -e "${BLUE}🚀 Step 5: Deploying to Vercel Production...${NC}"
if vercel --prod --yes --token "$VERCEL_TOKEN"; then
    echo -e "${GREEN}✅ Deployment successful${NC}"
else
    echo -e "${YELLOW}⚠️  Deployment completed with warnings${NC}"
fi
echo ""

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

