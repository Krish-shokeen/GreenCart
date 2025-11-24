# 📧 OTP Email Verification Setup Guide

## ✅ What I've Implemented

### Backend:
1. ✅ Email service with Nodemailer (`backend/utils/emailService.js`)
2. ✅ OTP model with auto-expiry (`backend/models/otp.js`)
3. ✅ Updated User model with `isEmailVerified` field
4. ✅ OTP generation and verification in auth controller
5. ✅ New API endpoints: `/verify-otp` and `/resend-otp`

### Frontend:
1. ✅ Beautiful OTP verification page
2. ✅ Auto-focus and paste support
3. ✅ Resend OTP with countdown timer
4. ✅ Toast notifications for feedback
5. ✅ Updated signup flow

## 🔧 Setup Steps

### Step 1: Install Nodemailer

```bash
cd backend
npm install nodemailer
```

### Step 2: Set Up Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. Search for **App passwords**
5. Click **App passwords**
6. Select:
   - App: **Mail**
   - Device: **Other** (type "GreenCart")
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this!)

### Step 3: Update Backend .env

Edit `backend/.env` and add:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Example:**
```env
EMAIL_USER=krishshokeen55@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### Step 4: Update Environment Variables on Render

1. Go to https://dashboard.render.com/
2. Click on your **backend service**
3. Go to **Environment** tab
4. Add these variables:
   - Key: `EMAIL_USER`, Value: `your-email@gmail.com`
   - Key: `EMAIL_PASS`, Value: `your-app-password`
5. Click **Save Changes**

### Step 5: Commit and Deploy

```bash
git add .
git commit -m "Add OTP email verification"
git push
```

Wait for Render to redeploy (3-5 minutes).

## 🎯 How It Works

### Signup Flow:

1. **User signs up** → Account created (not verified)
2. **OTP generated** → 6-digit code created
3. **Email sent** → Beautiful email with OTP
4. **User redirected** → OTP verification page
5. **User enters OTP** → Verification checked
6. **Success** → Account verified, logged in automatically

### Features:

- ✅ **6-digit OTP** - Easy to type
- ✅ **10-minute expiry** - Automatic cleanup
- ✅ **Resend option** - With 60-second cooldown
- ✅ **Auto-focus** - Smooth input experience
- ✅ **Paste support** - Can paste full OTP
- ✅ **Beautiful email** - Professional HTML template
- ✅ **Toast notifications** - User-friendly feedback

## 📧 Email Template

The OTP email includes:
- GreenCart branding
- User's name
- 6-digit code in large font
- Expiry notice (10 minutes)
- Professional styling

## 🧪 Testing

### Test Locally:

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd client && npm run dev`
3. Go to signup page
4. Create account
5. Check your email for OTP
6. Enter OTP on verification page

### Test on Render:

1. Make sure EMAIL_USER and EMAIL_PASS are set
2. Go to your deployed site
3. Sign up with a real email
4. Check email for OTP
5. Verify and login

## 🔒 Security Features

- ✅ OTP expires after 10 minutes
- ✅ OTP deleted after successful verification
- ✅ Rate limiting on resend (60 seconds)
- ✅ Email validation
- ✅ Secure password hashing

## 📱 User Experience

### OTP Page Features:
- Auto-focus on first input
- Tab to next input automatically
- Backspace to previous input
- Paste full OTP at once
- Visual feedback on filled inputs
- Countdown timer for resend
- Error handling with toast notifications

## 🐛 Troubleshooting

### Email Not Sending:

1. **Check Gmail settings:**
   - 2FA enabled?
   - App password generated?
   - Correct email/password in .env?

2. **Check backend logs:**
   - Look for "OTP sent to..." message
   - Check for email errors

3. **Check spam folder:**
   - OTP emails might go to spam initially

### OTP Not Working:

1. **Check expiry:**
   - OTP expires after 10 minutes
   - Request new OTP if expired

2. **Check database:**
   - OTP should be in `otps` collection
   - Check if OTP matches

### Common Errors:

**"Invalid credentials" (Gmail):**
- Use app password, not regular password
- Remove spaces from app password

**"Failed to send OTP":**
- Check EMAIL_USER and EMAIL_PASS are set
- Check internet connection
- Try different email service if Gmail blocks

## 🎨 Customization

### Change OTP Length:

Edit `backend/utils/emailService.js`:
```javascript
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
};
```

### Change Expiry Time:

Edit `backend/models/otp.js`:
```javascript
expires: 300 // 5 minutes (in seconds)
```

### Change Email Template:

Edit the HTML in `backend/utils/emailService.js` → `sendOTPEmail` function.

## 📊 Database Collections

### OTPs Collection:
```javascript
{
  email: "user@example.com",
  otp: "123456",
  createdAt: Date,
  // Auto-deleted after 10 minutes
}
```

### Users Collection (Updated):
```javascript
{
  name: "John Doe",
  email: "user@example.com",
  password: "hashed",
  isEmailVerified: true, // NEW FIELD
  // ... other fields
}
```

## 🚀 Next Steps

After OTP is working:

1. ✅ Test with real email
2. ✅ Deploy to Render
3. ✅ Monitor email delivery
4. ✅ Consider adding:
   - Email templates for other actions
   - SMS OTP as backup
   - Social login integration

## 📝 API Endpoints

### POST /api/auth/signup
- Creates user
- Sends OTP email
- Returns user data

### POST /api/auth/verify-otp
- Verifies OTP
- Marks email as verified
- Returns token and user data

### POST /api/auth/resend-otp
- Generates new OTP
- Sends new email
- Deletes old OTPs

## ✨ Success!

Your OTP email verification system is now complete! Users will receive professional emails with verification codes when they sign up.

**Remember to set EMAIL_USER and EMAIL_PASS in your .env files!**
