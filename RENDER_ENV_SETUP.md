# 🔧 Fix: Frontend Not Connecting to Backend on Render

## Problem
- ✅ Works on localhost
- ❌ Doesn't work on Render (hosted)

## Root Cause
The environment variable `VITE_API_URL` is not set on Render's dashboard. Your local `.env` file is NOT uploaded to Render (it's in `.gitignore`).

## Solution: Set Environment Variables on Render

### For FRONTEND (Static Site)

1. Go to https://dashboard.render.com/
2. Click on your **frontend service** (greencart-1-s3ka)
3. Click on **Environment** in the left sidebar
4. Click **Add Environment Variable**
5. Add this variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://greencart-1mlr.onrender.com`
6. Click **Save Changes**
7. Render will automatically redeploy (takes 3-5 minutes)

### For BACKEND (Web Service)

1. Go to https://dashboard.render.com/
2. Click on your **backend service** (greencart-1mlr)
3. Click on **Environment** in the left sidebar
4. Make sure these variables are set:

```
MONGO_URL=mongodb+srv://krishshokeen50:jaishokeen@greenkart.37p6ogd.mongodb.net/?appName=GreenKart
JWT_SECRET=jaatraaj
CLOUD_NAME=dxaaionxc
CLOUD_API_KEY=393119211493457
CLOUD_API_SECRET=PHA7BKTrnrRNng076pxidXHnKXY
FRONTEND_URL=https://greencart-1-s3ka.onrender.com
PORT=6969
```

5. If `FRONTEND_URL` is missing or wrong, add/update it
6. Click **Save Changes**

## Important Notes

### About Environment Variables on Render

1. **Local `.env` files are NOT uploaded** - They're in `.gitignore` for security
2. **You MUST set them on Render's dashboard** - Each service has its own environment variables
3. **Changes trigger redeployment** - Wait for it to complete
4. **Build-time vs Runtime:**
   - Frontend (Vite): `VITE_*` variables are read during BUILD time
   - Backend (Node): Variables are read during RUNTIME

### Why VITE_ Prefix?

Vite only exposes environment variables that start with `VITE_` to the client-side code. This is a security feature.

## Verification Steps

### Step 1: Check Frontend Environment Variable

After redeployment, you can verify by:

1. Open your deployed frontend: `https://greencart-1-s3ka.onrender.com`
2. Open browser console (F12)
3. Type: `import.meta.env.VITE_API_URL`
4. Should show: `https://greencart-1mlr.onrender.com`

### Step 2: Test API Connection

1. Go to Shop page
2. Open Network tab (F12 → Network)
3. Refresh page
4. Look for API calls to `https://greencart-1mlr.onrender.com/api/products`
5. Should see successful responses (200 OK)

### Step 3: Test Login

1. Try to login
2. Check Network tab
3. Should see POST to `https://greencart-1mlr.onrender.com/api/auth/login`
4. No CORS errors

## Common Mistakes

### ❌ Mistake 1: Only updating local .env
Your local `.env` file is NOT used on Render. You MUST set variables on Render's dashboard.

### ❌ Mistake 2: Wrong variable name
Must be `VITE_API_URL` (not `API_URL` or `REACT_APP_API_URL`)

### ❌ Mistake 3: Trailing slash
Use `https://greencart-1mlr.onrender.com` (no trailing slash)

### ❌ Mistake 4: Not waiting for redeployment
After changing environment variables, wait for redeployment to complete (3-5 minutes)

### ❌ Mistake 5: Browser cache
Clear browser cache and hard refresh (Ctrl+Shift+R) after redeployment

## Quick Checklist

### Frontend Environment Variables on Render:
- [ ] `VITE_API_URL` = `https://greencart-1mlr.onrender.com`

### Backend Environment Variables on Render:
- [ ] `MONGO_URL` = (your MongoDB connection string)
- [ ] `JWT_SECRET` = `jaatraaj`
- [ ] `CLOUD_NAME` = `dxaaionxc`
- [ ] `CLOUD_API_KEY` = `393119211493457`
- [ ] `CLOUD_API_SECRET` = `PHA7BKTrnrRNng076pxidXHnKXY`
- [ ] `FRONTEND_URL` = `https://greencart-1-s3ka.onrender.com`
- [ ] `PORT` = `6969`

### After Setting Variables:
- [ ] Frontend redeployed successfully
- [ ] Backend redeployed successfully
- [ ] Cleared browser cache
- [ ] Hard refreshed page (Ctrl+Shift+R)
- [ ] Tested API connection

## Still Not Working?

### Check Build Logs

**Frontend:**
1. Go to your frontend service on Render
2. Click on "Logs"
3. Look for build output
4. Should see: `VITE_API_URL=https://greencart-1mlr.onrender.com` during build

**Backend:**
1. Go to your backend service on Render
2. Click on "Logs"
3. Look for: "Successfully connected to MongoDB!"
4. Look for: "Server is running on port 6969"

### Test Backend Directly

Open in browser:
```
https://greencart-1mlr.onrender.com/api/products
```

Should return JSON (products array or empty array), not an error.

### Check Browser Console

1. Open deployed frontend
2. Press F12
3. Go to Console tab
4. Look for errors:
   - CORS errors → Backend FRONTEND_URL not set correctly
   - Network errors → Frontend VITE_API_URL not set correctly
   - 404 errors → API routes don't exist

## Your URLs

**Frontend:** https://greencart-1-s3ka.onrender.com
**Backend:** https://greencart-1mlr.onrender.com

## Summary

The key issue is that **environment variables must be set on Render's dashboard**, not just in your local `.env` file. Follow the steps above to set them correctly, wait for redeployment, and your app should work! 🚀
