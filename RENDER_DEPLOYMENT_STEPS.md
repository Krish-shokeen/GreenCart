# Quick Deployment Steps for Render

## Step 1: Update API URLs in Frontend

Run this command from the project root:

```bash
node update-api-urls.js
```

This will automatically update all files to use the environment variable.

## Step 2: Deploy Backend

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Name**: greencart-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
5. Add these Environment Variables:
   ```
   MONGO_URL=<your_mongodb_url>
   JWT_SECRET=<your_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   PORT=6969
   ```

6. Click "Create Web Service"
7. **COPY YOUR BACKEND URL** (e.g., `https://greencart-backend-xyz.onrender.com`)

## Step 3: Update Frontend Environment Variable

Edit `client/.env`:

```env
VITE_API_URL=https://your-backend-url-from-step2.onrender.com
```

**Important**: Replace with your actual backend URL from Step 2!

## Step 4: Deploy Frontend

1. Go back to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect same GitHub repo
4. Settings:
   - **Name**: greencart-frontend
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url-from-step2.onrender.com
   ```

6. Click "Create Static Site"

## Step 5: Update Backend CORS (Important!)

After frontend is deployed, you'll get a URL like:
`https://greencart-frontend-xyz.onrender.com`

Update `backend/server.js` to allow this URL:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://greencart-frontend-xyz.onrender.com'  // Add your frontend URL
  ],
  credentials: true
}));
```

Commit and push this change - Render will auto-redeploy.

## Done! 🎉

Your app should now be live at:
- Frontend: `https://greencart-frontend-xyz.onrender.com`
- Backend: `https://greencart-backend-xyz.onrender.com`

## Testing Checklist

- [ ] Can access homepage
- [ ] Can signup/login
- [ ] Can view products
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can view orders
- [ ] Images load correctly

## Troubleshooting

**Problem**: CORS error
**Solution**: Make sure backend CORS includes your frontend URL

**Problem**: API calls fail
**Solution**: Check VITE_API_URL is set correctly in Render environment variables

**Problem**: Images don't load
**Solution**: Verify Cloudinary credentials in backend environment variables

**Problem**: Site is slow
**Solution**: Free tier spins down after inactivity - first request may be slow
