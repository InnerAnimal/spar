# Quick Start Guide - Cloudflare Setup

This guide will help you quickly set up Cloudflare R2 and deploy your application using the automated scripts.

## Prerequisites

You have:
- ✅ A GitHub account and repository access
- ✅ A GitHub Personal Access Token (PAT)
- 🔜 A Cloudflare account (we'll help you create one if needed)

## Option 1: Complete Automated Setup (Recommended)

Run this single command to set up everything:

```bash
bash scripts/setup-all.sh
```

This will:
1. Guide you through creating a Cloudflare R2 bucket
2. Set up your local environment (`.env.local`)
3. Configure GitHub secrets for CI/CD
4. Prepare your project for deployment

**Time required**: ~10-15 minutes

---

## Option 2: Step-by-Step Setup

If you prefer more control, follow these steps:

### Step 1: Set Up Cloudflare R2 (5 minutes)

```bash
bash scripts/cloudflare-interactive-setup.sh
```

This script will:
- Open your Cloudflare dashboard automatically
- Guide you through bucket creation
- Help you generate R2 API credentials
- Create `.env.local` with your R2 configuration

**What you need:**
- A web browser
- A Cloudflare account (free tier is fine)

**Output:**
- `.env.local` file with R2 credentials

---

### Step 2: Complete Your Environment Configuration (2 minutes)

Edit `.env.local` and add credentials for other services:

```bash
nano .env.local  # or your preferred editor
```

Add:
- Supabase credentials (from Supabase Dashboard > Settings > API)
- Stripe keys (from Stripe Dashboard > Developers > API keys)
- Optional: AI API keys (OpenAI, Anthropic)

See `.env.example` for all available variables.

---

### Step 3: Set Up GitHub Secrets (3 minutes)

**IMPORTANT**: Before running this script, update it with your GitHub PAT:

1. Open `scripts/setup-github-secrets.py` in an editor
2. Replace line 21:
   ```python
   GITHUB_TOKEN = "your-github-pat-token-here"  # Replace with your actual GitHub PAT
   ```
   With your actual GitHub Personal Access Token.

3. Save the file (but **don't commit it**)

4. Install Python dependencies:
   ```bash
   pip install PyNaCl requests
   ```

5. Run the script:
   ```bash
   python3 scripts/setup-github-secrets.py
   ```

The script will:
- Read credentials from your `.env.local`
- Encrypt and upload them to GitHub as secrets
- Show you a summary of what was uploaded

**Output:**
- GitHub secrets configured at: `https://github.com/InnerAnimal/spar/settings/secrets/actions`

---

## After Setup

### Test Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` and test file uploads to verify R2 is working.

### Deploy to Production

**Option A: Vercel** (current setup)
```bash
# Push to trigger Vercel deployment
git push origin main
```

**Option B: Cloudflare Pages**
- GitHub Actions workflow is already configured
- Just push to `main` branch to trigger deployment
- View workflow at: `https://github.com/InnerAnimal/spar/actions`

---

## What Was Set Up

After running these scripts, you'll have:

### Local Development
- ✅ `.env.local` with all credentials
- ✅ Cloudflare R2 bucket created
- ✅ R2 API tokens generated
- ✅ Project ready to run locally

### Deployment
- ✅ GitHub secrets configured for CI/CD
- ✅ GitHub Actions workflow for Cloudflare Pages
- ✅ Automatic deployments on push to main
- ✅ Environment variables secured

### Documentation
- ✅ Complete setup guides
- ✅ Troubleshooting documentation
- ✅ Security best practices

---

## Verification Checklist

Run through this checklist to verify everything works:

### Local Environment
- [ ] `.env.local` file exists with R2 credentials
- [ ] `npm run dev` starts without errors
- [ ] Can access the app at `http://localhost:3000`
- [ ] File uploads work (test through your app UI)

### Cloudflare R2
- [ ] Bucket created in Cloudflare dashboard
- [ ] API tokens generated
- [ ] Files appear in R2 after upload
- [ ] Public access configured (if needed)

### GitHub Secrets
- [ ] Visit: `https://github.com/InnerAnimal/spar/settings/secrets/actions`
- [ ] Verify all required secrets are listed
- [ ] No errors in GitHub Actions workflows

### Deployment
- [ ] Push to main triggers deployment
- [ ] Check GitHub Actions: `https://github.com/InnerAnimal/spar/actions`
- [ ] Deployment succeeds without errors
- [ ] Production site is live

---

## Common Issues & Quick Fixes

### Issue: "PyNaCl not found"
**Fix:**
```bash
pip install PyNaCl requests
# or
pip3 install PyNaCl requests
```

### Issue: "Permission denied" on scripts
**Fix:**
```bash
chmod +x scripts/*.sh
bash scripts/setup-all.sh
```

### Issue: GitHub secrets upload fails
**Cause:** GitHub PAT not set or has wrong permissions

**Fix:**
1. Generate new PAT at: `https://github.com/settings/tokens/new`
2. Enable scopes: `repo` and `workflow`
3. Update `scripts/setup-github-secrets.py` with new token
4. Run script again

### Issue: R2 uploads fail
**Cause:** Wrong credentials or bucket name

**Fix:**
1. Verify credentials in Cloudflare dashboard
2. Check bucket name matches in `.env.local`
3. Regenerate R2 API token if needed
4. Run `bash scripts/cloudflare-interactive-setup.sh` again

---

## Next Steps

1. **Explore the documentation:**
   - [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) - Detailed R2 guide
   - [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) - Secrets configuration
   - [scripts/README.md](scripts/README.md) - Scripts documentation

2. **Customize your deployment:**
   - Set up custom domain for R2
   - Configure CORS settings
   - Set up lifecycle rules for old files
   - Add monitoring and alerts

3. **Start building:**
   - Your Cloudflare infrastructure is ready
   - Focus on your application features
   - File uploads are fully functional

---

## Support

If you encounter issues:

1. Check the detailed guides:
   - `CLOUDFLARE_SETUP.md` for R2-specific issues
   - `GITHUB_SECRETS_SETUP.md` for GitHub secrets issues
   - `scripts/README.md` for script troubleshooting

2. Review script output for specific error messages

3. Check GitHub repository issues: `https://github.com/InnerAnimal/spar/issues`

---

## Security Reminders

- ✅ `.env.local` is in `.gitignore` (never commit it)
- ✅ GitHub secrets are encrypted before upload
- ✅ Update `scripts/setup-github-secrets.py` with your PAT locally only
- ✅ Don't commit the updated script with your real PAT
- ⚠️ Keep your API tokens secure and rotate them periodically

---

## Congratulations! 🎉

You've successfully set up Cloudflare R2 for your InnerAnimal Media application!

Your infrastructure is now:
- 🚀 Ready for production
- 💰 Cost-optimized (zero egress fees)
- 🔒 Secure and encrypted
- 📦 Fully automated
- 📚 Well-documented

Happy coding!
