# 🔐 Provide GitHub Token for Push

## Method 1: Run Script with Token (Recommended)

**Just paste your token here and I'll use it:**

```bash
cd /Users/samprimeaux/Desktop/spar
chmod +x push-with-token.sh
./push-with-token.sh YOUR_TOKEN_HERE
```

**Or set as environment variable:**
```bash
export GITHUB_TOKEN=your_token_here
cd /Users/samprimeaux/Desktop/spar
./push-with-token.sh
```

---

## Method 2: Direct Command

**Paste your token and run:**

```bash
cd /Users/samprimeaux/Desktop/spar
git remote set-url origin https://YOUR_TOKEN@github.com/inneranimal/spar.git
git push origin main
```

---

## Method 3: Interactive (Most Secure)

**I can prompt you for the token interactively:**

Just say: "Use token: ghp_xxxxxxxxxxxxx"

And I'll use it to push.

---

## ✅ Token Requirements

Your token needs:
- ✅ **Scope:** `repo` (full control of private repositories)
- ✅ **Type:** Personal Access Token (classic) or Fine-grained token with `Contents: Read and write`

---

## 🔒 Security Note

- Token will be used only for this push
- Token is not stored permanently
- You can revoke token after push if desired

---

**Ready! Just provide your token and I'll push immediately.** 🚀

