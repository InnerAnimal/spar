# Database Setup Instructions

The website is currently configured to use **SQLite** with Prisma ORM. Since the database needs to be initialized, follow these steps:

## Environment Variable

Make sure you have this in your `.env.local` (already added):
```
DATABASE_URL="file:./dev.db"
```

For Vercel production, this should be:
```
DATABASE_URL="file:/tmp/prod.db"
```

## Initialize the Database (Run Locally)

To set up the database, you need to run these commands **from your local machine** (not in the web editor):

```bash
# Navigate to your project directory
cd /path/to/spar

# Install dependencies (if not already done)
npm install

# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) Seed with sample data
# This will create a few test animals in the database
npx prisma db seed
```

## What This Does

1. **Creates the database file** (`dev.db` for local, `/tmp/prod.db` for production)
2. **Creates all tables** defined in `prisma/schema.prisma`:
   - TNRRequest
   - Animal
   - AnimalImage
3. **Generates Prisma Client** for database queries

## After Setup

Once the database is set up:

1. The "database needs to be configured" message will disappear
2. You can add animals at `/admin/add-animal-simple`
3. Upload photos at `/admin/animals`
4. Animals will appear on the homepage and adoption page

## For Vercel Deployment

Vercel will automatically run `prisma generate` during build (configured in `package.json` postinstall script). However, you'll need to ensure:

1. Environment variable `DATABASE_URL="file:/tmp/prod.db"` is set in Vercel
2. All 6 Cloudflare R2 environment variables are set
3. After first deployment, the database will be empty - use `/admin/add-animal-simple` to add animals

## Troubleshooting

**Error: "Cannot find module '@prisma/client'"**
- Run: `npx prisma generate`

**Error: "No Prisma schema found"**
- Make sure you're in the project root directory

**Database is empty**
- Visit `/admin/add-animal-simple` to add sample animals
- Or manually add animals through the API

## Quick Start (One Command)

If you have all prerequisites installed, run:
```bash
npx prisma migrate dev --name init && npx prisma generate
```

Then visit `http://localhost:3000/admin/add-animal-simple` to add test animals.
