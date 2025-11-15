# Setup Scripts Documentation

This directory contains automated setup scripts for configuring Cloudflare R2 and deploying the InnerAnimal Media application.

## Quick Start

### One-Command Setup (Recommended)

Run the complete automated setup:

```bash
chmod +x scripts/*.sh
bash scripts/setup-all.sh
```

This will guide you through:
1. Creating Cloudflare R2 bucket
2. Generating R2 API tokens
3. Configuring local environment
4. Setting up GitHub secrets for CI/CD

## Individual Scripts

### 1. `setup-all.sh` - Complete Automated Setup

**Purpose**: Runs all setup steps in sequence with interactive prompts.

**Usage**:
```bash
bash scripts/setup-all.sh
```

**What it does**:
- Guides through Cloudflare R2 setup
- Creates `.env.local` with credentials
- Prompts for additional service credentials
- Installs Python dependencies
- Sets up GitHub secrets

**When to use**: First-time setup or complete reconfiguration

---

### 2. `cloudflare-interactive-setup.sh` - Cloudflare R2 Setup

**Purpose**: Interactive guide for setting up Cloudflare R2 storage.

**Usage**:
```bash
bash scripts/cloudflare-interactive-setup.sh
```

**What it does**:
- Opens relevant Cloudflare dashboard pages
- Guides through bucket creation
- Collects R2 API credentials
- Configures public access/custom domain
- Creates `.env.local` with R2 configuration

**When to use**:
- First-time Cloudflare R2 setup
- Adding R2 to existing project
- Regenerating R2 credentials

**Prerequisites**:
- Cloudflare account (free tier works)
- Web browser to access Cloudflare dashboard

**Output**:
- `.env.local` file with R2 credentials

---

### 3. `setup-github-secrets.py` - GitHub Secrets Automation

**Purpose**: Programmatically sets GitHub repository secrets for CI/CD.

**Usage**:
```bash
# Install dependencies first
pip install PyNaCl requests

# Run the script
python3 scripts/setup-github-secrets.py
```

**What it does**:
- Reads credentials from `.env.local` (if exists)
- Prompts for missing credentials
- Encrypts secrets using GitHub's public key
- Uploads secrets to GitHub repository
- Provides summary of success/failures

**When to use**:
- After completing `.env.local` configuration
- Updating GitHub secrets in bulk
- Automating secrets deployment

**Prerequisites**:
- Python 3.7+
- `PyNaCl` library (`pip install PyNaCl`)
- `requests` library (`pip install requests`)
- Valid GitHub Personal Access Token (PAT) with `repo` and `workflow` scopes
- Completed `.env.local` file (or manual credential entry)

**Required GitHub Secrets** (automatically set):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET_NAME`
- `CLOUDFLARE_R2_PUBLIC_URL`
- `NEXT_PUBLIC_APP_URL`

**Optional GitHub Secrets**:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`

**Output**:
- Secrets uploaded to GitHub repository
- Summary of successful/failed uploads

---

## Prerequisites

### All Scripts

- **Operating System**: Linux, macOS, or WSL on Windows
- **Bash**: Version 4.0+ (usually pre-installed)

### Python Scripts

- **Python**: 3.7 or higher
- **Libraries**:
  ```bash
  pip install PyNaCl requests
  ```

### Required Accounts

1. **Cloudflare Account** (free tier works)
   - Sign up: https://dash.cloudflare.com/sign-up

2. **GitHub Account** with repository access
   - Personal Access Token with scopes:
     - `repo` (full control of private repositories)
     - `workflow` (update GitHub Action workflows)

3. **Other Service Accounts** (for complete setup):
   - Supabase (database & auth)
   - Stripe (payments)
   - Optional: OpenAI, Anthropic, Resend

## Setup Workflows

### Workflow 1: First-Time Project Setup

```bash
# 1. Clone repository
git clone https://github.com/InnerAnimal/spar.git
cd spar

# 2. Run complete setup
chmod +x scripts/*.sh
bash scripts/setup-all.sh

# 3. Install npm dependencies
npm install

# 4. Test locally
npm run dev

# 5. Deploy
git push origin main
```

### Workflow 2: Adding Cloudflare to Existing Project

```bash
# 1. Set up R2 only
bash scripts/cloudflare-interactive-setup.sh

# 2. Complete .env.local with other credentials
nano .env.local  # or your preferred editor

# 3. Set up GitHub secrets
python3 scripts/setup-github-secrets.py

# 4. Test and deploy
npm run dev
```

### Workflow 3: Updating GitHub Secrets Only

```bash
# 1. Update .env.local with new values
nano .env.local

# 2. Push updated secrets to GitHub
python3 scripts/setup-github-secrets.py
```

## Script Architecture

```
scripts/
├── README.md                          # This file
├── setup-all.sh                       # Master orchestration script
├── cloudflare-interactive-setup.sh    # Cloudflare R2 setup wizard
└── setup-github-secrets.py            # GitHub secrets automation
```

### Data Flow

```
User Input
    ↓
cloudflare-interactive-setup.sh
    ↓
.env.local (created with R2 credentials)
    ↓
User completes other credentials
    ↓
setup-github-secrets.py (reads .env.local)
    ↓
GitHub Secrets (encrypted and uploaded)
    ↓
GitHub Actions (deployment workflows)
```

## Troubleshooting

### Issue: Permission Denied

**Error**: `bash: ./script.sh: Permission denied`

**Solution**:
```bash
chmod +x scripts/*.sh
bash scripts/setup-all.sh
```

### Issue: Python Dependencies Not Found

**Error**: `ModuleNotFoundError: No module named 'nacl'`

**Solution**:
```bash
pip install PyNaCl requests
# Or
pip3 install PyNaCl requests
```

### Issue: GitHub API Authentication Failed

**Error**: `401 Unauthorized` or `403 Forbidden`

**Solutions**:
1. Verify GitHub PAT has correct scopes (`repo`, `workflow`)
2. Check PAT hasn't expired
3. Generate new PAT: https://github.com/settings/tokens/new

### Issue: Cloudflare R2 Access Denied

**Error**: File uploads fail with `403 Forbidden`

**Solutions**:
1. Verify R2 API token has "Object Read & Write" permissions
2. Check bucket name matches in `.env.local`
3. Regenerate R2 API token if needed

### Issue: .env.local Not Created

**Cause**: Script was interrupted or cancelled

**Solution**:
```bash
# Copy example and fill manually
cp .env.example .env.local
nano .env.local  # Fill in your credentials
```

### Issue: GitHub Secrets Upload Fails for Some Secrets

**Cause**: Network issues or invalid values

**Solution**:
- Check specific error messages in script output
- Verify secret values don't contain invalid characters
- Re-run script (it will skip successfully uploaded secrets)

## Security Notes

### ⚠️ Important Security Practices

1. **Never commit `.env.local`**: Already in `.gitignore`, but double-check
2. **Protect your GitHub PAT**: Don't share or commit it
3. **Use least privilege**: Grant minimum necessary permissions to API tokens
4. **Rotate credentials**: Periodically regenerate API tokens
5. **Monitor access**: Check Cloudflare and GitHub audit logs

### Secure Credential Storage

The scripts follow these security practices:

- ✅ Secrets are encrypted before uploading to GitHub
- ✅ `.env.local` is automatically ignored by git
- ✅ Scripts never log sensitive values
- ✅ API tokens use minimal required permissions
- ✅ User confirmation required before uploading secrets

## Advanced Usage

### Running in CI/CD

The setup scripts can be automated in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Setup Cloudflare
  env:
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    CLOUDFLARE_R2_ACCESS_KEY_ID: ${{ secrets.CLOUDFLARE_R2_ACCESS_KEY_ID }}
  run: |
    # Scripts already configured via GitHub secrets
    echo "Secrets loaded from GitHub"
```

### Non-Interactive Mode

For automation, you can pre-create `.env.local`:

```bash
# Create .env.local with all credentials
cat > .env.local << 'EOF'
CLOUDFLARE_R2_ACCOUNT_ID=abc123
CLOUDFLARE_R2_ACCESS_KEY_ID=xyz789
# ... etc
EOF

# Run GitHub secrets setup (reads from .env.local)
python3 scripts/setup-github-secrets.py
```

### Using Environment Variables

Instead of `.env.local`, export variables:

```bash
export CLOUDFLARE_R2_ACCOUNT_ID="abc123"
export CLOUDFLARE_R2_ACCESS_KEY_ID="xyz789"
# ... etc

python3 scripts/setup-github-secrets.py
```

## Support

For issues or questions:

1. Check the main documentation:
   - `CLOUDFLARE_SETUP.md` - Detailed R2 setup guide
   - `GITHUB_SECRETS_SETUP.md` - Secrets configuration guide

2. Review logs from script output for specific errors

3. Check GitHub repository issues: https://github.com/InnerAnimal/spar/issues

## Contributing

To improve these scripts:

1. Test changes thoroughly
2. Update this README if adding new scripts
3. Follow existing code style and security practices
4. Add error handling for edge cases

## License

These scripts are part of the InnerAnimal Media project and follow the same license as the main repository.
