# 🚀 GreenCart Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password
- Render account (or similar hosting service)

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=6969

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL for CORS
FRONTEND_URL=your_frontend_deployment_url
```

### Frontend (.env)
```env
VITE_API_URL=your_backend_deployment_url
```

## 🌐 Deployment Steps

### 1. Backend Deployment (Render)

1. **Create New Web Service** on Render
2. **Connect GitHub Repository**
3. **Configure Build Settings:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: `/`

4. **Add Environment Variables** in Render Dashboard:
   - All variables from backend .env file
   - Make sure EMAIL_USER and EMAIL_PASS are set for contact form

5. **Deploy** and note the backend URL

### 2. Frontend Deployment (Render/Netlify/Vercel)

1. **Update Frontend .env:**
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. **Build and Deploy:**
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`

3. **Configure Redirects** (for SPA routing):
   Create `client/public/_redirects`:
   ```
   /*    /index.html   200
   ```

### 3. Update CORS Settings

Update backend .env with your frontend URL:
```env
FRONTEND_URL=https://your-frontend-url.netlify.app
```

## 🔍 Testing Deployment

1. **Backend Health Check:**
   ```
   GET https://your-backend-url.onrender.com/
   ```

2. **Frontend Access:**
   - Visit your frontend URL
   - Test user registration with OTP
   - Test contact form
   - Test product creation and cart functionality

## 📧 Email Configuration

### Gmail App Password Setup:
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account Settings
3. Security → 2-Step Verification → App Passwords
4. Generate password for "Mail"
5. Use this password in EMAIL_PASS

## 🛠️ Local Development

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd client
npm install
npm run dev
```

## 📝 Production Checklist

- ✅ All environment variables configured
- ✅ MongoDB Atlas connection working
- ✅ Cloudinary images uploading
- ✅ Email service sending OTPs and contact forms
- ✅ CORS configured for frontend domain
- ✅ Frontend pointing to production backend
- ✅ All features tested in production

## 🔒 Security Notes

- Never commit .env files
- Use strong JWT secrets
- Keep API keys secure
- Enable MongoDB IP whitelist
- Use HTTPS in production

## 📞 Support

For deployment issues, check:
1. Server logs in Render dashboard
2. Browser console for frontend errors
3. Network tab for API call failures
4. Environment variables are correctly set

---

**🌿 GreenCart is now ready for production!**