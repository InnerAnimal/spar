# InnerAnimalMedia Platform

A full-stack platform built with Next.js 14, Supabase, Stripe, and AI integrations.

**Note:** This repository also hosts the Southern Pets Animal Rescue (SPAR) website.

## Features

- **AI Chat Platform**: Dual AI interface with ChatGPT (GPT-4) and Anthropic Claude
- **Community Forum**: Message board with real-time updates
- **Video Conferencing**: WebRTC-based video calls (coming soon)
- **User Dashboard**: Personalized portal for users
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **Stripe Integration**: Payment processing and subscription management
- **Supabase Backend**: PostgreSQL database with Row Level Security

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Payments**: Stripe
- **AI**: OpenAI API + Anthropic Claude API
- **Email**: Resend
- **Storage**: Cloudflare R2
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Stripe account
- OpenAI API key
- Anthropic API key

### Quick Setup (Automated)

For the fastest setup experience, use our automated setup script:

```bash
# One-command setup
bash scripts/setup-all.sh
```

This will guide you through:
- Cloudflare R2 storage setup
- Environment configuration
- GitHub secrets (for CI/CD)

See [`scripts/README.md`](scripts/README.md) for detailed documentation.

### Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/InnerAnimal/spar.git
cd spar
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Option A: Automated (Recommended)**
```bash
bash scripts/cloudflare-interactive-setup.sh
```

**Option B: Manual**
```bash
cp .env.example .env.local
```

Fill in your API keys in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `RESEND_API_KEY`: Your Resend API key
- `CLOUDFLARE_R2_*`: Cloudflare R2 credentials (see [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md))

4. Set up GitHub Secrets (for deployment):
```bash
pip install PyNaCl requests
python3 scripts/setup-github-secrets.py
```

5. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
inneranimalmedia/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utility libraries
│   └── types/                 # TypeScript types
├── supabase/
│   └── migrations/           # Database migrations
└── public/                    # Static assets
```

## Pages

### Public Pages
- `/` - Home page
- `/about` - About page
- `/services` - Services overview
- `/portfolio` - Portfolio showcase
- `/blog` - Blog listing
- `/contact` - Contact form
- `/legal/*` - Legal pages

### Auth Pages
- `/auth/login` - Login page
- `/auth/signup` - Sign up page
- `/auth/reset` - Password reset

### Dashboard Pages (Protected)
- `/app/dashboard` - User dashboard
- `/app/chat` - AI chat interface
- `/app/community` - Community forum
- `/app/video` - Video conferencing
- `/app/admin` - Admin dashboard (admin only)

## Database Schema

The platform uses the following main tables:
- `profiles` - User profiles
- `conversations` - AI chat conversations
- `messages` - Chat messages
- `posts` - Community posts
- `video_rooms` - Video room data
- `subscriptions` - Stripe subscriptions
- `contact_submissions` - Contact form submissions

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## Deployment

### Automated Deployment (Recommended)

The project includes automated deployment workflows for both Vercel and Cloudflare Pages.

**GitHub Secrets** (required for automated deployments):
```bash
# Set up all GitHub secrets automatically
python3 scripts/setup-github-secrets.py
```

See [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) for detailed instructions.

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add all environment variables (or use automated setup script)
4. Deploy

Or use Vercel CLI:
```bash
vercel --prod
```

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete guide.

### Cloudflare Pages Deployment

The project includes a GitHub Actions workflow for automatic deployment to Cloudflare Pages:

1. Set up Cloudflare R2 (for storage)
2. Configure GitHub secrets
3. Push to `main` branch

The workflow automatically builds and deploys on push.

See [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for complete Cloudflare R2 setup guide.

## Documentation

- **[CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)** - Complete Cloudflare R2 setup guide
- **[GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)** - GitHub secrets configuration
- **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** - Vercel deployment guide
- **[scripts/README.md](scripts/README.md)** - Automation scripts documentation
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Deployment features overview

## Cloudflare R2 Storage

This project uses Cloudflare R2 for file storage with:
- Zero egress fees
- S3-compatible API
- Signed URLs for secure uploads/downloads
- Public URL support
- User-specific file organization

See the [Cloudflare Setup Guide](CLOUDFLARE_SETUP.md) for setup instructions.

## License

Private - InnerAnimalMedia Platform
