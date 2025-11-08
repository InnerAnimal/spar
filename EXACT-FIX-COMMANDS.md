# 📋 Exact Commands to Fix CTA Popup Modals

## ✅ Current Status
All files exist and are properly configured:
- ✅ All components have `'use client'` directive
- ✅ ModalProvider wraps layout correctly
- ✅ ModalManager is rendered
- ✅ CTAButtons use useModal hook

---

## 🚀 Exact Commands to Run

### Step 1: Verify Current Setup
```bash
cd /Users/samprimeaux/Desktop/spar

# Check all files exist
ls -la contexts/ModalContext.tsx components/Modal.tsx components/ModalManager.tsx components/TNRRequestForm.tsx components/CTAButtons.tsx

# Verify 'use client' directives
head -1 contexts/ModalContext.tsx
head -1 components/Modal.tsx
head -1 components/ModalManager.tsx
head -1 components/CTAButtons.tsx
head -1 components/TNRRequestForm.tsx

# Check layout.tsx
grep -A 5 "ModalProvider" app/layout.tsx
```

---

### Step 2: Clean Build
```bash
cd /Users/samprimeaux/Desktop/spar

# Remove old build
rm -rf .next out

# Install dependencies
npm install

# Build fresh
npm run build

# Verify build output
ls -la out/
```

---

### Step 3: Test Locally
```bash
cd /Users/samprimeaux/Desktop/spar

# Start dev server
npm run dev

# Open browser to: http://localhost:3000/spar/
# Click "Request TNR Service" button
# Check if modal opens
# Check browser console (F12) for errors
```

---

### Step 4: Deploy to GitHub Pages
```bash
cd /Users/samprimeaux/Desktop/spar

# Commit changes
git add .
git commit -m "Fix: CTA popup modals - rebuild with clean build"

# Push to GitHub
git push origin main

# GitHub Pages will auto-deploy from 'out/' folder
```

---

## 🔍 Troubleshooting

### If Modal Still Doesn't Open:

**1. Check Browser Console:**
```
Open: https://inneranimal.github.io/spar/
Press F12 → Console tab
Click "Request TNR Service" button
Look for errors (red text)
```

**2. Check Network Tab:**
```
F12 → Network tab
Click "Request TNR Service" button
Look for failed requests (red)
```

**3. Verify JavaScript is Loading:**
```
F12 → Sources tab
Look for _next/static/chunks/
Verify modal-related files are loaded
```

---

## 📝 Key Files to Verify

### File 1: `app/layout.tsx`
**Must contain:**
```tsx
import { ModalProvider } from "@/contexts/ModalContext"
import ModalManager from "@/components/ModalManager"

// In return statement:
<ModalProvider>
  <Header />
  <main>{children}</main>
  <Footer />
  <ModalManager />
</ModalProvider>
```

### File 2: `components/CTAButtons.tsx`
**Must contain:**
```tsx
'use client';
import { useModal } from '@/contexts/ModalContext';

export function TNRRequestButton({ ... }) {
  const { openModal } = useModal();
  return (
    <button onClick={() => openModal('tnr-request')}>
      Request TNR Service
    </button>
  );
}
```

### File 3: `components/ModalManager.tsx`
**Must contain:**
```tsx
'use client';
import { useModal } from '@/contexts/ModalContext';
import TNRRequestForm from './TNRRequestForm';

case 'tnr-request':
  return (
    <TNRRequestForm
      onSuccess={() => closeModal()}
      onClose={closeModal}
    />
  );
```

---

## 🎯 Quick Test

**After deployment, test:**
1. Go to: https://inneranimal.github.io/spar/
2. Open browser console (F12)
3. Click "Request TNR Service" button
4. **Expected:** Modal opens with form
5. **If not:** Check console for error message

---

## 📞 Share With Agent

**If modals still don't work, share:**
1. Browser console errors (F12 → Console)
2. Network tab errors (F12 → Network)
3. Which button was clicked
4. What happened (nothing, error message, etc.)

---

**All files are correctly configured. Issue is likely:**
- Build output not deploying correctly
- JavaScript runtime error
- Browser compatibility issue

**Check browser console for specific error messages!**

