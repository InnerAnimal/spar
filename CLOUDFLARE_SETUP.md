# Cloudflare R2 Setup Guide

This guide will walk you through setting up Cloudflare R2 storage for your InnerAnimal Media application.

## Prerequisites

- A Cloudflare account ([Sign up here](https://dash.cloudflare.com/sign-up))
- Access to your Cloudflare dashboard
- Your application deployed (Vercel, Cloudflare Pages, or other platform)

## What is Cloudflare R2?

Cloudflare R2 is an S3-compatible object storage service with zero egress fees. This application uses R2 for:
- User file uploads (documents, images, media files)
- Signed URL generation for secure downloads
- Public URL access for shared content
- Automatic file organization by user

## Step 1: Create an R2 Bucket

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** in the left sidebar
3. Click **Create bucket**
4. Enter a bucket name (suggested: `inneranimalmedia` or `inneranimalmedia-production`)
5. Click **Create bucket**

## Step 2: Generate R2 API Tokens

1. In the R2 section, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Configure the token:
   - **Token name**: `inneranimalmedia-api-token`
   - **Permissions**:
     - ✅ Object Read & Write
     - ✅ Admin Read & Write (if you need bucket management)
   - **TTL**: Leave as "Forever" or set an expiration
   - **Bucket restrictions**: Select your specific bucket for better security
4. Click **Create API Token**
5. **IMPORTANT**: Copy the following values immediately (you won't see them again):
   - Access Key ID
   - Secret Access Key
   - Account ID (also visible in the R2 dashboard URL)

## Step 3: Configure Public Access (Optional)

If you want files to be publicly accessible:

1. Go to your bucket settings
2. Click **Settings** tab
3. Under **Public access**, configure:
   - Enable **Public bucket** if you want all files public
   - Or set up **Custom domains** for better control
4. Note the public URL format: `https://[bucket-name].[account-id].r2.cloudflarestorage.com`

### Setting up a Custom Domain (Recommended)

For production, use a custom domain for R2:

1. In your bucket settings, go to **Settings** > **Custom Domains**
2. Click **Connect Domain**
3. Enter your domain (e.g., `cdn.inneranimalmedia.com`)
4. Follow the DNS setup instructions
5. Once verified, use this domain as your `CLOUDFLARE_R2_PUBLIC_URL`

## Step 4: Add Environment Variables

### For Local Development

Create or update `.env.local` in your project root:

```bash
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id-here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key-here
CLOUDFLARE_R2_BUCKET_NAME=inneranimalmedia
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.your-account.r2.cloudflarestorage.com
```

### For Vercel Deployment

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `CLOUDFLARE_R2_ACCOUNT_ID` | Your Cloudflare account ID | Production, Preview, Development |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | Your R2 access key ID | Production, Preview, Development |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | Your R2 secret access key | Production, Preview, Development |
| `CLOUDFLARE_R2_BUCKET_NAME` | `inneranimalmedia` | Production, Preview, Development |
| `CLOUDFLARE_R2_PUBLIC_URL` | Your R2 public URL or custom domain | Production, Preview, Development |

5. Click **Save**
6. Redeploy your application to apply the changes

### For Cloudflare Pages Deployment

If deploying to Cloudflare Pages:

1. Go to your Cloudflare Dashboard
2. Navigate to **Pages** > Your project
3. Go to **Settings** > **Environment variables**
4. Add the same environment variables as above
5. Redeploy your application

## Step 5: Test the Integration

### Test File Upload

1. Log in to your application
2. Navigate to a page with file upload functionality
3. Try uploading a test file
4. Check your R2 bucket to verify the file appears

### Test via API

You can also test using the upload API endpoint:

```bash
# Get your auth token first (log in to your app and check browser DevTools)
curl -X POST https://your-app-url.com/api/r2/upload \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -F "file=@test-file.jpg"
```

## Step 6: Verify File Organization

Files are automatically organized in R2 with this structure:

```
uploads/
  └── [user-id]/
      └── [timestamp]-[original-filename]
```

Example: `uploads/user-123/1699564800000-profile-photo.jpg`

## Troubleshooting

### Issue: "Missing R2 credentials" error

**Solution**: Verify all environment variables are set correctly:
```bash
# Check in your terminal (local dev)
echo $CLOUDFLARE_R2_ACCOUNT_ID
echo $CLOUDFLARE_R2_ACCESS_KEY_ID
echo $CLOUDFLARE_R2_SECRET_ACCESS_KEY
```

For Vercel, check that variables are set in the dashboard and redeploy.

### Issue: "Access Denied" when uploading

**Possible causes**:
1. API token doesn't have write permissions
2. Bucket restrictions prevent access
3. Wrong bucket name in environment variables

**Solution**:
- Verify API token permissions in Cloudflare Dashboard
- Ensure `CLOUDFLARE_R2_BUCKET_NAME` matches your actual bucket name
- Check bucket CORS settings if uploading from browser

### Issue: Files upload but aren't accessible

**Solution**:
- Enable public access on your bucket (Step 3)
- Or use signed URLs (automatically handled by the app)
- Verify `CLOUDFLARE_R2_PUBLIC_URL` is correct

### Issue: Rate limiting or slow uploads

**Solution**:
- R2 has generous rate limits, but check your account limits
- Consider implementing client-side chunking for large files
- Use presigned URLs for direct browser-to-R2 uploads (already implemented)

## Security Best Practices

1. **Never commit credentials**: Keep `.env.local` in `.gitignore`
2. **Use bucket restrictions**: Limit API tokens to specific buckets
3. **Set expiration**: Consider setting TTL on API tokens
4. **Monitor usage**: Set up alerts in Cloudflare for unusual activity
5. **Implement file validation**: The app already validates file sizes (10MB limit)
6. **Use signed URLs**: For private files, use time-limited signed URLs (already implemented)

## API Reference

The application provides these R2 operations:

### Upload File
```typescript
// POST /api/r2/upload
// Requires authentication
// Max file size: 10MB
// Returns: { url: string, key: string }
```

### Generate Signed URL (Server-side)
```typescript
import { r2 } from '@/lib/r2'

// For uploads
const uploadUrl = await r2.getSignedUploadUrl(key, expiresIn)

// For downloads
const downloadUrl = await r2.getSignedDownloadUrl(key, expiresIn)
```

### Delete File (Server-side)
```typescript
import { r2 } from '@/lib/r2'
await r2.deleteFile(key)
```

## Monitoring and Analytics

To monitor R2 usage:

1. Go to **Cloudflare Dashboard** > **R2**
2. Select your bucket
3. View:
   - Storage usage
   - Request counts
   - Bandwidth (egress is free!)
   - Operation analytics

## Cost Considerations

Cloudflare R2 pricing (as of 2024):
- **Storage**: $0.015 per GB/month
- **Class A operations** (writes): $4.50 per million requests
- **Class B operations** (reads): $0.36 per million requests
- **Egress**: **FREE** (unlike AWS S3)

For most applications, R2 costs are minimal. A typical app with 1000 users might cost $1-5/month.

## Next Steps

- [ ] Set up custom domain for R2 (recommended for production)
- [ ] Configure CORS if needed for browser uploads
- [ ] Set up lifecycle rules for old file cleanup
- [ ] Implement file type restrictions based on your needs
- [ ] Consider adding virus scanning for user uploads
- [ ] Set up monitoring alerts for storage usage

## Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 API Reference](https://developers.cloudflare.com/r2/api/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [AWS S3 Compatibility](https://developers.cloudflare.com/r2/s3-compatibility/)

## Need Help?

- Check the application logs in Vercel/Cloudflare Pages
- Review the R2 client code in `src/lib/r2.ts`
- Check the upload API endpoint in `src/app/api/r2/upload/route.ts`
- Consult Cloudflare support or community forums
