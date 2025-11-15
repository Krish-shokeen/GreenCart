# 🚀 GreenCart Deployment Checklist

## ✅ Pre-Deployment Setup (Complete)

- [x] Created `client/.env` with VITE_API_URL
- [x] Created `client/src/config/api.js` for centralized API configuration
- [x] Updated `backend/server.js` with CORS and PORT configuration
- [x] Updated `backend/.env` with FRONTEND_URL and PORT
- [x] Created deployment guides and scripts
- [x] Added `.env` files to `.gitignore` (SECURITY)
- [x] Created `.env.example` files for reference

## 📋 What You Need to Do

### 0. Security Check (2 minutes) ⚠️ IMPORTANT

Before deploying, verify `.env` files are not tracked by Git:

```bash
git ls-files | grep .env
```

If any `.env` files appear, run:
```bash
git rm --cached backend/.env
git rm --cached client/.env
git commit -m "Remove .env files from Git"
```

See `SECURITY_NOTES.md` for more details.

### 1. Update All API URLs (5 minutes)

Run this command from project root:
```bash
node update-api-urls.js
```

This will update all 14 frontend files automatically.

### 2. Deploy Backend on Render (10 minutes)

1. Go to https://dashboard.render.com/
2. Create new Web Service
3. Connect GitHub repo
4. Configure:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add environment variables:
   - `MONGO_URL`: mongodb+srv://krishshokeen50:jaishokeen@greenkart.37p6ogd.mongodb.net/?appName=GreenKart
   - `JWT_SECRET`: jaatraaj
   - `CLOUD_NAME`: dxaaionxc
   - `CLOUD_API_KEY`: 393119211493457
   - `CLOUD_API_SECRET`: PHA7BKTrnrRNng076pxidXHnKXY
   - `PORT`: 6969
   - `FRONTEND_URL`: (leave empty for now, update after frontend deployment)

6. **SAVE YOUR BACKEND URL!** (e.g., https://greencart-backend-abc123.onrender.com)

### 3. Update Frontend Config (2 minutes)

Edit `client/.env`:
```env
VITE_API_URL=https://your-backend-url-from-step-2.onrender.com
```

### 4. Deploy Frontend on Render (10 minutes)

1. Create new Static Site
2. Connect same GitHub repo
3. Configure:
   - Root Directory: `client`
   - Build: `npm install && npm run build`
   - Publish: `dist`
4. Add environment variable:
   - `VITE_API_URL`: (your backend URL from step 2)

5. **SAVE YOUR FRONTEND URL!** (e.g., https://greencart-frontend-xyz789.onrender.com)

### 5. Update Backend CORS (5 minutes)

1. Go back to backend service on Render
2. Add/Update environment variable:
   - `FRONTEND_URL`: (your frontend URL from step 4)
3. Render will auto-redeploy

## 🧪 Testing (10 minutes)

Visit your frontend URL and test:
- [ ] Homepage loads
- [ ] Can signup
- [ ] Can login
- [ ] Can view products
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can view orders
- [ ] Can cancel order
- [ ] Images display correctly
- [ ] About page works
- [ ] Contact page works

## 📝 Your Deployment URLs

Fill these in after deployment:

**Backend URL**: _______________________________________________

**Frontend URL**: _______________________________________________

## 🎯 Quick Reference

### Files Created/Modified:
- ✅ `client/.env` - Frontend environment variables
- ✅ `client/.env.example` - Example env file
- ✅ `client/src/config/api.js` - API configuration
- ✅ `backend/server.js` - Updated CORS and PORT
- ✅ `backend/.env` - Added FRONTEND_URL and PORT
- ✅ `update-api-urls.js` - Script to update all API URLs
- ✅ `DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- ✅ `RENDER_DEPLOYMENT_STEPS.md` - Step-by-step Render guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - This checklist

### Environment Variables Summary:

**Backend (.env)**:
- MONGO_URL
- JWT_SECRET
- CLOUD_NAME
- CLOUD_API_KEY
- CLOUD_API_SECRET
- FRONTEND_URL (add after frontend deployment)
- PORT

**Frontend (.env)**:
- VITE_API_URL (your backend URL)

## 🆘 Need Help?

Check these files:
1. `RENDER_DEPLOYMENT_STEPS.md` - Quick step-by-step guide
2. `DEPLOYMENT_GUIDE.md` - Detailed deployment information

## 🎉 After Successful Deployment

1. Share your frontend URL with users
2. Test all features thoroughly
3. Monitor Render logs for any errors
4. Consider upgrading to paid tier for better performance

---

**Total Estimated Time**: 30-40 minutes

**Cost**: Free (Render free tier)

**Note**: Free tier services spin down after inactivity. First request after inactivity may take 30-60 seconds.
