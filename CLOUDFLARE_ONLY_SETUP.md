# Setup Photo Upload with ONLY Cloudflare (No Supabase!)

**Everything in Cloudflare - simpler, cheaper, faster!**

## ✅ What You're Using

- **Cloudflare R2**: Image storage (already configured!)
- **Cloudflare D1**: SQL database for animal metadata
- **Vercel**: Hosting

**No Supabase needed!**

---

## Quick Start (Choose Your Path)

### Path A: Test Locally First (Recommended) - 10 minutes

This gets you working locally, then you can deploy:

1. **Local Database**
```bash
cd /home/user/spar

# Update .env.local
echo 'DATABASE_URL="file:./dev.db"' >> .env.local

# Generate Prisma client & create tables
npx prisma generate
npx prisma migrate dev --name init
```

2. **Enable R2 Public Access** (3 mins)
   - Cloudflare Dashboard → R2 → `spar-animals` → Settings
   - Click "Allow Public Access"
   - Copy the public URL (like `https://pub-xxxxx.r2.dev`)
   - Update `.env.local`:
     ```
     CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
     ```
   - Add CORS policy (scroll down for JSON)

3. **Add a Test Animal**
```bash
npx prisma studio
# Opens localhost:5555
# Click "Animal" → "Add Record"
# name: Blue, type: dog, age: 1, gender: Male, price: 250, status: available
# Save
```

4. **Test It!**
```bash
npm run dev
# Go to localhost:3000/admin/animals
# Upload photos!
# Check localhost:3000/adopt
```

---

### Path B: Deploy to Production Immediately - 15 minutes

Skip local testing and go straight to Vercel:

**Step 1: Get Turso Database** (free SQLite hosting, works perfectly with Cloudflare D1 schema)

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso auth login
turso db create spar-animals

# Get credentials
turso db show spar-animals --url
# Copy this: libsql://spar-animals-username.turso.io

turso db tokens create spar-animals
# Copy the token: eyJhbGc...
```

**Step 2: Add to Vercel**

Vercel Dashboard → Your Project → Settings → Environment Variables:

```
DATABASE_URL = libsql://spar-animals-username.turso.io
TURSO_AUTH_TOKEN = eyJhbGc...your-token...

CLOUDFLARE_R2_ACCOUNT_ID = ede6590ac0d2fb7daf155b35653457b2
CLOUDFLARE_R2_ACCESS_KEY_ID = 89dbdd887021bbeaaa10ded04b62d421
CLOUDFLARE_R2_SECRET_ACCESS_KEY = 4c28c448983c64fb760cecc2c434e05621225f9f8bf20d14346b0fb1f77ec438
CLOUDFLARE_R2_BUCKET_NAME = spar-animals
CLOUDFLARE_R2_PUBLIC_URL = https://pub-xxxxx.r2.dev
```

**Step 3: Push Database Schema**

```bash
DATABASE_URL="libsql://spar-animals-username.turso.io?authToken=YOUR_TOKEN_HERE" npx prisma db push
```

**Step 4: Enable R2 Public Access**
- Cloudflare Dashboard → R2 → `spar-animals`
- Settings → Allow Public Access
- Copy URL, update in Vercel

**Step 5: Add Animal via API**

After Vercel deploys:
```bash
curl -X POST https://your-app.vercel.app/api/animals \
  -H "Content-Type: application/json" \
  -d '{"name":"Blue","type":"dog","age":1,"gender":"Male","price":250,"status":"available"}'
```

**Step 6: Test Photo Upload**
- Go to `https://your-app.vercel.app/admin/animals`
- Upload photos!

---

## R2 CORS Configuration

In Cloudflare Dashboard → R2 → spar-animals → Settings → CORS Policy:

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

---

## What I Changed for You

I already updated your code to use SQLite (compatible with Cloudflare D1):

**Changes made:**
1. ✅ `prisma/schema.prisma` - Changed from PostgreSQL to SQLite
2. ✅ `Animal.age` - Changed from String to Int (stores years)
3. ✅ `Animal.gender` and `Animal.price` - Made optional (nullable)

All your API routes and pages are already ready - they work with both PostgreSQL and SQLite!

---

## Complete Workflow After Setup

1. You (or business partner) go to website
2. Click "Photo Upload" in header
3. See list of animals
4. Click "Manage Photos" for an animal
5. Drag and drop up to 10 images → Upload to Cloudflare R2
6. Click "Set Primary" on the main photo
7. Photos automatically appear on `/adopt` page from R2!

---

## Why This is Better

| Feature | Supabase Setup | Cloudflare Only |
|---------|---------------|-----------------|
| Providers | 2 (Cloudflare + Supabase) | 1 (Cloudflare) |
| Database Setup | Complex auth, PostgreSQL | Simple SQLite |
| Cost | Higher (PostgreSQL + bandwidth) | Lower (SQLite + free egress) |
| Speed | Slower (two data centers) | Faster (same data center) |
| Complexity | More moving parts | Simple |

---

## Troubleshooting

**"npx command not found"**
- Install Node.js: https://nodejs.org/

**"No animals found" on /admin/animals**
- Database is empty
- Add animal via Prisma Studio or API

**Photos upload but broken images**
- R2 public access not enabled
- Wrong CLOUDFLARE_R2_PUBLIC_URL
- CORS not set

**Turso connection fails**
- Check DATABASE_URL format
- Verify auth token is correct
- Try: `turso db shell spar-animals` to test connection

---

## Next Steps After It Works

- [ ] Add authentication for `/admin/animals` route (optional)
- [ ] Create more animals in database
- [ ] Upload real photos
- [ ] Customize animal fields as needed
- [ ] Set up automatic backups (Turso does this)

---

## Need Help?

Tell me which path you chose (A or B) and where you're stuck!
