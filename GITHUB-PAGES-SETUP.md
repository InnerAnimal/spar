# 🚀 GitHub Pages Setup - SPAR Website

## ✅ What's Done

1. **Next.js Config Updated** - Configured for GitHub Pages static export
2. **Pages Updated** - Home, Adopt, Services pages now use popup modals
3. **Supabase Connected** - Forms save directly to Supabase database
4. **Build Working** - Static export builds successfully

---

## 📋 Environment Variables Needed

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gznbdelanixvawvratef.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bmJkZWxhbml4dmF3dnJhdGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMjQzNzAsImV4cCI6MjA3NzgwMDM3MH0.gJysVL7cRzAVDW92qyY4n0OskSwUSO7JutbkRdPIM_k
RESEND_API_KEY=re_RNAtprcL_NGdUYU23YVfyNmfs657GqV6k
```

**Note:** For GitHub Pages, these need to be set as build-time environment variables in GitHub Actions or your deployment process.

---

## ⚠️ Important Notes

### API Routes Disabled for GitHub Pages

**GitHub Pages is static-only**, so API routes don't work. Here's what happens:

✅ **Works:**
- Form submissions → Saved to Supabase database
- All pages render correctly
- Popup modals work

❌ **Doesn't Work (until Vercel):**
- Email notifications (`/api/send-tnr-notification`)
- Analytics webhooks (`/api/webhook/analytics`)

**Solution:** Forms still save to Supabase! Customer can check Supabase dashboard for submissions. Email notifications will work when you deploy to Vercel.

---

## 🚀 Deployment Steps

### 1. Build Locally
```bash
cd /Users/samprimeaux/Desktop/spar
npm run build
```

### 2. Deploy to GitHub Pages

**Option A: Manual**
```bash
# Build creates 'out' folder
npm run build
# Copy 'out' folder contents to gh-pages branch
```

**Option B: GitHub Actions** (Recommended)
- Create `.github/workflows/deploy.yml`
- Auto-deploys on push to main

### 3. Test URL
After deployment: `https://inneranimal.github.io/spar/`

---

## 📧 Form Submissions

**Where to find submissions:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/gznbdelanixvawvratef
2. Navigate to `tnr_requests` table
3. View all submissions there

**Email notifications:** Will work automatically when deployed to Vercel (API routes enabled).

---

## ✅ Ready for Testing

Your customer can test:
- ✅ Homepage: https://inneranimal.github.io/spar/
- ✅ Adopt Page: https://inneranimal.github.io/spar/adopt/
- ✅ Services Page: https://inneranimal.github.io/spar/services/
- ✅ TNR Form: Click "Request TNR Service" button → Popup modal opens
- ✅ Form Submission: Saves to Supabase (check dashboard)

---

## 🔄 Next Steps (For Full Functionality)

1. **Deploy to Vercel** - Enables API routes for email notifications
2. **Add environment variables** in Vercel dashboard
3. **Test email delivery** - Forms will send emails automatically

---

**Status: Ready for GitHub Pages deployment!** 🎉

