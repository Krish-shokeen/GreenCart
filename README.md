# 🌿 GreenCart — Local Sustainable Marketplace

A full-stack e-commerce platform connecting eco-conscious buyers with sustainable local sellers.

## Tech Stack

**Frontend:** React + Vite, React Router, Axios, Firebase Auth  
**Backend:** Node.js, Express, MongoDB (Mongoose)  
**Payments:** Razorpay  
**Storage:** Cloudinary  
**Email:** Nodemailer (Gmail)  

## Features

- 🔐 Email/password auth with OTP verification
- 🔑 Google Sign-In via Firebase
- 🛒 Cart, Checkout, Orders with cancellation
- 💳 Razorpay payment gateway + Cash on Delivery
- 🏪 Seller profiles with ratings and reviews
- 📦 Product management (CRUD) for sellers
- 📧 Contact form with email notifications
- 🌟 Website feedback/rating system
- 📱 Fully responsive design
- 🔒 Password change / reset via email

## Setup

### Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

```bash
npm start
```

### Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:6969
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
npm run dev
```

## Deployment

- Backend: [Render](https://render.com)
- Frontend: [Render Static Site](https://render.com)

Live: https://greencart-1-s3ka.onrender.com
