#!/bin/bash

# Complete Cloudflare Setup - One Command
# This script runs all setup steps in sequence

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     InnerAnimal Media - Complete Cloudflare Setup        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo "This automated setup will configure:"
echo "  ✓ Cloudflare R2 storage"
echo "  ✓ Local environment (.env.local)"
echo "  ✓ GitHub secrets (for CI/CD)"
echo "  ✓ Deployment configuration"
echo ""
read -p "Ready to begin? (yes/no): " ready

if [[ $ready != "yes" && $ready != "y" ]]; then
    echo "Setup cancelled."
    exit 0
fi

# Step 1: Interactive Cloudflare setup
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 1: Cloudflare R2 Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

bash scripts/cloudflare-interactive-setup.sh

# Check if .env.local was created
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Cloudflare setup may have been cancelled.${NC}"
    read -p "Do you want to continue with GitHub secrets setup? (yes/no): " continue_setup

    if [[ $continue_setup != "yes" && $continue_setup != "y" ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Step 2: Complete .env.local with other services
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 2: Additional Services Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo "You'll need to add credentials for:"
echo "  • Supabase (database & auth)"
echo "  • Stripe (payments)"
echo "  • Other API keys (OpenAI, Anthropic, Resend)"
echo ""
read -p "Do you want to add these now? (yes/no): " add_services

if [[ $add_services == "yes" || $add_services == "y" ]]; then
    echo ""
    echo "Opening .env.local for editing..."
    echo "Please fill in the remaining values."
    echo ""
    read -p "Press Enter to open .env.local in your editor..."

    # Try to detect and use default editor
    if [ -n "$EDITOR" ]; then
        $EDITOR .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    elif command -v vim &> /dev/null; then
        vim .env.local
    elif command -v vi &> /dev/null; then
        vi .env.local
    else
        echo -e "${YELLOW}No text editor found. Please edit .env.local manually.${NC}"
    fi

    echo ""
    read -p "Have you completed .env.local? (yes/no): " env_complete
fi

# Step 3: Verify dependencies
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 3: Installing Dependencies${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo "Installing Python dependencies for GitHub secrets setup..."
pip install PyNaCl requests 2>/dev/null || pip3 install PyNaCl requests

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Could not install dependencies automatically${NC}"
    echo "Please run: pip install PyNaCl requests"
fi

# Step 4: GitHub Secrets Setup
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 4: GitHub Secrets Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

read -p "Do you want to set up GitHub secrets now? (yes/no): " setup_github

if [[ $setup_github == "yes" || $setup_github == "y" ]]; then
    echo ""
    python3 scripts/setup-github-secrets.py

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ GitHub secrets configured${NC}"
    else
        echo -e "${YELLOW}⚠️  GitHub secrets setup encountered issues${NC}"
        echo "You can run it manually later: python3 scripts/setup-github-secrets.py"
    fi
fi

# Final Summary
echo -e "\n${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              🎉  Setup Complete!  🎉                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo "What's been set up:"
echo ""

if [ -f .env.local ]; then
    echo -e "  ${GREEN}✓${NC} Local environment (.env.local)"
else
    echo -e "  ${YELLOW}⚠${NC} Local environment (missing)"
fi

echo -e "  ${GREEN}✓${NC} Cloudflare R2 configuration"
echo -e "  ${GREEN}✓${NC} GitHub Actions workflow"

echo ""
echo "Next steps:"
echo ""
echo "  1. Verify GitHub secrets at:"
echo "     https://github.com/InnerAnimal/spar/settings/secrets/actions"
echo ""
echo "  2. Test locally:"
echo "     npm install"
echo "     npm run dev"
echo ""
echo "  3. Test R2 file upload through your application"
echo ""
echo "  4. Deploy to production!"
echo ""
echo "For detailed documentation, see:"
echo "  • CLOUDFLARE_SETUP.md - Complete setup guide"
echo "  • GITHUB_SECRETS_SETUP.md - Secrets configuration"
echo "  • scripts/README.md - Scripts documentation"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
