# 🚀 Quick Fix: CTA Popup Modals - Copy/Paste Instructions

## 📋 Exact Commands to Run

```bash
# Navigate to project
cd /Users/samprimeaux/Desktop/spar

# Install dependencies (if missing)
npm install lucide-react

# Verify all modal files exist
ls -la contexts/ModalContext.tsx components/Modal.tsx components/ModalManager.tsx components/TNRRequestForm.tsx components/CTAButtons.tsx

# Check layout.tsx has ModalProvider
cat app/layout.tsx | grep -A 10 "ModalProvider"

# Build for GitHub Pages
npm run build

# Test locally (optional - opens http://localhost:3000/spar/)
npm run dev
```

---

## ✅ Verify These Files Exist

Run this command to check:
```bash
cd /Users/samprimeaux/Desktop/spar && \
echo "Checking files..." && \
[ -f "contexts/ModalContext.tsx" ] && echo "✅ ModalContext.tsx" || echo "❌ Missing ModalContext.tsx" && \
[ -f "components/Modal.tsx" ] && echo "✅ Modal.tsx" || echo "❌ Missing Modal.tsx" && \
[ -f "components/ModalManager.tsx" ] && echo "✅ ModalManager.tsx" || echo "❌ Missing ModalManager.tsx" && \
[ -f "components/TNRRequestForm.tsx" ] && echo "✅ TNRRequestForm.tsx" || echo "❌ Missing TNRRequestForm.tsx" && \
[ -f "components/CTAButtons.tsx" ] && echo "✅ CTAButtons.tsx" || echo "❌ Missing CTAButtons.tsx" && \
[ -f "app/layout.tsx" ] && echo "✅ layout.tsx" || echo "❌ Missing layout.tsx"
```

---

## 🔧 Critical File: `app/layout.tsx`

**Must contain exactly:**

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import { ModalProvider } from "@/contexts/ModalContext"
import ModalManager from "@/components/ModalManager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Southern Pets Animal Rescue | Every Animal Deserves a Loving Home | Acadia Parish",
  description: "Southern Pets Animal Rescue serving Acadia Parish, Louisiana. Help us rescue, rehabilitate, and rehome dogs and cats in need. Adoption and TNR services available.",
  keywords: "Southern Pets Animal Rescue, animal rescue, Acadia Parish, dog adoption, cat adoption, rescue dogs, rescue cats, Louisiana animal rescue, TNR services",
  openGraph: {
    type: "website",
    url: "https://www.southernpetsanimalrescue.org/",
    title: "Southern Pets Animal Rescue | Every Animal Deserves a Loving Home",
    description: "Southern Pets Animal Rescue serving Acadia Parish. Help us rescue, rehabilitate, and rehome animals in need.",
    siteName: "Southern Pets Animal Rescue",
  },
  twitter: {
    card: "summary_large_image",
    title: "Southern Pets Animal Rescue",
    description: "Animal rescue serving Acadia Parish",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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

**Key points:**
- ✅ Line 6: `import { ModalProvider } from "@/contexts/ModalContext"`
- ✅ Line 7: `import ModalManager from "@/components/ModalManager"`
- ✅ Line 37: `<ModalProvider>` wraps everything
- ✅ Line 41: `<ModalManager />` is rendered inside ModalProvider

---

## 🔧 Critical File: `contexts/ModalContext.tsx`

**Must exist at:** `contexts/ModalContext.tsx`

**Content:**

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

## 🔧 Critical File: `components/CTAButtons.tsx`

**Must have `'use client'` directive and use `useModal`:**

```tsx
'use client';

import React from 'react';
import { useModal } from '@/contexts/ModalContext';

// ... (rest of component)

export function TNRRequestButton({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '' 
}: ButtonProps) {
  const { openModal } = useModal();

  return (
    <button
      onClick={() => openModal('tnr-request')}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      Request TNR Service
    </button>
  );
}
```

---

## 🐛 Common Issues & Quick Fixes

### Issue 1: "useModal must be used within a ModalProvider"
**Fix:** Ensure `app/layout.tsx` wraps everything with `<ModalProvider>`

### Issue 2: Modal doesn't open when clicking button
**Check:**
```bash
# Verify CTAButtons uses useModal
grep -n "useModal" components/CTAButtons.tsx
grep -n "openModal" components/CTAButtons.tsx
```

### Issue 3: "Cannot find module '@/contexts/ModalContext'"
**Fix:** Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*", "./src/*"]
    }
  }
}
```

### Issue 4: Build fails
**Fix:**
```bash
npm install
npm run build
```

---

## 🚀 Deploy After Fix

```bash
# Build
npm run build

# Commit
git add .
git commit -m "Fix: CTA popup modals - ensure ModalProvider wraps all components"

# Push
git push origin main
```

**GitHub Pages will auto-deploy from `out/` folder.**

---

## ✅ Test Checklist

After deployment, test:
1. ✅ Go to https://inneranimal.github.io/spar/
2. ✅ Click "Request TNR Service" button
3. ✅ Modal should open with form
4. ✅ Form fields are visible
5. ✅ Can submit form (saves to Supabase)
6. ✅ Modal closes on success

---

## 📞 If Still Not Working

**Check browser console (F12) for errors:**
- Look for "useModal must be used within a ModalProvider"
- Look for "Cannot find module"
- Look for any React errors

**Share error messages with agent for specific fix.**

