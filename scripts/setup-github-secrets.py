#!/usr/bin/env python3
"""
Automated GitHub Secrets Setup Script
This script sets up all required GitHub secrets for the InnerAnimal Media project.
"""

import requests
import base64
import sys
import os
from typing import Dict, Optional

try:
    from nacl import encoding, public
except ImportError:
    print("❌ Error: PyNaCl library not found.")
    print("Install it with: pip install PyNaCl")
    sys.exit(1)

# Configuration
GITHUB_TOKEN = "your-github-pat-token-here"  # Replace with your actual GitHub PAT
OWNER = "InnerAnimal"
REPO = "spar"

# ANSI color codes for pretty output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


def encrypt_secret(public_key: str, secret_value: str) -> str:
    """Encrypt a secret using the repository's public key."""
    public_key_obj = public.PublicKey(public_key.encode("utf-8"), encoding.Base64Encoder())
    sealed_box = public.SealedBox(public_key_obj)
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")


def get_public_key() -> Optional[Dict[str, str]]:
    """Get the repository's public key for secret encryption."""
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    try:
        response = requests.get(
            f"https://api.github.com/repos/{OWNER}/{REPO}/actions/secrets/public-key",
            headers=headers
        )

        if response.status_code == 200:
            return response.json()
        else:
            print(f"{RED}❌ Error getting public key: {response.status_code}{RESET}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"{RED}❌ Exception getting public key: {e}{RESET}")
        return None


def set_github_secret(secret_name: str, secret_value: str, public_key_data: Dict[str, str]) -> bool:
    """Set a GitHub repository secret."""
    if not secret_value or secret_value.startswith("your-"):
        print(f"{YELLOW}⏭️  Skipping {secret_name} (placeholder value){RESET}")
        return True

    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    key_id = public_key_data["key_id"]
    public_key = public_key_data["key"]

    # Encrypt the secret
    encrypted_value = encrypt_secret(public_key, secret_value)

    # Set the secret
    data = {
        "encrypted_value": encrypted_value,
        "key_id": key_id
    }

    try:
        response = requests.put(
            f"https://api.github.com/repos/{OWNER}/{REPO}/actions/secrets/{secret_name}",
            headers=headers,
            json=data
        )

        if response.status_code in [201, 204]:
            print(f"{GREEN}✅ Successfully set secret: {secret_name}{RESET}")
            return True
        else:
            print(f"{RED}❌ Error setting secret {secret_name}: {response.status_code}{RESET}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"{RED}❌ Exception setting secret {secret_name}: {e}{RESET}")
        return False


def load_secrets_from_env() -> Dict[str, str]:
    """Load secrets from .env.local file if it exists."""
    secrets = {}
    env_file = ".env.local"

    if not os.path.exists(env_file):
        print(f"{YELLOW}ℹ️  No .env.local file found. You'll need to provide credentials manually.{RESET}")
        return secrets

    print(f"{BLUE}📄 Loading credentials from {env_file}...{RESET}")

    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                # Remove quotes if present
                value = value.strip('"').strip("'")
                secrets[key.strip()] = value

    return secrets


def prompt_for_secret(name: str, description: str, env_secrets: Dict[str, str]) -> str:
    """Prompt user for a secret value or use value from .env.local."""
    if name in env_secrets:
        value = env_secrets[name]
        print(f"{GREEN}✓{RESET} Using {name} from .env.local")
        return value

    print(f"\n{BLUE}🔑 {description}{RESET}")
    value = input(f"Enter {name} (or press Enter to skip): ").strip()
    return value


def main():
    print(f"{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}  GitHub Secrets Setup for InnerAnimal Media{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")

    # Get public key
    print(f"{BLUE}🔐 Fetching repository public key...{RESET}")
    public_key_data = get_public_key()

    if not public_key_data:
        print(f"\n{RED}❌ Failed to get public key. Please check your GitHub token permissions.{RESET}")
        sys.exit(1)

    print(f"{GREEN}✅ Public key retrieved successfully{RESET}\n")

    # Load existing secrets from .env.local if available
    env_secrets = load_secrets_from_env()

    # Define all secrets to set up
    secrets_config = [
        # Supabase
        ("NEXT_PUBLIC_SUPABASE_URL", "Supabase project URL (from Supabase Dashboard > Settings > API)"),
        ("NEXT_PUBLIC_SUPABASE_ANON_KEY", "Supabase anonymous key (public, safe to expose)"),
        ("SUPABASE_SERVICE_ROLE_KEY", "Supabase service role key (PRIVATE, admin access)"),

        # Stripe
        ("STRIPE_SECRET_KEY", "Stripe secret key (from Stripe Dashboard > Developers > API keys)"),
        ("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "Stripe publishable key (public, safe to expose)"),
        ("STRIPE_WEBHOOK_SECRET", "Stripe webhook signing secret (from Stripe Dashboard > Webhooks)"),

        # Cloudflare
        ("CLOUDFLARE_API_TOKEN", "Cloudflare API token for Pages deployment (see CLOUDFLARE_SETUP.md)"),
        ("CLOUDFLARE_ACCOUNT_ID", "Cloudflare account ID (visible in R2 dashboard URL)"),
        ("CLOUDFLARE_R2_ACCESS_KEY_ID", "R2 API access key ID (from R2 > Manage R2 API Tokens)"),
        ("CLOUDFLARE_R2_SECRET_ACCESS_KEY", "R2 API secret access key"),
        ("CLOUDFLARE_R2_BUCKET_NAME", "R2 bucket name (e.g., 'inneranimalmedia')"),
        ("CLOUDFLARE_R2_PUBLIC_URL", "R2 public URL or custom domain"),

        # Application
        ("NEXT_PUBLIC_APP_URL", "Your application URL (e.g., https://inneranimalmedia.com)"),

        # Optional: AI APIs
        ("OPENAI_API_KEY", "OpenAI API key (optional, for AI features)"),
        ("ANTHROPIC_API_KEY", "Anthropic API key (optional, for Claude AI)"),
        ("RESEND_API_KEY", "Resend API key (for email notifications)"),
    ]

    print(f"{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}  Collecting Credentials{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    print(f"{YELLOW}ℹ️  Press Enter to skip optional secrets{RESET}\n")

    secrets_to_set = {}

    for secret_name, description in secrets_config:
        value = prompt_for_secret(secret_name, description, env_secrets)
        if value:
            secrets_to_set[secret_name] = value

    # Confirmation
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}  Summary{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    print(f"Secrets to set: {len(secrets_to_set)}")
    for name in secrets_to_set.keys():
        print(f"  • {name}")

    print(f"\n{YELLOW}⚠️  This will upload these secrets to GitHub repository: {OWNER}/{REPO}{RESET}")
    confirm = input(f"\nProceed? (yes/no): ").strip().lower()

    if confirm not in ['yes', 'y']:
        print(f"\n{YELLOW}❌ Setup cancelled{RESET}")
        sys.exit(0)

    # Set secrets
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}  Setting GitHub Secrets{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")

    success_count = 0
    failure_count = 0

    for secret_name, secret_value in secrets_to_set.items():
        if set_github_secret(secret_name, secret_value, public_key_data):
            success_count += 1
        else:
            failure_count += 1

    # Final summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}  Results{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    print(f"{GREEN}✅ Successfully set: {success_count} secrets{RESET}")
    if failure_count > 0:
        print(f"{RED}❌ Failed to set: {failure_count} secrets{RESET}")

    print(f"\n{GREEN}🎉 GitHub secrets setup complete!{RESET}")
    print(f"\n{BLUE}Next steps:{RESET}")
    print(f"  1. Verify secrets at: https://github.com/{OWNER}/{REPO}/settings/secrets/actions")
    print(f"  2. Follow CLOUDFLARE_SETUP.md to get Cloudflare R2 credentials (if not done)")
    print(f"  3. Test the deployment workflow")
    print(f"  4. Deploy your application!\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}❌ Setup cancelled by user{RESET}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{RED}❌ Unexpected error: {e}{RESET}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
