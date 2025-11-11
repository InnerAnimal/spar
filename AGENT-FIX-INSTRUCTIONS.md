# 🤖 Agent Instructions: Fix CTA Popup Modals

## 🎯 Task
Fix CTA popup modals that aren't working on GitHub Pages. All files exist, but modals don't open when buttons are clicked.

---

## ✅ Verification (All Files Present)

All required files exist:
- ✅ `contexts/ModalContext.tsx`
- ✅ `components/Modal.tsx`
- ✅ `components/ModalManager.tsx`
- ✅ `components/TNRRequestForm.tsx`
- ✅ `components/CTAButtons.tsx`
- ✅ `app/layout.tsx` (has ModalProvider & ModalManager)

---

## 🔍 Diagnostic Steps

### Step 1: Check Browser Console
**Command to share with user:**
```
Open https://inneranimal.github.io/spar/ in browser
Press F12 to open DevTools
Go to Console tab
Click "Request TNR Service" button
Share any error messages
```

### Step 2: Verify Build Output
```bash
cd /Users/samprimeaux/Desktop/spar
npm run build
ls -la out/
```

### Step 3: Check if Client Components Are Marked
```bash
# All modal-related files should have 'use client' at top
head -1 contexts/ModalContext.tsx
head -1 components/Modal.tsx
head -1 components/ModalManager.tsx
head -1 components/CTAButtons.tsx
head -1 components/TNRRequestForm.tsx
```

**Expected:** All should show `'use client';`

---

## 🔧 Most Likely Fixes

### Fix 1: Ensure All Components Have 'use client'

**Files to check:**
- `components/CTAButtons.tsx` - Line 1 must be `'use client';`
- `components/Modal.tsx` - Line 1 must be `'use client';`
- `components/ModalManager.tsx` - Line 1 must be `'use client';`
- `components/TNRRequestForm.tsx` - Line 1 must be `'use client';`
- `contexts/ModalContext.tsx` - Line 1 must be `'use client';`

**If missing, add at the very top:**
```tsx
'use client';
```

---

### Fix 2: Verify ModalManager Renders TNRRequestForm

**File:** `components/ModalManager.tsx`

**Must have:**
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

### Fix 3: Verify CTAButtons Calls openModal

**File:** `components/CTAButtons.tsx`

**Must have:**
```tsx
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

### Fix 4: Rebuild After Changes

```bash
cd /Users/samprimeaux/Desktop/spar
npm run build
git add .
git commit -m "Fix: Ensure all modal components have 'use client' directive"
git push origin main
```

---

## 📋 Exact Commands to Run

```bash
# 1. Navigate
cd /Users/samprimeaux/Desktop/spar

# 2. Verify 'use client' directives
echo "Checking 'use client' directives..."
for file in contexts/ModalContext.tsx components/Modal.tsx components/ModalManager.tsx components/CTAButtons.tsx components/TNRRequestForm.tsx; do
  if head -1 "$file" | grep -q "use client"; then
    echo "✅ $file"
  else
    echo "❌ $file - MISSING 'use client'"
  fi
done

# 3. Install dependencies
npm install

# 4. Build
npm run build

# 5. Test locally (optional)
npm run dev
# Then open http://localhost:3000/spar/ and test button

# 6. Commit and push
git add .
git commit -m "Fix: CTA popup modals"
git push origin main
```

---

## 🐛 Common Issues

### Issue: Modal doesn't open
**Possible causes:**
1. Missing `'use client'` directive
2. ModalProvider not wrapping components
3. JavaScript errors in console
4. Build output missing client components

**Fix:** Check browser console for specific errors

### Issue: "useModal must be used within a ModalProvider"
**Fix:** Ensure `app/layout.tsx` wraps everything with `<ModalProvider>`

### Issue: Button click does nothing
**Fix:** Verify `CTAButtons.tsx` imports and uses `useModal()`

---

## ✅ Success Criteria

After fix:
1. ✅ Clicking "Request TNR Service" opens modal
2. ✅ Modal shows TNR request form
3. ✅ Form fields are visible and functional
4. ✅ Can submit form (saves to Supabase)
5. ✅ Modal closes on success or X button

---

## 📝 Files That Must Exist

```
spar/
├── contexts/
│   └── ModalContext.tsx          (with 'use client')
├── components/
│   ├── Modal.tsx                  (with 'use client')
│   ├── ModalManager.tsx           (with 'use client')
│   ├── TNRRequestForm.tsx         (with 'use client')
│   └── CTAButtons.tsx             (with 'use client')
└── app/
    └── layout.tsx                  (with ModalProvider & ModalManager)
```

---

## 🚀 Quick Fix Script

Save this as `fix-modals.sh`:

```bash
#!/bin/bash
cd /Users/samprimeaux/Desktop/spar

echo "Checking 'use client' directives..."
for file in contexts/ModalContext.tsx components/Modal.tsx components/ModalManager.tsx components/CTAButtons.tsx components/TNRRequestForm.tsx; do
  if ! head -1 "$file" | grep -q "use client"; then
    echo "Adding 'use client' to $file"
    sed -i '' "1i\\
'use client';\\
" "$file"
  fi
done

echo "Building..."
npm run build

echo "Done! Commit and push to deploy."
```

Run: `chmod +x fix-modals.sh && ./fix-modals.sh`

---

**If modals still don't work, check browser console for specific error messages and share them.**

