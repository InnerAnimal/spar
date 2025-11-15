# GitHub Secrets Setup Guide

This guide explains how to configure GitHub Secrets for automated deployments to Cloudflare Pages.

## What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that you can use in GitHub Actions workflows. They keep sensitive information like API keys and tokens secure.

## Prerequisites

- A GitHub Personal Access Token (PAT) with appropriate permissions
- Repository admin access to configure secrets
- Cloudflare account with R2 and Pages set up

## Method 1: Using GitHub Web Interface (Recommended)

### Step 1: Navigate to Repository Settings

1. Go to your repository: `https://github.com/InnerAnimal/spar`
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** > **Actions**

### Step 2: Add Repository Secrets

Click **New repository secret** for each of the following:

#### Required Secrets

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard > Settings > API |
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard > Developers > API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard > Developers > API keys |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `https://inneranimalmedia.com` |

#### Cloudflare Secrets

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token for Pages deployment | Cloudflare Dashboard > My Profile > API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Cloudflare Dashboard > R2 (in URL) |
| `CLOUDFLARE_R2_ACCOUNT_ID` | Same as above (alternative name) | Same as above |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 API access key ID | Cloudflare Dashboard > R2 > Manage R2 API Tokens |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | R2 API secret key | Same as above |
| `CLOUDFLARE_R2_BUCKET_NAME` | Your R2 bucket name | `inneranimalmedia` |
| `CLOUDFLARE_R2_PUBLIC_URL` | Public URL for R2 bucket | Your R2 bucket public URL |

#### Optional Secrets

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `OPENAI_API_KEY` | OpenAI API key (if using AI features) | OpenAI Platform > API keys |
| `ANTHROPIC_API_KEY` | Anthropic API key (if using Claude) | Anthropic Console > API keys |
| `RESEND_API_KEY` | Resend API key for emails | Resend Dashboard > API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe Dashboard > Webhooks |

### Step 3: Verify Secrets

After adding all secrets:
1. Go back to **Secrets and variables** > **Actions**
2. Verify all required secrets are listed
3. Secrets are encrypted and won't show their values (this is normal)

## Method 2: Using GitHub CLI (Advanced)

If you have the GitHub CLI installed and authenticated:

```bash
# Set Supabase secrets
gh secret set NEXT_PUBLIC_SUPABASE_URL -b "your-supabase-url"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY -b "your-anon-key"
gh secret set SUPABASE_SERVICE_ROLE_KEY -b "your-service-role-key"

# Set Stripe secrets
gh secret set STRIPE_SECRET_KEY -b "your-stripe-secret-key"
gh secret set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY -b "your-stripe-publishable-key"
gh secret set STRIPE_WEBHOOK_SECRET -b "your-webhook-secret"

# Set Cloudflare secrets
gh secret set CLOUDFLARE_API_TOKEN -b "your-cloudflare-api-token"
gh secret set CLOUDFLARE_ACCOUNT_ID -b "your-account-id"
gh secret set CLOUDFLARE_R2_ACCESS_KEY_ID -b "your-r2-access-key-id"
gh secret set CLOUDFLARE_R2_SECRET_ACCESS_KEY -b "your-r2-secret-key"
gh secret set CLOUDFLARE_R2_BUCKET_NAME -b "inneranimalmedia"
gh secret set CLOUDFLARE_R2_PUBLIC_URL -b "your-r2-public-url"

# Set app configuration
gh secret set NEXT_PUBLIC_APP_URL -b "https://inneranimalmedia.com"

# Optional: Set AI API keys
gh secret set OPENAI_API_KEY -b "your-openai-key"
gh secret set ANTHROPIC_API_KEY -b "your-anthropic-key"
gh secret set RESEND_API_KEY -b "your-resend-key"
```

## Method 3: Using GitHub REST API with Personal Access Token

If you have a GitHub Personal Access Token (PAT), you can use the GitHub API to set secrets programmatically.

### Prerequisites

You need a GitHub PAT with these scopes:
- `repo` (full control of private repositories)
- `workflow` (update GitHub Action workflows)

### Using the API

```bash
# Your GitHub PAT
GITHUB_TOKEN="your-github-pat-token-here"

# Repository details
OWNER="InnerAnimal"
REPO="spar"

# Function to encrypt and set a secret
set_github_secret() {
  SECRET_NAME=$1
  SECRET_VALUE=$2

  # Get the repository public key
  PUBLIC_KEY=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$OWNER/$REPO/actions/secrets/public-key")

  KEY_ID=$(echo $PUBLIC_KEY | jq -r '.key_id')
  KEY=$(echo $PUBLIC_KEY | jq -r '.key')

  # Encrypt the secret (requires libsodium)
  # This is a simplified example - you'll need proper encryption
  ENCRYPTED_VALUE=$(echo -n "$SECRET_VALUE" | base64)

  # Set the secret
  curl -X PUT \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$OWNER/$REPO/actions/secrets/$SECRET_NAME" \
    -d "{\"encrypted_value\":\"$ENCRYPTED_VALUE\",\"key_id\":\"$KEY_ID\"}"
}

# Example usage
# set_github_secret "CLOUDFLARE_API_TOKEN" "your-token-value"
```

**Note**: The above script is simplified. For production use, you should:
1. Use proper encryption with `libsodium` or the `@actions/core` package
2. Never log or expose secret values
3. Use secure methods to input secret values (not command line arguments)

### Python Script for Setting Secrets

Here's a more complete Python script:

```python
#!/usr/bin/env python3
import requests
import base64
from nacl import encoding, public

GITHUB_TOKEN = "your-github-pat-token-here"
OWNER = "InnerAnimal"
REPO = "spar"

def encrypt_secret(public_key: str, secret_value: str) -> str:
    """Encrypt a secret using the repository's public key."""
    public_key_obj = public.PublicKey(public_key.encode("utf-8"), encoding.Base64Encoder())
    sealed_box = public.SealedBox(public_key_obj)
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")

def set_github_secret(secret_name: str, secret_value: str):
    """Set a GitHub repository secret."""
    # Get the public key
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    response = requests.get(
        f"https://api.github.com/repos/{OWNER}/{REPO}/actions/secrets/public-key",
        headers=headers
    )

    if response.status_code != 200:
        print(f"Error getting public key: {response.status_code}")
        return False

    public_key_data = response.json()
    key_id = public_key_data["key_id"]
    public_key = public_key_data["key"]

    # Encrypt the secret
    encrypted_value = encrypt_secret(public_key, secret_value)

    # Set the secret
    data = {
        "encrypted_value": encrypted_value,
        "key_id": key_id
    }

    response = requests.put(
        f"https://api.github.com/repos/{OWNER}/{REPO}/actions/secrets/{secret_name}",
        headers=headers,
        json=data
    )

    if response.status_code in [201, 204]:
        print(f"✅ Successfully set secret: {secret_name}")
        return True
    else:
        print(f"❌ Error setting secret {secret_name}: {response.status_code}")
        return False

# Example usage
if __name__ == "__main__":
    secrets_to_set = {
        "CLOUDFLARE_API_TOKEN": "your-cloudflare-api-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id",
        # Add more secrets here
    }

    for name, value in secrets_to_set.items():
        set_github_secret(name, value)
```

**To use this script:**
1. Install dependencies: `pip install requests PyNaCl`
2. Update the `secrets_to_set` dictionary with your actual values
3. Run: `python3 set_github_secrets.py`

## Creating a Cloudflare API Token

For the `CLOUDFLARE_API_TOKEN` secret:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click on your profile icon > **My Profile**
3. Go to **API Tokens** tab
4. Click **Create Token**
5. Use the **Edit Cloudflare Workers** template or create custom token
6. Required permissions:
   - **Account** > **Cloudflare Pages** > **Edit**
   - **Account** > **Account Settings** > **Read**
7. Click **Continue to summary** > **Create Token**
8. **Copy the token immediately** (you won't see it again)

## Verifying GitHub Actions Workflow

After setting up secrets:

1. Go to your repository's **Actions** tab
2. Find the "Deploy to Cloudflare Pages" workflow
3. Click **Run workflow** to test manually
4. Monitor the workflow execution
5. Check for any errors related to missing secrets

## Security Best Practices

1. **Never commit secrets**: Keep `.env.local` and `.env` files in `.gitignore`
2. **Rotate tokens regularly**: Update API tokens periodically
3. **Use minimal permissions**: Grant only necessary permissions to tokens
4. **Monitor access logs**: Check Cloudflare and GitHub audit logs
5. **Use environment-specific secrets**: Consider separate secrets for staging/production

## Troubleshooting

### Issue: "Secret not found" error in workflow

**Solution**:
- Verify the secret name matches exactly (case-sensitive)
- Check that the secret is set at the repository level (not organization)
- Ensure the workflow file uses correct secret names: `${{ secrets.SECRET_NAME }}`

### Issue: Unable to set secrets via API

**Possible causes**:
- PAT doesn't have `repo` and `workflow` scopes
- Repository is not accessible with the PAT
- Encryption is not working properly

**Solution**:
- Generate a new PAT with correct scopes
- Verify repository access
- Use the Python script with proper encryption library

### Issue: Cloudflare API token not working

**Solution**:
- Regenerate the token with correct permissions
- Ensure token has **Cloudflare Pages Edit** permission
- Check token hasn't expired

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub REST API - Secrets](https://docs.github.com/en/rest/actions/secrets)
- [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [Cloudflare Pages Deployment](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)

## Next Steps

- [ ] Set all required secrets in GitHub repository
- [ ] Create Cloudflare API token with Pages permissions
- [ ] Test the GitHub Actions workflow
- [ ] Monitor first deployment to Cloudflare Pages
- [ ] Set up branch-specific deployments (staging/production)
