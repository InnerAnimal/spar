#!/bin/bash

# Cloudflare R2 Interactive Setup Script
# This script guides you through setting up Cloudflare R2 for InnerAnimal Media

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}➡️  $1${NC}"
}

# Function to open URL in browser (cross-platform)
open_url() {
    local url=$1
    if command -v xdg-open &> /dev/null; then
        xdg-open "$url" 2>/dev/null
    elif command -v open &> /dev/null; then
        open "$url" 2>/dev/null
    else
        echo -e "${YELLOW}Please open this URL manually: $url${NC}"
    fi
}

# Main setup flow
print_header "Cloudflare R2 Interactive Setup"

echo "This script will guide you through:"
echo "  1. Creating a Cloudflare R2 bucket"
echo "  2. Generating R2 API tokens"
echo "  3. Configuring your local environment"
echo "  4. Setting up GitHub secrets"
echo ""
read -p "Press Enter to continue..."

# Check if user has Cloudflare account
print_header "Step 1: Cloudflare Account"
echo "Do you have a Cloudflare account?"
read -p "(yes/no): " has_account

if [[ $has_account != "yes" && $has_account != "y" ]]; then
    print_info "Opening Cloudflare sign-up page..."
    open_url "https://dash.cloudflare.com/sign-up"
    echo ""
    echo "Please sign up for a Cloudflare account (it's free!)"
    read -p "Press Enter once you've created your account..."
fi

print_success "Cloudflare account ready"

# Guide to create R2 bucket
print_header "Step 2: Create R2 Bucket"
echo "Now we'll create an R2 bucket for file storage."
echo ""
print_info "Opening Cloudflare R2 dashboard..."
open_url "https://dash.cloudflare.com/?to=/:account/r2/overview"
echo ""
echo "In the Cloudflare dashboard:"
echo "  1. Click 'R2' in the left sidebar"
echo "  2. Click 'Create bucket'"
echo "  3. Enter bucket name: 'inneranimalmedia' (or your preferred name)"
echo "  4. Choose a location (closest to your users)"
echo "  5. Click 'Create bucket'"
echo ""
read -p "Enter the bucket name you created: " bucket_name

if [ -z "$bucket_name" ]; then
    bucket_name="inneranimalmedia"
    print_info "Using default bucket name: $bucket_name"
else
    print_success "Bucket name: $bucket_name"
fi

# Get Account ID
print_header "Step 3: Get Account ID"
echo "Your Cloudflare Account ID is visible in the R2 dashboard URL."
echo "It looks like: dash.cloudflare.com/[ACCOUNT_ID]/r2"
echo ""
print_info "Look at your browser URL bar to find your Account ID"
echo ""
read -p "Enter your Cloudflare Account ID: " account_id

if [ -z "$account_id" ]; then
    print_error "Account ID is required!"
    exit 1
fi

print_success "Account ID: $account_id"

# Generate API Token
print_header "Step 4: Generate R2 API Token"
echo "Now we'll create an API token for R2 access."
echo ""
print_info "Opening R2 API Tokens page..."
open_url "https://dash.cloudflare.com/$account_id/r2/api-tokens"
echo ""
echo "In the API Tokens page:"
echo "  1. Click 'Create API token'"
echo "  2. Token name: 'inneranimalmedia-api-token'"
echo "  3. Permissions: Object Read & Write"
echo "  4. (Optional) Restrict to specific bucket: $bucket_name"
echo "  5. Click 'Create API Token'"
echo ""
echo "⚠️  IMPORTANT: Copy both keys immediately (you won't see them again!)"
echo ""
read -p "Press Enter once you've created the token..."

echo ""
read -p "Enter R2 Access Key ID: " access_key_id
read -p "Enter R2 Secret Access Key: " secret_access_key

if [ -z "$access_key_id" ] || [ -z "$secret_access_key" ]; then
    print_error "Both Access Key ID and Secret Access Key are required!"
    exit 1
fi

print_success "R2 API credentials captured"

# Public URL configuration
print_header "Step 5: Public URL Configuration"
echo "Do you want to enable public access to your R2 bucket?"
read -p "(yes/no): " enable_public

if [[ $enable_public == "yes" || $enable_public == "y" ]]; then
    echo ""
    echo "For public access, you can either:"
    echo "  1. Use the default R2 public URL"
    echo "  2. Set up a custom domain (recommended for production)"
    echo ""
    read -p "Do you have a custom domain set up? (yes/no): " has_custom_domain

    if [[ $has_custom_domain == "yes" || $has_custom_domain == "y" ]]; then
        read -p "Enter your custom domain (e.g., cdn.inneranimalmedia.com): " public_url
        public_url="https://$public_url"
    else
        # Generate default R2 public URL
        public_url="https://$bucket_name.$account_id.r2.cloudflarestorage.com"
        print_info "Using default R2 URL: $public_url"
        echo ""
        echo "To enable public access:"
        echo "  1. Go to your bucket in R2 dashboard"
        echo "  2. Click 'Settings' tab"
        echo "  3. Enable 'Public bucket' or set up 'Custom domains'"
        echo ""
        read -p "Press Enter once you've configured public access..."
    fi
else
    public_url="https://$bucket_name.$account_id.r2.cloudflarestorage.com"
    print_info "Using default R2 URL (private access via signed URLs)"
fi

print_success "Public URL: $public_url"

# Create .env.local file
print_header "Step 6: Creating Local Environment File"

cat > .env.local <<EOF
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=$account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=$access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=$secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=$bucket_name
CLOUDFLARE_R2_PUBLIC_URL=$public_url

# Cloudflare Account (for Pages deployment)
CLOUDFLARE_ACCOUNT_ID=$account_id

# TODO: Add other required environment variables
# Copy from .env.example and fill in your values:
# - Supabase credentials
# - Stripe credentials
# - Other API keys

# You can copy these from your existing deployment or service dashboards
EOF

print_success "Created .env.local with Cloudflare R2 configuration"
echo ""
print_info "Remember to add other required credentials to .env.local"
print_info "See .env.example for all required variables"

# Cloudflare API Token for GitHub Actions
print_header "Step 7: Cloudflare API Token (for Deployments)"
echo "To enable automated deployments to Cloudflare Pages, we need a Cloudflare API token."
echo ""
read -p "Do you want to set up Cloudflare Pages deployment? (yes/no): " setup_pages

if [[ $setup_pages == "yes" || $setup_pages == "y" ]]; then
    echo ""
    print_info "Opening Cloudflare API Tokens page..."
    open_url "https://dash.cloudflare.com/profile/api-tokens"
    echo ""
    echo "Create a new API token with:"
    echo "  1. Template: 'Edit Cloudflare Workers' (or create custom)"
    echo "  2. Permissions needed:"
    echo "     - Account > Cloudflare Pages > Edit"
    echo "     - Account > Account Settings > Read"
    echo "  3. Copy the token"
    echo ""
    read -p "Enter your Cloudflare API Token: " cf_api_token

    if [ -n "$cf_api_token" ]; then
        # Add to .env.local
        echo "" >> .env.local
        echo "# Cloudflare API Token (for GitHub Actions)" >> .env.local
        echo "CLOUDFLARE_API_TOKEN=$cf_api_token" >> .env.local
        print_success "Cloudflare API Token added to .env.local"
    fi
fi

# Summary
print_header "Setup Complete! 🎉"
echo "Your Cloudflare R2 configuration:"
echo ""
echo "  Account ID:     $account_id"
echo "  Bucket Name:    $bucket_name"
echo "  Access Key ID:  ${access_key_id:0:20}..."
echo "  Public URL:     $public_url"
echo ""
print_success "Configuration saved to .env.local"
echo ""

# Next steps
print_header "Next Steps"
echo "1. Complete your .env.local file with other required credentials"
echo "   (See .env.example for all required variables)"
echo ""
echo "2. Test R2 locally:"
echo "   npm run dev"
echo "   Try uploading a file through your app"
echo ""
echo "3. Set up GitHub secrets for deployment:"
echo "   python3 scripts/setup-github-secrets.py"
echo ""
echo "4. Deploy to production!"
echo ""

read -p "Would you like to set up GitHub secrets now? (yes/no): " setup_github

if [[ $setup_github == "yes" || $setup_github == "y" ]]; then
    print_info "Installing Python dependencies..."
    pip install PyNaCl requests 2>/dev/null || pip3 install PyNaCl requests

    print_info "Running GitHub secrets setup..."
    python3 scripts/setup-github-secrets.py
fi

print_header "All Done! 🚀"
echo "Your Cloudflare R2 integration is ready to use!"
echo ""
print_info "For more details, see CLOUDFLARE_SETUP.md"
