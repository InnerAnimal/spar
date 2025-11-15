# Animal Photo Upload System - Complete Guide

This guide explains how to upload and manage photos for animal adoption listings on the SPAR website.

## 🎯 What's Been Set Up

### For Your Business Partner (Photo Uploader)
- ✅ Admin dashboard for managing animals
- ✅ Drag-and-drop photo upload interface
- ✅ Support for multiple photos per animal (up to 10 images)
- ✅ Photo gallery with primary image selection
- ✅ Easy photo deletion and reordering

### For Website Visitors
- ✅ Beautiful photo galleries on adoption pages
- ✅ Image carousel to view all photos
- ✅ Automatic display of best photo first

## 🚀 Setup Steps (ONE TIME)

### Step 1: Get Cloudflare R2 Credentials

You need to set up Cloudflare R2 for photo storage. Run this command:

```bash
bash scripts/cloudflare-interactive-setup.sh
```

This will:
1. Open your Cloudflare dashboard
2. Guide you through creating an R2 bucket (name it `spar-animals`)
3. Help you generate API credentials
4. Save everything to `.env.local`

**What you'll need:**
- A Cloudflare account (sign up free at https://dash.cloudflare.com/sign-up)
- 10 minutes of time

### Step 2: Set Up the Database

Run these commands to create the database tables:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

This creates the tables for animals and their photos.

### Step 3: Start the Application

```bash
# Install dependencies (if not done already)
npm install

# Start development server
npm run dev
```

The site will be at: http://localhost:3000

---

## 📸 How to Upload Photos (For Your Partner)

### Access the Admin Panel

1. Go to: **http://localhost:3000/admin/animals**
2. You'll see a list of all animals

### Upload Photos for an Animal

#### Method 1: From Animal List
1. Find the animal in the list
2. Click the **"Photos"** button
3. You'll see the photo upload page

#### Method 2: Direct Link
Go to: **http://localhost:3000/admin/animals/[ANIMAL-ID]/photos**

### Using the Upload Interface

1. **Drag and Drop** photos onto the upload area
   - OR click to browse and select files
2. **Preview** appears showing your selected photos
3. Click **"Upload X Images"** button
4. Wait for upload to complete (you'll see a progress indicator)
5. Photos now appear in the "Current Photos" section

### Managing Uploaded Photos

#### Set Primary Photo
- Hover over any photo
- Click the **⭐ Star** button
- This photo will appear first in listings

#### Delete a Photo
- Hover over the photo
- Click the **🗑️ Trash** button
- Confirm deletion

#### Reorder Photos
Photos display in the order you upload them. The primary photo always shows first.

---

## 📝 Quick Workflow Example

**Scenario:** Add photos for "Blue" the dog

1. Navigate to `/admin/animals`
2. Find "Blue" in the list
3. Click "Photos" button
4. Drag 5 photos of Blue onto the upload area
5. Click "Upload 5 Images"
6. Wait for confirmation
7. Hover over the best photo and click ⭐ to make it primary
8. Done! Photos now appear on the adoption page

---

## 🖼️ Photo Guidelines

### Technical Requirements
- **Format**: JPG, PNG, or GIF
- **Max Size**: 10MB per image
- **Max Photos**: 10 per animal
- **Recommended Size**: 1200x1200px or larger

### Best Practices
✅ **DO:**
- Use clear, well-lit photos
- Show the animal's face
- Include full-body shots
- Capture the animal's personality
- Use high resolution images

❌ **DON'T:**
- Upload blurry or dark photos
- Use heavily filtered images
- Include too many similar photos
- Upload photos with watermarks

---

## 🌐 Where Photos Appear

### 1. Adoption Page (`/adopt`)
- **Photo Gallery**: Visitors can click through all photos
- **Primary Photo**: Shows first in carousel
- **Image Counter**: Shows "1 / 5" etc.
- **Navigation**: Arrow buttons to browse photos

### 2. Admin Dashboard (`/admin/animals`)
- **Thumbnail**: Shows primary photo
- **Photo Count**: Badge showing number of photos

### 3. Animal Details
- Photos load automatically from the database
- No manual updating needed

---

## 🔧 Troubleshooting

### "Upload Failed" Error

**Possible causes:**
1. Cloudflare R2 not set up
2. File too large (>10MB)
3. Wrong file format

**Solutions:**
- Run `bash scripts/cloudflare-interactive-setup.sh`
- Check file size (should be under 10MB)
- Ensure file is JPG, PNG, or GIF

### Photos Not Showing on Adoption Page

**Check:**
1. Is the animal status set to "available"?
2. Are photos actually uploaded? (Check admin photos page)
3. Is there a primary photo selected?

**Fix:**
- Set animal status to "available" in database
- Re-upload photos
- Click ⭐ on a photo to make it primary

### Can't Access Admin Pages

**Solution:**
Make sure you're accessing:
- `/admin/animals` (not `/animals`)
- Server is running (`npm run dev`)

### Slow Upload Speed

**Tips:**
- Upload 3-5 photos at a time instead of all 10
- Reduce image file sizes before uploading
- Use JPG format (smaller than PNG)

---

## 🎨 Customization Options

### Change Max Photos Per Animal
Edit `/src/app/(dashboard)/admin/animals/[id]/photos/page.tsx`:
```tsx
<ImageUpload
  maxFiles={10}  // Change this number
  ...
/>
```

### Change Max File Size
Edit `/src/app/api/animals/[id]/images/route.ts`:
```ts
const maxSize = 10 * 1024 * 1024  // Change from 10MB
```

### Change Allowed File Types
Edit upload component:
```tsx
<ImageUpload
  accept="image/*"  // Change to "image/jpeg,image/png"
  ...
/>
```

---

## 📊 System Architecture

```
Browser (Upload)
    ↓
Next.js API (/api/animals/:id/images)
    ↓
Cloudflare R2 Storage (Files stored)
    ↓
Database (Photo metadata saved)
    ↓
Adoption Page (Photos displayed)
```

### Database Tables

**`animals`** - Animal information
- id, name, type, breed, age, etc.
- imageUrl (legacy, auto-updated)

**`animal_images`** - Photo gallery
- id, animalId, url, filename
- isPrimary, order, caption
- Automatically deleted when animal is deleted

---

## 🔐 Security Features

- ✅ Files stored in Cloudflare R2 (not on server)
- ✅ File size validation (prevents huge uploads)
- ✅ File type validation (images only)
- ✅ Automatic cleanup when photos deleted
- ✅ Secure URLs with CloudFlare CDN

---

## 📞 Support

### Common Questions

**Q: How do I add a new animal?**
A: We'll build an "Add Animal" form next. For now, add via database or contact developer.

**Q: Can I upload videos?**
A: Not yet. Currently images only (JPG, PNG, GIF).

**Q: What happens to old imageUrl field?**
A: It's automatically updated when you set a primary photo. Keeps backward compatibility.

**Q: Can I bulk upload for multiple animals?**
A: Currently one animal at a time. Select animal first, then upload its photos.

**Q: How do I delete an animal?**
A: Use the API or database. Photos will be automatically deleted too.

---

## 🎯 Next Steps

After photos are working well, we can add:
- [ ] Add New Animal form
- [ ] Edit Animal details form
- [ ] Bulk photo upload
- [ ] Photo captions/descriptions
- [ ] Video support
- [ ] Photo cropping tool
- [ ] Animal status management
- [ ] Advanced search/filtering

---

## 📋 Checklist for Your Partner

Before uploading photos, ensure:
- [ ] Cloudflare R2 is set up (`.env.local` exists)
- [ ] Database is migrated (`npx prisma db push`)
- [ ] Server is running (`npm run dev`)
- [ ] You can access `/admin/animals`
- [ ] Animals exist in the database
- [ ] Photos are prepared (good quality, under 10MB)

---

## 💡 Tips for Best Results

1. **Upload in batches**: Upload 3-5 photos at a time for better performance
2. **Select primary immediately**: Right after upload, click ⭐ on the best photo
3. **Delete bad photos quickly**: Don't let poor quality photos accumulate
4. **Use descriptive filenames**: Helps you remember which photo is which
5. **Test on mobile**: Check how galleries look on phones

---

## 🚨 Important Notes

- **Don't commit `.env.local`**: This file contains secrets and is git-ignored
- **R2 costs money**: Cloudflare R2 is cheap but not free. Monitor usage.
- **Delete unused photos**: Don't keep photos for adopted animals unnecessarily
- **Backup important photos**: R2 is reliable but always have backups

---

## 🎉 You're Ready!

Your photo upload system is complete and ready to use. Your business partner can now:
1. Upload beautiful photos of rescue animals
2. Manage photo galleries easily
3. Showcase animals professionally on the adoption page

The system handles:
- Secure storage in Cloudflare R2
- Automatic image optimization
- Beautiful galleries for visitors
- Easy management interface

---

**Questions or issues?** Check the troubleshooting section or contact the developer.

Happy uploading! 🐕🐱📸
