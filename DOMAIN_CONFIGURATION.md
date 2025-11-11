# Custom Domain Configuration - InnerAnimalMedia

## Domain Status

**Domain:** `inneranimalmedia.com`
**Status:** Configured in Vercel account

## Next Steps

### 1. Assign Domain to Project (Vercel Dashboard)

Go to: https://vercel.com/meauxbilityorg/inneranimalmedia/settings/domains

1. Click **"Add Domain"**
2. Enter: `inneranimalmedia.com`
3. Click **"Add"**

### 2. Configure DNS Records

Since your domain shows "Third Party" registrar, you need to configure DNS at your domain registrar:

**Option A: Use Vercel's Nameservers (Recommended)**

1. In Vercel dashboard, go to your domain settings
2. Copy the nameservers provided
3. Update your domain registrar's nameservers to use Vercel's

**Option B: Use A/CNAME Records**

If you prefer to keep current nameservers, add these DNS records:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 3. Environment Variables Updated ✅

- `NEXT_PUBLIC_APP_URL` = `https://inneranimalmedia.com`

### 4. Update Supabase Redirect URLs

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/sexdnwlyuhkyvseunqlx
2. Navigate to **Authentication** → **URL Configuration**
3. Update:
   - **Site URL:** `https://inneranimalmedia.com`
   - **Redirect URLs:** Add:
     - `https://inneranimalmedia.com/**`
     - `https://www.inneranimalmedia.com/**`
     - `https://inneranimalmedia.com/auth/callback`

### 5. Verify DNS Configuration

After adding DNS records, verify propagation:

```bash
# Check DNS records
dig inneranimalmedia.com
dig www.inneranimalmedia.com

# Expected: Should point to Vercel IPs
```

### 6. SSL Certificate

Vercel will automatically provision SSL certificate via Let's Encrypt. This happens automatically after DNS propagation (usually 24-48 hours).

### 7. Test the Domain

Once DNS propagates:
- Visit: `https://inneranimalmedia.com`
- Visit: `https://www.inneranimalmedia.com`
- Both should redirect to HTTPS and show your site

## Current Status

✅ Domain added to Vercel account  
✅ Environment variable updated  
⏳ Domain needs to be assigned to project (Vercel dashboard)  
⏳ DNS records need configuration  
⏳ Supabase redirect URLs need update  

## Troubleshooting

If domain doesn't work after 24-48 hours:

1. Check DNS propagation: https://dnschecker.org
2. Verify DNS records are correct
3. Check Vercel dashboard for domain status
4. Ensure SSL certificate is issued (check Vercel dashboard)

## Quick Commands

```bash
# Check domain status
cd /Users/samprimeaux/Desktop/inneranimalmedia
source ~/.env.inneranimal
vercel domains ls --token "$VERCEL_TOKEN" --scope meauxbilityorg

# Redeploy after domain changes
vercel --prod
```

---

**Last Updated:** $(date)
**Platform:** InnerAnimalMedia
**Domain:** inneranimalmedia.com

