# InnerAnimalMedia Platform

A full-stack platform built with Next.js 14, Supabase, Stripe, and AI integrations.

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

### Installation

1. Clone the repository:
```bash
cd inneranimalmedia
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
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

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`

5. Run the development server:
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

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add all environment variables
4. Deploy

Or use Vercel CLI:
```bash
vercel --prod
```

## License

Private - InnerAnimalMedia Platform
