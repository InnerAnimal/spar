# 📸 How to Access the Animal Photo Upload Dashboard

## Quick Answer

**Go to:** `/admin/animals`

Or navigate through the dashboard menu.

---

## Step-by-Step Instructions

### 1. Log In as Admin

First, you need to be logged in with an admin account:
- Go to `/auth/login`
- Sign in with your admin credentials

### 2. Access the Admin Dashboard

Once logged in, you have **two ways** to access the photo upload:

#### **Option A: Sidebar Navigation** (Fastest)

1. Look at the left sidebar
2. Find the **"Manage Animals"** link (under the admin section)
3. Click it!

#### **Option B: Admin Dashboard**

1. Click **"Admin"** in the sidebar
2. You'll see a **blue card** labeled **"Manage Animals"** at the top
3. Click the card

---

## What You'll See

### Animals List Page (`/admin/animals`)

This page shows:
- ✅ Grid of all animals in the database
- ✅ Thumbnail photos for each animal
- ✅ Photo count badges
- ✅ **"Photos" button** on each animal card
- ✅ **"Add New Animal" button** (if you need to create new animals)

### Upload Photos for an Animal

1. On the Animals List, find the animal you want to add photos to
2. Click the blue **"Photos"** button
3. You'll be taken to: `/admin/animals/[animal-id]/photos`

### Photo Upload Page (`/admin/animals/[id]/photos`)

This is where the magic happens:

**Upload Section:**
- 📤 **Drag-and-drop** area (just drag photos onto it)
- 📁 Or **click to browse** files
- 👁️ **Preview** your selected photos before uploading
- ✅ Click **"Upload X Images"** button

**Current Photos Section:**
- 📷 Grid of all uploaded photos
- ⭐ **Star icon** - Click to set primary photo (shows first in galleries)
- 🗑️ **Trash icon** - Click to delete a photo
- 🎨 Beautiful hover effects

---

## Navigation Map

```
Dashboard
  ↓
Admin (sidebar link)
  ↓
Manage Animals (Quick Action card OR sidebar link)
  ↓
Animals List Page
  ↓
Click "Photos" on any animal
  ↓
Photo Upload Page (drag & drop!)
```

---

## Visual Guide

### 1. Sidebar (Left Side)
```
┌─────────────────┐
│ InnerAnimal     │
├─────────────────┤
│ Dashboard       │
│ AI Chat         │
│ Community       │
│ Video Calls     │
│ Admin           │
│ → Manage Animals│ ← CLICK THIS!
├─────────────────┤
│ Logout          │
└─────────────────┘
```

### 2. Admin Dashboard (Top Section)
```
┌──────────────────────────────┐
│  Admin Dashboard             │
│                              │
│  Quick Actions               │
│  ┌────────────────────────┐  │
│  │  📸 Manage Animals     │  │ ← CLICK THIS!
│  │  Upload photos &       │  │
│  │  manage listings       │  │
│  └────────────────────────┘  │
│  [User Management] [Settings]│
└──────────────────────────────┘
```

### 3. Animals List
```
┌────────────────────────────────┐
│ Manage Animals                 │
│ [+ Add New Animal]             │
│                                │
│ ┌──────┐  ┌──────┐  ┌──────┐  │
│ │Photo │  │Photo │  │Photo │  │
│ │      │  │      │  │      │  │
│ │Buddy │  │Max   │  │Luna  │  │
│ │[Edit]│  │[Edit]│  │[Edit]│  │
│ │[Photos]  │[Photos]  │[Photos] │ ← CLICK!
│ └──────┘  └──────┘  └──────┘  │
└────────────────────────────────┘
```

### 4. Photo Upload Page
```
┌────────────────────────────────┐
│ Manage Photos: Buddy           │
│                                │
│ Upload New Photos              │
│ ┌──────────────────────────┐  │
│ │  📤                      │  │
│ │  Drag photos here or     │  │ ← DROP HERE!
│ │  click to browse         │  │
│ └──────────────────────────┘  │
│                                │
│ Current Photos (3)             │
│ ┌────┐ ┌────┐ ┌────┐          │
│ │⭐📷│ │📷  │ │📷  │          │
│ │🗑️  │ │⭐🗑️│ │⭐🗑️│          │
│ └────┘ └────┘ └────┘          │
└────────────────────────────────┘
```

---

## Quick URLs

### Development (localhost)
```
Admin Dashboard:   http://localhost:3000/app/admin
Manage Animals:    http://localhost:3000/admin/animals
Upload Photos:     http://localhost:3000/admin/animals/[animal-id]/photos
```

### Production (Vercel)
```
Admin Dashboard:   https://your-domain.vercel.app/app/admin
Manage Animals:    https://your-domain.vercel.app/admin/animals
Upload Photos:     https://your-domain.vercel.app/admin/animals/[animal-id]/photos
```

---

## Troubleshooting

### "I don't see 'Manage Animals' in the sidebar"

**Cause:** You're not logged in as an admin

**Solution:**
1. Make sure you're logged in
2. Check that your user account has `role = 'admin'` in the database
3. Log out and log back in if you just made someone admin

### "I see the page but there are no animals"

**Cause:** No animals in the database yet

**Solution:**
Create an animal using the API:
```bash
curl -X POST http://localhost:3000/api/animals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Buddy",
    "type": "dog",
    "breed": "Golden Retriever",
    "age": "2 years",
    "gender": "Male",
    "price": 250,
    "status": "available"
  }'
```

Or use Prisma Studio:
```bash
npx prisma studio
```

### "Upload fails"

**Cause:** Cloudflare R2 not configured

**Solution:**
1. Check `.env.local` has all R2 credentials
2. Verify bucket exists in Cloudflare
3. Restart dev server: `npm run dev`

---

## Features You Have

✅ **Drag-and-drop upload** - Just drag photos onto the page
✅ **Multi-file support** - Upload up to 10 photos at once
✅ **Primary photo selection** - Click ⭐ to set the main photo
✅ **Easy deletion** - Click 🗑️ to remove photos
✅ **Photo galleries** - Automatically appear on adoption page
✅ **Photo carousel** - Visitors can browse all photos

---

## Pro Tips

1. **Upload 3-5 photos per animal** for best results
2. **Always set a primary photo** (⭐) - it shows first on the adoption page
3. **Use good quality photos** - clear, well-lit, showing the animal's personality
4. **Name your files** descriptively before uploading (optional, but helpful)
5. **Delete blurry photos** immediately - keep only the best shots

---

## Need Help?

Check these guides:
- **ANIMAL_PHOTO_UPLOAD_GUIDE.md** - Complete user manual
- **SETUP_SUMMARY.md** - Technical details
- **READY_TO_GO.md** - Quick start guide

---

**Enjoy uploading photos!** 🐕🐱📸
