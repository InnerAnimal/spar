# Southern Pets Animal Rescue 🐾

A modern, full-service web application for Southern Pets Animal Rescue - a 501(c)(3) nonprofit organization serving Acadia Parish, Louisiana.

## 🚀 Project Overview

This Next.js 14 application replaces the organization's static HTML site with a seamless, database-driven platform featuring:

- **Animal Listings**: Browse available dogs and cats for adoption
- **Form Management**: TNR requests, adoption applications, foster applications, and more
- **Email Notifications**: Automated confirmation and notification emails
- **Admin Dashboard**: Manage submissions and track animals (coming soon)
- **Mobile Responsive**: Fully optimized for all devices

## 📋 Features

### Public Pages
- **Home**: Hero section, benefits, and donation options
- **Adopt**: Tabbed interface (Dogs/Cats) with animal cards and health details
- **Services/TNR**: TNR program information, process steps, and service packages
- **Forms Hub**: Access to all available forms

### Forms (Database-Driven)
- ✅ TNR Request (Complete with Supabase)
- 🚧 Adoption Application (Schema ready, form in development)
- 🚧 Contact Form (Placeholder)
- 🚧 Surrender Request (Placeholder)
- 🚧 Foster Application (Placeholder)
- 🚧 Volunteer Signup (Placeholder)
- 🚧 Donate Pledge (Placeholder)

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Email**: Resend (configured, not yet implemented)
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Southern-Pets-Animal-Rescue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `RESEND_API_KEY`: Your Resend API key
   - `FROM_EMAIL`: Sender email address
   - `NOTIFICATION_EMAIL`: Email for receiving form submissions
   - Cloudflare Turnstile keys (optional, for spam protection)

4. **Set up the database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the SQL in the editor to create all tables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
southern-pets-animal-rescue/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (Home, Adopt, Services)
│   ├── forms/             # Form pages (TNR, Adoption, etc.)
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout with Header/Footer
├── components/
│   ├── layout/            # Header, Footer, Navigation
│   ├── shared/            # Reusable components (DonateSection)
│   └── ui/                # UI primitives (Input, Button, Textarea)
├── lib/
│   ├── validation/        # Zod schemas for form validation
│   ├── db.ts              # Prisma client singleton
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following tables:
- `tnr_requests` - TNR service requests
- `adoption_applications` - Pet adoption applications
- `contact_submissions` - Contact form submissions
- `surrender_requests` - Animal surrender requests
- `foster_applications` - Foster parent applications
- `volunteer_signups` - Volunteer signups
- `donate_pledges` - Donation pledges
- `animals` - Animal listings (dogs/cats)

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## 🔧 Development Roadmap

### Phase 1: Core Foundation ✅
- [x] Next.js project setup
- [x] Supabase database schema
- [x] Shared components (Header, Footer, Donate Section)
- [x] Home, Adopt, and Services pages
- [x] Forms hub page

### Phase 2: TNR Form ✅
- [x] TNR Request form with validation
- [x] TNR API route with Supabase
- [x] Thank you page

### Phase 3: Adoption Application 🚧
- [ ] Complete adoption application form (40+ fields)
- [ ] Multi-step form UI
- [ ] Digital signature capture
- [ ] API route implementation

### Phase 4: Remaining Forms 🚧
- [ ] Contact form
- [ ] Surrender request form
- [ ] Foster application form
- [ ] Volunteer signup form
- [ ] Donate pledge form

### Phase 5: Email System 📧
- [ ] Email templates (React Email)
- [ ] Confirmation emails for applicants
- [ ] Notification emails for admin
- [ ] Integration with Resend

### Phase 6: Admin Dashboard 🔐
- [ ] Authentication (NextAuth.js)
- [ ] View all form submissions
- [ ] Animal management (CRUD)
- [ ] Export submissions to CSV
- [ ] Search and filter functionality

### Phase 7: Additional Features 🎯
- [ ] Cloudflare Turnstile spam protection
- [ ] File uploads for adoption applications
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Image optimization

## 🌐 Deployment

### Recommended Platform: Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository
   - Add environment variables (see below)
   - Deploy!

3. **Set up Supabase Database**
   - Create a Supabase project at https://supabase.com
   - Navigate to SQL Editor in your Supabase dashboard
   - Copy and run the SQL from `supabase/migrations/001_initial_schema.sql`
   - Get your Supabase URL and Anon Key from Project Settings > API

4. **Add Vercel Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   RESEND_API_KEY=re_...
   FROM_EMAIL=noreply@southernpetsanimalrescue.org
   NOTIFICATION_EMAIL=SouthernPetsAnimalRescue@gmail.com
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

## 📧 Contact Information

**Southern Pets Animal Rescue**
- Email: SouthernPetsAnimalRescue@gmail.com
- Phone: 337-581-7562
- Location: Acadia Parish, Louisiana
- Tax Status: 501(c)(3) Nonprofit

## 📄 License

This project is proprietary and confidential.
© 2025 Southern Pets Animal Rescue. All rights reserved.

---

**Built with ❤️ for animals in need**