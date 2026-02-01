# VibeCraft DAO - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

---

## 📦 Deploy Backend First

### Step 1: Deploy Backend API
```bash
cd backend
vercel
```

**During deployment, answer the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No**
- Project name? → `vibecraft-backend` (or your preferred name)
- Directory? → **./backend** (or just press Enter if already in backend folder)
- Override settings? → **No**

**Important:** After deployment, Vercel will give you a URL like:
```
https://vibecraft-backend-xxx.vercel.app
```
**Save this URL!** You'll need it for the frontend.

---

## 🎨 Deploy Frontend

### Step 2: Update Frontend API URL

Before deploying frontend, update the API URL to point to your deployed backend:

1. Open `frontend/src/services/api.ts`
2. Change line 3 from:
   ```typescript
   const API_URL = 'http://localhost:3001';
   ```
   to:
   ```typescript
   const API_URL = process.env.VITE_API_URL || 'https://vibecraft-backend-xxx.vercel.app';
   ```
   (Replace `xxx` with your actual backend URL)

### Step 3: Deploy Frontend
```bash
cd frontend
vercel
```

**During deployment, answer the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No**
- Project name? → `vibecraft-dao` (or your preferred name)
- Directory? → **./frontend**
- Override settings? → **No**

### Step 4: Set Environment Variable (Optional but Recommended)

In Vercel Dashboard:
1. Go to your frontend project
2. Settings → Environment Variables
3. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://vibecraft-backend-xxx.vercel.app`
   - **Environment:** Production, Preview, Development

---

## 🔄 Alternative: Deploy via Vercel Dashboard (Recommended for GitHub Integration)

### Method 2: Deploy from GitHub

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push
   ```

2. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Backend Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`
   - Click "Deploy"

4. **Configure Frontend Project:**
   - Import the same repository again
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
   - **Environment Variables:**
     - Add `VITE_API_URL` with your backend URL
   - Click "Deploy"

---

## ✅ Post-Deployment Checklist

After both deployments are complete:

1. **Test Backend API:**
   ```bash
   curl https://your-backend-url.vercel.app/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Test Frontend:**
   - Visit your frontend URL
   - Connect wallet
   - Try creating a proposal
   - Try voting on a proposal

3. **Update CORS (if needed):**
   If you get CORS errors, update `backend/src/app.js`:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend-url.vercel.app', 'http://localhost:5173'],
     credentials: true
   }));
   ```

---

## 🔧 Troubleshooting

### Issue: "Module not found" errors
**Solution:** Make sure all dependencies are in `package.json`, not just `devDependencies`

### Issue: API calls failing
**Solution:** 
1. Check that `VITE_API_URL` is set correctly
2. Verify backend is deployed and accessible
3. Check browser console for CORS errors

### Issue: Build fails
**Solution:**
1. Run `npm run build` locally to test
2. Check build logs in Vercel dashboard
3. Ensure all TypeScript errors are resolved

---

## 📝 Important Notes

1. **Database:** Currently using in-memory storage. For production, you should:
   - Set up a PostgreSQL database (e.g., Vercel Postgres, Supabase, or Railway)
   - Update `backend/src/db/index.js` to use real database connection

2. **Environment Variables:** Keep sensitive data in Vercel environment variables, never commit them to Git

3. **Custom Domain:** After deployment, you can add a custom domain in Vercel dashboard

4. **Automatic Deployments:** When using GitHub integration, Vercel automatically deploys on every push to main branch

---

## 🎯 Your Deployed URLs

After deployment, you'll have:
- **Frontend:** `https://vibecraft-dao-xxx.vercel.app`
- **Backend:** `https://vibecraft-backend-xxx.vercel.app`

Share the frontend URL for your hackathon submission! 🚀

---

## 🔄 Redeployment

To redeploy after making changes:

**Option 1: CLI**
```bash
vercel --prod
```

**Option 2: GitHub (if integrated)**
```bash
git add .
git commit -m "Your changes"
git push
```
Vercel will automatically redeploy!
