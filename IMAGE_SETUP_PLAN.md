# Complete Image Management Setup Plan

## Current Status
✅ Cloudflare R2 credentials configured in `.env.local`
✅ R2 library implemented (`src/lib/r2.ts`)
✅ API endpoints created (`/api/animals`, `/api/animals/[id]/images`)
✅ Image upload component created (`src/components/ui/image-upload.tsx`)
❌ Photo upload admin page not accessible (Next.js 16 route discovery bug)
❌ Images not displaying on adopt page

---

## RECOMMENDATION: Use Cloudflare R2 for Image Storage

**Why Cloudflare R2 over Supabase Storage:**

✅ **Already configured** - You have R2 credentials set up
✅ **Zero egress fees** - Unlimited downloads, no bandwidth charges
✅ **Better performance** - Cloudflare CDN is faster globally
✅ **Cheaper** - $0.015/GB storage vs Supabase's $0.021/GB
✅ **Simpler architecture** - One less service to manage

**Use Supabase for:**
- User authentication (if you set it up)
- Database only (store image URLs, not files)

---

## CHECKLIST: What Must Be Done

### 1. VERCEL ENVIRONMENT VARIABLES (REQUIRED)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:

```bash
# Cloudflare R2 (Image Storage)
CLOUDFLARE_R2_ACCOUNT_ID=ede6590ac0d2fb7daf155b35653457b2
CLOUDFLARE_R2_ACCESS_KEY_ID=89dbdd887021bbeaaa10ded04b62d421
CLOUDFLARE_R2_SECRET_ACCESS_KEY=4c28c448983c64fb760cecc2c434e05621225f9f8bf20d14346b0fb1f77ec438
CLOUDFLARE_R2_BUCKET_NAME=spar-animals
CLOUDFLARE_R2_PUBLIC_URL=https://pub-[your-bucket-id].r2.dev

# Database (Prisma/PostgreSQL) - REQUIRED for storing animal data
DATABASE_URL=postgresql://user:password@host:port/database

# Next.js
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Action Required:**
- [ ] Add these environment variables to Vercel
- [ ] Get your DATABASE_URL from your database provider

---

### 2. CLOUDFLARE R2 BUCKET SETUP (REQUIRED)

**a) Create R2 Bucket (if not exists)**
1. Go to Cloudflare Dashboard → R2
2. Create bucket named `spar-animals`
3. ✅ Already have credentials

**b) Enable Public Access**
1. Go to your R2 bucket settings
2. Enable "Public Access"
3. Copy the public bucket URL (like `https://pub-xxx.r2.dev`)
4. Add CORS rules:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

**Action Required:**
- [ ] Enable public access on R2 bucket
- [ ] Add CORS rules
- [ ] Get public bucket URL
- [ ] Update `CLOUDFLARE_R2_PUBLIC_URL` in Vercel

---

### 3. DATABASE SETUP (REQUIRED)

**You need a PostgreSQL database to store:**
- Animal data (name, type, breed, age, status)
- Image references (URLs, filenames, which is primary)

**Options:**

**A) Supabase (Recommended - Free Tier)**
1. Go to https://supabase.com
2. Create new project
3. Wait for database to provision
4. Go to Settings → Database → Connection String
5. Copy the connection string
6. Add to Vercel as `DATABASE_URL`

**B) Vercel Postgres**
1. In Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. It auto-adds `DATABASE_URL` to your env vars

**C) Railway / Neon / Other**
- Any PostgreSQL provider works
- Just need the connection string

**Action Required:**
- [ ] Choose database provider
- [ ] Create database
- [ ] Add `DATABASE_URL` to Vercel environment variables

---

### 4. RUN DATABASE MIGRATIONS (REQUIRED)

Once you have `DATABASE_URL` configured:

```bash
# Run this locally or in Vercel
npx prisma migrate deploy
```

This creates the database tables for:
- Animals
- Animal Images

**Action Required:**
- [ ] Run `npx prisma migrate deploy` after DATABASE_URL is set

---

### 5. FIX PHOTO UPLOAD ADMIN ROUTE (CURRENT BLOCKER)

**The Problem:**
Next.js 16 refuses to build any new routes outside the `(public)` route group.

**Possible Solutions:**

**Option A: Downgrade Next.js**
```bash
npm install next@15.0.3
npm run build
```
This should make `/admin/animals` routes work.

**Option B: Use Vercel Rewrites**
Add to `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/photos-admin",
      "destination": "/api/admin-page"
    }
  ]
}
```
Then create API route that returns HTML.

**Option C: Create Separate Admin App**
- Deploy admin panel as separate Next.js app
- Deploy to `admin.yourdomain.com`
- Shares same database and R2 bucket

**Action Required:**
- [ ] Choose which option you prefer
- [ ] I'll implement it

---

### 6. DISPLAY IMAGES ON ADOPT PAGE (REQUIRED)

**Current Issue:**
The `/adopt` page needs to fetch and display animal images.

**What needs to be added to `/src/app/(public)/adopt/page.tsx`:**

```tsx
// Fetch animals with images
const animals = await fetch('/api/animals').then(r => r.json())

// Display with image carousel
{animals.map(animal => (
  <div key={animal.id}>
    <img
      src={animal.images[0]?.url || '/placeholder.jpg'}
      alt={animal.name}
    />
  </div>
))}
```

**Action Required:**
- [ ] Update adopt page to fetch from `/api/animals`
- [ ] Display animal images from R2 URLs

---

### 7. IMAGE WORKFLOW DIAGRAM

```
┌─────────────────┐
│ Business Partner│
│  Uploads Photo  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Photo Upload  │ ← Currently blocked (no route)
│   Admin Page    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Endpoint   │
│ /api/animals/   │
│  [id]/images    │
└────────┬────────┘
         │
         ├──────────────┐
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│ Cloudflare R2│  │  PostgreSQL  │
│ (stores file)│  │ (stores URL) │
└──────────────┘  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Adopt Page  │
                  │ (displays)   │
                  └──────────────┘
```

---

## PRIORITY ORDER (What to do first)

### HIGH PRIORITY (Do These Now):

1. **Set up database**
   - Choose provider (Supabase recommended)
   - Get `DATABASE_URL`
   - Add to Vercel environment variables
   - Run `npx prisma migrate deploy`

2. **Configure Cloudflare R2**
   - Enable public access
   - Add CORS rules
   - Get public bucket URL
   - Add to Vercel as `CLOUDFLARE_R2_PUBLIC_URL`

3. **Fix admin route access**
   - Choose Option A, B, or C above
   - Tell me which you prefer

### MEDIUM PRIORITY (After admin route works):

4. **Test photo upload**
   - Access admin page
   - Upload test images
   - Verify they appear in R2 bucket

5. **Update adopt page**
   - Fetch animals from API
   - Display images from R2 URLs

### LOW PRIORITY (Nice to have):

6. **Image optimization**
   - Add Next.js Image component
   - Configure Cloudflare image resizing

7. **Bulk upload**
   - Upload multiple animals at once
   - CSV import feature

---

## WHAT I NEED FROM YOU

Please provide:

1. **Database choice** - Which database provider do you want?
   - [ ] Supabase (recommended, free)
   - [ ] Vercel Postgres
   - [ ] Other (specify)

2. **Admin route solution** - Which option do you prefer?
   - [ ] Option A: Downgrade Next.js to 15
   - [ ] Option B: Use Vercel rewrites
   - [ ] Option C: Separate admin app

3. **Access to configure:**
   - [ ] Vercel dashboard (to add environment variables)
   - [ ] Cloudflare dashboard (to enable public R2 access)

Once you tell me your choices, I can implement everything step-by-step.

---

## FINAL RESULT

When complete, your workflow will be:

1. Business partner goes to photo upload page
2. Selects animal from list
3. Drags and drops photos
4. Photos upload to Cloudflare R2
5. URLs saved to PostgreSQL database
6. Images appear on `/adopt` page immediately
7. Visitors see beautiful animal photos
8. Zero bandwidth costs thanks to R2

**Everything is already built - we just need to fix the route access issue and configure the services.**
