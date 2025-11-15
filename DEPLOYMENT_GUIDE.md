# GreenCart Deployment Guide for Render

## Backend Deployment

### 1. Prepare Backend for Deployment

Your backend `.env` file should have:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=6969
```

### 2. Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: greencart-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables in Render:
   - MONGO_URL
   - JWT_SECRET
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - PORT=6969

6. Click "Create Web Service"
7. Wait for deployment (you'll get a URL like: `https://greencart-backend.onrender.com`)

## Frontend Deployment

### 1. Update Frontend Environment Variable

Once your backend is deployed, update `client/.env`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url.onrender.com` with your actual Render backend URL.

### 2. Update All API Calls

I've created a config file at `client/src/config/api.js`. You need to update all files to use this config.

**Files that need updating:**
- client/src/pages/Login.jsx ✅ (Already updated)
- client/src/pages/Signup.jsx
- client/src/pages/Dashboard.jsx
- client/src/pages/Shop.jsx
- client/src/pages/ProductDetail.jsx
- client/src/pages/AddProduct.jsx
- client/src/pages/EditProduct.jsx
- client/src/pages/MyProducts.jsx
- client/src/pages/Cart.jsx
- client/src/pages/Checkout.jsx
- client/src/pages/Payment.jsx
- client/src/pages/Orders.jsx
- client/src/pages/OrderDetail.jsx
- client/src/pages/SellerProfile.jsx

**Pattern to follow:**

1. Add import at the top:
```javascript
import API_URL from "../config/api";
```

2. Replace all instances of:
```javascript
"http://localhost:6969/api/..."
```

With:
```javascript
`${API_URL}/api/...`
```

### 3. Deploy Frontend on Render

1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: greencart-frontend
   - **Root Directory**: client
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist
   - **Plan**: Free

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com`

6. Click "Create Static Site"

## Quick Update Script

Run this in your terminal to update all API URLs:

```bash
# Navigate to client directory
cd client

# Find and replace (use with caution)
# For Mac/Linux:
find src/pages -name "*.jsx" -exec sed -i '' 's|"http://localhost:6969|`${API_URL}|g' {} +
find src/pages -name "*.jsx" -exec sed -i '' 's|/api/|/api/|g' {} +

# For Windows (PowerShell):
Get-ChildItem -Path src/pages -Filter *.jsx -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace '"http://localhost:6969', '`${API_URL}' | Set-Content $_.FullName
}
```

## Important Notes

1. **CORS**: Make sure your backend allows requests from your frontend URL
2. **Environment Variables**: Never commit `.env` files to Git
3. **Free Tier Limitations**: Render free tier spins down after inactivity
4. **Build Time**: First deployment may take 5-10 minutes

## Testing

After deployment:
1. Test login/signup
2. Test product listing
3. Test cart functionality
4. Test checkout process
5. Test order management

## Troubleshooting

- **CORS Error**: Add frontend URL to backend CORS configuration
- **API Not Found**: Check VITE_API_URL is set correctly
- **Build Fails**: Check all dependencies are in package.json
- **Images Not Loading**: Verify Cloudinary credentials

## Support

For issues, check:
- Render logs (in dashboard)
- Browser console for frontend errors
- Network tab for API call failures
