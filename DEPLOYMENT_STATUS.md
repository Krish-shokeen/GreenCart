# 🚀 GreenCart Deployment Status

## ✅ Completed Steps

### Backend Deployment
- ✅ Backend deployed to Render
- ✅ Backend URL: `https://greencart-1mlr.onrender.com`
- ✅ MongoDB connected
- ✅ Environment variables set on Render

### Frontend Configuration
- ✅ All API URLs updated to use environment variable
- ✅ `client/.env` updated with backend URL
- ✅ API configuration file created (`client/src/config/api.js`)

## 📋 Next Steps

### 1. Test Backend API (5 minutes)

Test if your backend is working by visiting these URLs in your browser:

**Health Check:**
```
https://greencart-1mlr.onrender.com/api/products
```

This should return a list of products (or empty array if no products yet).

**Note:** First request may take 30-60 seconds if the service was sleeping (free tier).

### 2. Deploy Frontend to Render (10 minutes)

1. Go to https://dashboard.render.com/
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `greencart-frontend` (or any name you prefer)
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **IMPORTANT:** Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://greencart-1mlr.onrender.com`

6. Click "Create Static Site"

### 3. Update Backend CORS (5 minutes)

After frontend is deployed, you'll get a URL like:
`https://greencart-frontend-xyz.onrender.com`

**Update on Render Backend:**
1. Go to your backend service on Render
2. Go to "Environment" tab
3. Add/Update environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-frontend-url.onrender.com`
4. Save (Render will auto-redeploy)

**OR Update locally and push:**

Edit `backend/.env`:
```env
FRONTEND_URL=https://your-frontend-url.onrender.com
```

Then commit and push to trigger redeployment.

## 🧪 Testing Checklist

After both are deployed, test these features:

- [ ] Homepage loads
- [ ] Can signup
- [ ] Can login
- [ ] Can view products in shop
- [ ] Can view product details
- [ ] Can add to cart
- [ ] Can view cart
- [ ] Can proceed to checkout
- [ ] Can complete payment
- [ ] Can view orders
- [ ] Can cancel order
- [ ] Images load correctly
- [ ] About page works
- [ ] Contact page works

## 📝 Your URLs

**Backend:** https://greencart-1mlr.onrender.com

**Frontend:** _______________________________________________
(Fill this in after deploying frontend)

## ⚠️ Important Notes

1. **Free Tier Spin Down**: Services on free tier spin down after 15 minutes of inactivity. First request will be slow (30-60 seconds).

2. **CORS**: Make sure to update FRONTEND_URL in backend after frontend deployment.

3. **Environment Variables**: 
   - Backend needs: MONGO_URL, JWT_SECRET, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, FRONTEND_URL, PORT
   - Frontend needs: VITE_API_URL

4. **Build Time**: Frontend build may take 3-5 minutes.

## 🆘 Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify all environment variables are set
- Test API endpoints directly

### Frontend Issues:
- Check browser console for errors
- Verify VITE_API_URL is set correctly
- Check Network tab for failed API calls

### CORS Errors:
- Make sure FRONTEND_URL is set in backend
- Verify the URL matches exactly (no trailing slashes)
- Check backend logs for CORS errors

## 🎉 Success!

Once everything is working:
1. Share your frontend URL with users
2. Monitor Render logs for any issues
3. Consider upgrading to paid tier for better performance

---

**Current Status:** Backend deployed ✅ | Frontend pending ⏳
