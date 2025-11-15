# Photo Upload System - Setup Instructions

## ✅ What's Already Done

1. **Photo Upload Admin Interface**: `/admin/animals` and `/admin/animals/[id]/photos` pages are built and ready
2. **API Routes**: All endpoints for uploading, managing, and displaying photos are implemented
3. **Cloudflare R2 Integration**: Photo storage library is configured and ready
4. **Adopt Page**: Updated to automatically display photos from the database
5. **Next.js 15**: Downgraded from v16 to v15 to fix route discovery issues

## ⚠️ What You Need to Configure

The photo upload system is **code-complete** but needs these configurations to work:

---

## 1. DATABASE CONFIGURATION (Required)

### Option A: Using Supabase (Recommended)

**Step 1: Get your Supabase credentials**
1. Go to https://supabase.com/dashboard
2. Select your project (or create one)
3. Go to Settings → Database
4. Copy the **Connection String** (Transaction mode)
   - Should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

5. Go to Settings → API
6. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (starts with eyJ)

**Step 2: Add to `.env.local`** (for local development)

Uncomment and fill in these lines in `/home/user/spar/.env.local`:

```bash
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
```

**Step 3: Add to Vercel**

1. Go to your Vercel dashboard → Your Project → Settings → Environment Variables
2. Add these variables (mark as Production, Preview, and Development):
   - `DATABASE_URL` = `postgresql://postgres:...`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGc...`

**Step 4: Run database migration**

After adding DATABASE_URL locally, run:

```bash
cd /home/user/spar
npx prisma migrate deploy
```

This creates the `Animal` and `AnimalImage` tables.

---

### Option B: Using Another PostgreSQL Database

If you're using a different PostgreSQL provider:

1. Get your connection string from your provider
2. Add to `.env.local`:
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```
3. Add the same to Vercel environment variables
4. Run `npx prisma migrate deploy`

---

## 2. CLOUDFLARE R2 PUBLIC ACCESS (Required)

Your R2 credentials are already in `.env.local`, but you need to enable public access:

**Step 1: Configure R2 Bucket for Public Access**

1. Go to Cloudflare Dashboard → R2
2. Select your bucket: `spar-animals`
3. Click **Settings**
4. Under "Public Access", click **Allow Access**
5. Copy the **Public Bucket URL**
   - Should look like: `https://pub-xxxxx.r2.dev` or a custom domain

**Step 2: Add CORS Rules**

Still in bucket settings, add CORS configuration:

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

**Step 3: Update Environment Variables**

Update the public URL in `.env.local`:

```bash
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

And add ALL these to Vercel Environment Variables:
- `CLOUDFLARE_R2_ACCOUNT_ID` = `ede6590ac0d2fb7daf155b35653457b2`
- `CLOUDFLARE_R2_ACCESS_KEY_ID` = `89dbdd887021bbeaaa10ded04b62d421`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY` = `4c28c448983c64fb760cecc2c434e05621225f9f8bf20d14346b0fb1f77ec438`
- `CLOUDFLARE_R2_BUCKET_NAME` = `spar-animals`
- `CLOUDFLARE_R2_PUBLIC_URL` = `https://pub-xxxxx.r2.dev` (your actual public URL)

---

## 3. ADDING ANIMALS TO DATABASE (Required for Photo Upload)

The photo upload interface needs animals in the database first. You have two options:

### Option A: Use Prisma Studio (Easiest)

```bash
cd /home/user/spar
npx prisma studio
```

This opens a web UI where you can manually add animals with fields like:
- name: "Blue"
- type: "dog"
- breed: "Pitbull"
- age: 1
- gender: "Male"
- price: 250
- status: "available"

### Option B: Create an Animal via API

Make a POST request to `/api/animals`:

```bash
curl -X POST https://your-vercel-app.vercel.app/api/animals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blue",
    "type": "dog",
    "breed": "Pitbull",
    "age": 1,
    "gender": "Male",
    "price": 250,
    "status": "available",
    "spayedNeutered": true,
    "vaccinated": true,
    "microchipped": true
  }'
```

---

## 4. TESTING THE COMPLETE WORKFLOW

Once everything is configured:

**Step 1: Access Photo Upload**
1. Go to your website
2. Click "Photo Upload" in the header
3. You should see a list of animals

**Step 2: Upload Photos**
1. Click "Manage Photos" for an animal
2. Drag and drop up to 10 images
3. Click "Upload X Images"
4. Photos upload to Cloudflare R2
5. Database records are created

**Step 3: Set Primary Photo**
1. After upload, you'll see all photos
2. Click "Set Primary" on the photo you want to show first
3. This photo will appear first on the adopt page

**Step 4: Verify on Adopt Page**
1. Go to /adopt
2. You should see your uploaded photos instead of the hardcoded ones
3. The blue notice "Showing sample data" should disappear

---

## 🚀 Quick Start Checklist

- [ ] Add `DATABASE_URL` to .env.local and Vercel
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to .env.local and Vercel
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to .env.local and Vercel
- [ ] Run `npx prisma migrate deploy` locally
- [ ] Enable public access on R2 bucket `spar-animals`
- [ ] Get R2 public URL and update `CLOUDFLARE_R2_PUBLIC_URL`
- [ ] Add all 5 Cloudflare R2 variables to Vercel
- [ ] Add at least one animal to database (via Prisma Studio or API)
- [ ] Test photo upload at /admin/animals
- [ ] Verify photos appear on /adopt page

---

## ⚡ What Happens Without Configuration

- **Without DATABASE_URL**:
  - Photo Upload page will show "No animals found"
  - Adopt page will show sample data with blue notice
  - Photo uploads will fail

- **Without R2 Public URL**:
  - Photos will upload but won't display (broken image links)
  - Need correct public URL for images to show

- **Without Animals in Database**:
  - Photo Upload page will say "No animals found. Add animals to the database first."
  - Adopt page will continue showing sample data

---

## 📁 File Structure Reference

```
/home/user/spar/
├── .env.local                 # Add DATABASE_URL and Supabase vars here
├── app/
│   ├── admin/animals/         # Photo upload admin pages
│   ├── adopt/                 # Public adopt page (shows uploaded photos)
│   └── api/animals/           # All API endpoints for photo management
├── lib/
│   ├── r2.ts                  # Cloudflare R2 upload/delete functions
│   └── db.ts                  # Prisma database client
├── prisma/
│   └── schema.prisma          # Database schema (Animal, AnimalImage)
└── IMAGE_SETUP_PLAN.md        # Detailed technical documentation
```

---

## 🆘 Troubleshooting

**"No animals found"**
→ You need to add animals to the database first (see step 3)

**Photos upload but don't display**
→ Check that R2 public access is enabled and CLOUDFLARE_R2_PUBLIC_URL is correct

**404 on /admin/animals**
→ Make sure you pushed the latest code to Vercel and it deployed successfully

**"Database not configured" notice**
→ Add DATABASE_URL to Vercel environment variables and redeploy

---

## 📞 Need Help?

If you get stuck on any step, let me know which specific step you're on and what error you're seeing.
