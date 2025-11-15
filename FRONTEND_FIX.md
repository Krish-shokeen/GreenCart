# 🔧 Frontend "Not Found" Fix

## Problem
Frontend shows "Not Found" when navigating to routes like `/shop`, `/about`, etc.

## Root Cause
Render's static hosting doesn't know how to handle client-side routing (React Router). When you visit `/shop`, Render looks for a `shop.html` file instead of serving `index.html` and letting React Router handle it.

## Solution

### Step 1: Add _redirects File ✅
I've created `client/public/_redirects` which tells Render to serve `index.html` for all routes.

### Step 2: Update Backend CORS ✅
I've updated `backend/.env` with your frontend URL: `https://greencart-1-s3ka.onrender.com`

### Step 3: Commit and Push Changes

```bash
git add .
git commit -m "Fix frontend routing and CORS"
git push
```

This will trigger automatic redeployment on Render for both services.

### Step 4: Update Backend Environment Variable on Render

1. Go to https://dashboard.render.com/
2. Click on your **backend service** (greencart-backend)
3. Go to **Environment** tab
4. Add or update:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://greencart-1-s3ka.onrender.com`
5. Click **Save Changes**

### Step 5: Wait for Redeployment

- Backend: 2-3 minutes
- Frontend: 3-5 minutes

Watch the deployment logs on Render to see progress.

## Verification Steps

### 1. Test Backend Health
Visit: `https://greencart-1mlr.onrender.com/`

Should show:
```json
{
  "status": "ok",
  "message": "GreenCart API is running",
  "timestamp": "..."
}
```

### 2. Test Frontend Routes
Visit these URLs directly:
- `https://greencart-1-s3ka.onrender.com/` ✅ Should show homepage
- `https://greencart-1-s3ka.onrender.com/shop` ✅ Should show shop page
- `https://greencart-1-s3ka.onrender.com/about` ✅ Should show about page

### 3. Test API Connection
1. Go to shop page
2. Open browser console (F12)
3. Check for:
   - ✅ Products loading
   - ❌ No CORS errors
   - ❌ No network errors

### 4. Test Login
1. Try to login
2. Should work without CORS errors

## If Still Not Working

### Check Frontend Build Settings on Render

Make sure these are set correctly:

**Build Command:**
```
npm install && npm run build
```

**Publish Directory:**
```
dist
```

**Environment Variables:**
```
VITE_API_URL=https://greencart-1mlr.onrender.com
```

### Check Backend Environment Variables

Make sure these are all set:
```
MONGO_URL=mongodb+srv://krishshokeen50:jaishokeen@greenkart.37p6ogd.mongodb.net/?appName=GreenKart
JWT_SECRET=jaatraaj
CLOUD_NAME=dxaaionxc
CLOUD_API_KEY=393119211493457
CLOUD_API_SECRET=PHA7BKTrnrRNng076pxidXHnKXY
FRONTEND_URL=https://greencart-1-s3ka.onrender.com
PORT=6969
```

### Check Render Logs

**Frontend Logs:**
- Look for "Build succeeded"
- Check for any build errors

**Backend Logs:**
- Look for "Successfully connected to MongoDB!"
- Look for "Server is running on port 6969"
- Check for CORS errors

## Alternative: Manual Redeploy

If automatic deployment doesn't trigger:

1. Go to Render dashboard
2. Click on your service
3. Click **Manual Deploy** → **Deploy latest commit**

## Your URLs

**Frontend:** https://greencart-1-s3ka.onrender.com
**Backend:** https://greencart-1mlr.onrender.com

## Summary of Changes

1. ✅ Created `client/public/_redirects` for routing
2. ✅ Updated `backend/.env` with frontend URL
3. ⏳ Need to commit and push
4. ⏳ Need to update FRONTEND_URL on Render backend
5. ⏳ Wait for redeployment

After these steps, everything should work! 🚀
