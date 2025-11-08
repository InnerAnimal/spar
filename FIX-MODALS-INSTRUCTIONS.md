# 🔧 Fix CTA Popup Modals - Exact Instructions

## 🎯 Problem
CTA popup modals for applications aren't working on GitHub Pages.

## ✅ Solution Steps

### Step 1: Verify All Required Files Exist

Check these files exist in the repo:

```
spar/
├── contexts/
│   └── ModalContext.tsx          ✅ REQUIRED
├── components/
│   ├── Modal.tsx                  ✅ REQUIRED
│   ├── ModalManager.tsx           ✅ REQUIRED
│   ├── TNRRequestForm.tsx         ✅ REQUIRED
│   └── CTAButtons.tsx             ✅ REQUIRED
└── app/
    └── layout.tsx                 ✅ Must import ModalProvider & ModalManager
```

---

### Step 2: Verify `app/layout.tsx` Setup

**File:** `app/layout.tsx`

**Must have these imports:**
```tsx
import { ModalProvider } from "@/contexts/ModalContext"
import ModalManager from "@/components/ModalManager"
```

**Must wrap children like this:**
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ModalManager />
        </ModalProvider>
      </body>
    </html>
  )
}
```

---

### Step 3: Verify `contexts/ModalContext.tsx` Exists

**File:** `contexts/ModalContext.tsx`

**Content must be:**
```tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ModalType = 'tnr-request' | 'adoption' | 'donation' | null;

interface ModalContextType {
  currentModal: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setCurrentModal(type);
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  return (
    <ModalContext.Provider value={{ currentModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
```

---

### Step 4: Verify `components/Modal.tsx` Exists

**File:** `components/Modal.tsx`

**Must include:**
- Import from `lucide-react` for X icon
- Proper modal structure with backdrop
- Escape key handler
- Click outside to close

**Key requirements:**
```tsx
'use client';
import { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';
```

---

### Step 5: Verify `components/ModalManager.tsx` Exists

**File:** `components/ModalManager.tsx`

**Must render TNRRequestForm for 'tnr-request' modal:**
```tsx
case 'tnr-request':
  return (
    <TNRRequestForm
      onSuccess={() => closeModal()}
      onClose={closeModal}
    />
  );
```

---

### Step 6: Verify `components/CTAButtons.tsx` Uses `useModal`

**File:** `components/CTAButtons.tsx`

**Must have:**
```tsx
'use client';
import React from 'react';
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

---

### Step 7: Verify Pages Import CTA Buttons

**Files to check:**
- `app/page.tsx` - Home page
- `app/adopt/page.tsx` - Adopt page  
- `app/services/page.tsx` - Services page

**Each must import:**
```tsx
import { TNRRequestButton, AdoptionButton, DonationButton } from '@/components/CTAButtons'
```

**And use buttons like:**
```tsx
<TNRRequestButton variant="primary" size="lg" />
```

---

### Step 8: Install Dependencies

**Run:**
```bash
cd /path/to/spar
npm install lucide-react
```

**Verify in `package.json`:**
```json
{
  "dependencies": {
    "lucide-react": "^0.294.0"
  }
}
```

---

### Step 9: Check TypeScript Path Alias

**File:** `tsconfig.json`

**Must have:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*", "./src/*"]
    }
  }
}
```

---

### Step 10: Build and Test Locally

**Commands:**
```bash
cd /path/to/spar
npm install
npm run build
npm run dev
```

**Test:**
1. Open http://localhost:3000/spar/
2. Click "Request TNR Service" button
3. Modal should open with form

---

### Step 11: Common Issues & Fixes

#### Issue: "useModal must be used within a ModalProvider"
**Fix:** Ensure `app/layout.tsx` wraps everything with `<ModalProvider>`

#### Issue: Modal doesn't open
**Fix:** Check browser console for errors. Verify `useModal()` is called inside a component that's a child of `ModalProvider`.

#### Issue: "Cannot find module '@/contexts/ModalContext'"
**Fix:** Verify `tsconfig.json` has `"@/*": ["./*"]` in paths.

#### Issue: "X is not exported from lucide-react"
**Fix:** Run `npm install lucide-react`

---

### Step 12: Deploy to GitHub Pages

**After fixes, rebuild:**
```bash
npm run build
```

**Commit and push:**
```bash
git add .
git commit -m "Fix: CTA popup modals - ensure all components properly connected"
git push origin main
```

**GitHub Pages will auto-deploy from `out/` folder (created by `npm run build`)**

---

## 🔍 Debugging Checklist

- [ ] `ModalContext.tsx` exists in `contexts/` folder
- [ ] `Modal.tsx` exists in `components/` folder
- [ ] `ModalManager.tsx` exists in `components/` folder
- [ ] `TNRRequestForm.tsx` exists in `components/` folder
- [ ] `CTAButtons.tsx` exists in `components/` folder
- [ ] `app/layout.tsx` imports `ModalProvider` and `ModalManager`
- [ ] `app/layout.tsx` wraps children with `<ModalProvider>`
- [ ] `app/layout.tsx` renders `<ModalManager />`
- [ ] Pages import CTA buttons from `@/components/CTAButtons`
- [ ] `lucide-react` is installed (`npm list lucide-react`)
- [ ] `tsconfig.json` has `@/*` path alias
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in browser

---

## 📝 Exact Commands to Run

```bash
# 1. Navigate to project
cd /Users/samprimeaux/Desktop/spar

# 2. Install dependencies
npm install lucide-react

# 3. Verify files exist
ls -la contexts/ModalContext.tsx
ls -la components/Modal.tsx
ls -la components/ModalManager.tsx
ls -la components/TNRRequestForm.tsx
ls -la components/CTAButtons.tsx

# 4. Check layout.tsx has ModalProvider
grep -n "ModalProvider" app/layout.tsx
grep -n "ModalManager" app/layout.tsx

# 5. Build
npm run build

# 6. Test locally (optional)
npm run dev

# 7. Commit and push
git add .
git commit -m "Fix: Ensure CTA popup modals are properly connected"
git push origin main
```

---

## ✅ Expected Result

After fixes:
1. Clicking "Request TNR Service" button opens modal
2. Modal shows TNR request form
3. Form can be filled out and submitted
4. Modal closes on success or when clicking X/outside

---

**If modals still don't work after these steps, check browser console for specific error messages.**

