# 🔧 CORS Error Fix

## Problem
Frontend can't connect to backend - getting CORS errors when trying to login or make API calls.

## Solution

### Step 1: Update Backend CORS Configuration ✅

I've updated `backend/server.js` to allow multiple origins. Now you need to set your frontend URL.

### Step 2: Set Frontend URL in Render Backend

1. Go to https://dashboard.render.com/
2. Click on your **backend service** (greencart-backend or similar)
3. Go to **Environment** tab
4. Find or add `FRONTEND_URL` variable
5. Set it to your frontend URL (e.g., `https://greencart-frontend-xyz.onrender.com`)
6. Click **Save Changes**
7. Render will automatically redeploy

### Step 3: Verify Environment Variables on Render

Make sure your **backend** has these environment variables set:

```
MONGO_URL=mongodb+srv://krishshokeen50:jaishokeen@greenkart.37p6ogd.mongodb.net/?appName=GreenKart
JWT_SECRET=jaatraaj
CLOUD_NAME=dxaaionxc
CLOUD_API_KEY=393119211493457
CLOUD_API_SECRET=PHA7BKTrnrRNng076pxidXHnKXY
FRONTEND_URL=https://your-frontend-url.onrender.com
PORT=6969
```

Make sure your **frontend** has this environment variable set:

```
VITE_API_URL=https://greencart-1mlr.onrender.com
```

### Step 4: Check Backend Logs

1. Go to your backend service on Render
2. Click on **Logs** tab
3. Look for:
   - "Successfully connected to MongoDB!" ✅
   - "Server is running on port 6969" ✅
   - Any CORS errors or "Blocked by CORS" messages ❌

### Step 5: Test API Directly

Open your browser and visit:
```
https://greencart-1mlr.onrender.com/api/products
```

You should see:
- JSON response with products (or empty array)
- NOT a CORS error
- NOT a 404 error

### Step 6: Check Frontend Console

1. Open your deployed frontend
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Try to login
5. Look for errors:
   - ❌ "CORS policy" error → Backend CORS not configured
   - ❌ "Network Error" → Backend is down or URL is wrong
   - ❌ "404 Not Found" → API endpoint doesn't exist
   - ✅ "401 Unauthorized" → Backend is working! (just wrong credentials)

## Common Issues

### Issue 1: CORS Error
**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
- Make sure FRONTEND_URL is set in backend environment variables
- Make sure it matches your frontend URL exactly (no trailing slash)
- Redeploy backend after changing environment variables

### Issue 2: Network Error
**Error:** "Network Error" or "Failed to fetch"

**Solution:**
- Check if backend is running (visit backend URL directly)
- Verify VITE_API_URL in frontend environment variables
- Make sure backend URL doesn't have trailing slash

### Issue 3: Backend Not Responding
**Error:** Backend URL times out or shows "Application failed to respond"

**Solution:**
- Check backend logs on Render
- Verify MongoDB connection string is correct
- Make sure all environment variables are set
- Free tier services sleep after 15 minutes - first request takes 30-60 seconds

### Issue 4: 404 Not Found
**Error:** "404 Not Found" on API calls

**Solution:**
- Verify API routes are correct (should be `/api/auth/login`, not `/auth/login`)
- Check backend logs for route registration
- Make sure all route files are properly imported in server.js

## Quick Test Commands

### Test Backend Health
```bash
curl https://greencart-1mlr.onrender.com/api/products
```

### Test Login Endpoint
```bash
curl -X POST https://greencart-1mlr.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## After Fixing

1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh frontend (Ctrl+Shift+R)
3. Try logging in again
4. Check console for any remaining errors

## Still Not Working?

Share these details:
1. Frontend URL
2. Backend URL
3. Error message from browser console
4. Backend logs from Render
