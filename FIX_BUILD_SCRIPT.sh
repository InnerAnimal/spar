#!/bin/bash

# 🔧 SPAR Build Fix Script
# This script resolves package manager conflicts and rebuilds the project

set -e  # Exit on any error

echo "============================================"
echo "🔧 SPAR Build Fix Script"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify we're in the SPAR directory
echo "📍 Step 1: Verifying location..."
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo "Please run this script from the SPAR repository root."
    exit 1
fi

# Check if this is the SPAR project
if ! grep -q "inneranimalmedia" package.json; then
    echo -e "${YELLOW}⚠️  Warning: This might not be the SPAR project${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Found SPAR project${NC}"
echo ""

# Step 2: Clean all lock files and build artifacts
echo "🧹 Step 2: Cleaning old files..."
rm -rf node_modules
rm -rf .next
rm -rf .vercel
rm -rf out
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

echo -e "${GREEN}✓ Cleaned all lock files and build artifacts${NC}"
echo ""

# Step 3: Fresh install with npm
echo "📦 Step 3: Installing dependencies with npm..."
npm install

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 4: Test the build
echo "🏗️  Step 4: Testing build..."
npm run build

echo -e "${GREEN}✓ Build successful!${NC}"
echo ""

# Step 5: Offer to commit and push
echo "============================================"
echo -e "${GREEN}✅ All fixes applied successfully!${NC}"
echo "============================================"
echo ""

read -p "Do you want to commit and push these changes? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Committing changes..."
    git add package-lock.json
    git commit -m "fix: resolve package manager conflicts - use npm exclusively"

    echo "🚀 Pushing to remote..."
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    git push -u origin "$BRANCH"

    echo -e "${GREEN}✓ Changes committed and pushed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Go to GitHub and check your PR"
    echo "2. Wait for Vercel checks to pass"
    echo "3. Merge when ready!"
else
    echo "Skipping commit. You can commit manually later with:"
    echo "  git add package-lock.json"
    echo "  git commit -m \"fix: resolve package manager conflicts\""
    echo "  git push"
fi

echo ""
echo -e "${GREEN}🎉 Done!${NC}"
