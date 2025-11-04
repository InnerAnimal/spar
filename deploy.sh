#!/bin/bash

# Southern Pets Animal Rescue - Vercel Deployment Script
# This script deploys the app to your Vercel project

echo "🐾 Deploying Southern Pets Animal Rescue to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Link to specific Vercel project
echo "Linking to Vercel project..."
vercel link --project-id=prj_XYqKdHLEDWRs7jDDH1t6ZHbNHYwD --yes

# Pull environment variables (if they exist)
echo "Pulling environment variables..."
vercel env pull .env.local || true

# Deploy to production
echo "Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site should be live at your Vercel domain"
echo ""
echo "⚠️  IMPORTANT: Don't forget to set up your database!"
echo "   1. Create a PostgreSQL database (Vercel Postgres, Supabase, or Neon)"
echo "   2. Add DATABASE_URL to Vercel environment variables"
echo "   3. Run: vercel env pull && npx prisma db push"
