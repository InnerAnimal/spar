#!/bin/bash

# Script to push SPAR repo with GitHub token

set -e

echo "🚀 SPAR Repository Push Script"
echo ""

# Check if token provided as argument
if [ -z "$1" ]; then
    echo "Usage: ./push-with-token.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "Or set GITHUB_TOKEN environment variable:"
    echo "  export GITHUB_TOKEN=your_token_here"
    echo "  ./push-with-token.sh"
    exit 1
fi

GITHUB_TOKEN=$1

# Navigate to repo
cd /Users/samprimeaux/Desktop/spar

echo "📋 Current status:"
git status --short
echo ""

echo "📦 Commits ready to push:"
git log origin/main..HEAD --oneline
echo ""

# Set remote URL with token
echo "🔐 Setting up authentication..."
git remote set-url origin https://${GITHUB_TOKEN}@github.com/inneranimal/spar.git

# Push
echo "🚀 Pushing to GitHub..."
if git push origin main 2>&1; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "📊 Pushed commits:"
    git log origin/main --oneline -2
    echo ""
    echo "🌐 GitHub Pages will auto-deploy from 'out/' folder"
    echo "   Test URL: https://inneranimal.github.io/spar/"
else
    echo ""
    echo "❌ Push failed. Check token permissions."
    echo "   Token needs 'repo' scope for push access."
    exit 1
fi

