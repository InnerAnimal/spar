# Custom Domain Configuration - Action Required

## ✅ Automated Setup Complete

1. ✅ Project linked to Vercel
2. ✅ Environment variable `NEXT_PUBLIC_APP_URL` set to `https://inneranimalmedia.com`

## ⏳ Action Required: Assign Domain via Dashboard

The domain `inneranimalmedia.com` exists in your Vercel account but is assigned to another project. 

### Quick Steps:

1. **Open Vercel Dashboard:**
   https://vercel.com/meauxbilityorg/inneranimalmedia/settings/domains

2. **Add Domain:**
   - Click **"Add Domain"**
   - Enter: `inneranimalmedia.com`
   - If it says "already assigned", click **"Remove from other project"** then **"Add"**

3. **Verify DNS:**
   - Vercel will show DNS configuration instructions
   - Since your domain uses "Third Party" registrar, configure DNS at your domain provider:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

4. **Update Supabase:**
   - Go to: https://supabase.com/dashboard/project/sexdnwlyuhkyvseunqlx/auth/url-configuration
   - Set **Site URL:** `https://inneranimalmedia.com`
   - Add redirect URLs:
     - `https://inneranimalmedia.com/**`
     - `https://www.inneranimalmedia.com/**`

## Current Live Site

**Temporary URL (works now):**
```
https://inneranimalmedia-n7frb170z-meauxbilityorg.vercel.app
```

**After domain assignment:**
```
https://inneranimalmedia.com
https://www.inneranimalmedia.com
```

## Verification

After assigning the domain:
- Wait 24-48 hours for DNS propagation
- SSL certificate will be auto-provisioned
- Test at: `https://inneranimalmedia.com`

## Summary

✅ Environment variables configured  
✅ Project linked  
⏳ **Domain assignment needed** (Vercel dashboard)  
⏳ DNS configuration (if not already done)  
⏳ Supabase redirect URLs (after domain assignment)  

Once you assign the domain in the dashboard, everything else is ready!

