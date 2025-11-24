# 📧 Gmail App Password Setup Guide

## ⚠️ Important: You MUST use App Password, not regular password!

Gmail blocks regular passwords for security. You need to generate an App-Specific Password.

## 🔧 Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication

1. Go to: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click on **"2-Step Verification"**
4. Follow the steps to enable it (if not already enabled)

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or search for "App passwords" in Google Account settings
2. You might need to sign in again
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Other (Custom name)"**
5. Type: **"GreenCart"**
6. Click **"Generate"**

### Step 3: Copy the Password

You'll see a 16-character password like:
```
abcd efgh ijkl mnop
```

**IMPORTANT:** Copy this password! You won't see it again.

### Step 4: Update Your .env File

Edit `backend/.env`:

```env
EMAIL_USER=service69greencart@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Note:** Remove spaces from the app password!

### Step 5: Restart Your Server

```bash
# Stop the server (Ctrl+C)
# Start again
cd backend
npm start
```

## 🧪 Test Email Sending

Try signing up with a real email address and check if you receive the OTP.

## 🐛 Troubleshooting

### Error: "Invalid login"
- ✅ Make sure 2FA is enabled
- ✅ Use App Password, not regular password
- ✅ Remove spaces from app password
- ✅ Check EMAIL_USER is correct

### Error: "Username and Password not accepted"
- ✅ Generate a new App Password
- ✅ Make sure you're using the email that generated the app password

### Still Not Working?

Try these alternatives:

#### Option 1: Use a Different Gmail Account
Create a new Gmail account specifically for sending emails.

#### Option 2: Use SendGrid (Free Alternative)
1. Sign up at: https://sendgrid.com/
2. Get API key
3. Update email service to use SendGrid

#### Option 3: Use Mailtrap (For Testing)
1. Sign up at: https://mailtrap.io/
2. Get SMTP credentials
3. Use for development/testing

## 📝 Current Configuration

Your current email: `service69greencart@gmail.com`

**Action Required:**
1. Enable 2FA on this account
2. Generate App Password
3. Update EMAIL_PASS in .env with the app password

## ✅ Verification

After setup, you should see in backend logs:
```
OTP sent successfully to user@example.com
```

If you see errors, check the troubleshooting section above.

## 🔒 Security Notes

- ✅ Never commit .env file to Git
- ✅ Use different credentials for production
- ✅ App passwords are safer than regular passwords
- ✅ You can revoke app passwords anytime

## 🚀 For Render Deployment

Don't forget to add these to Render environment variables:
- `EMAIL_USER`: service69greencart@gmail.com
- `EMAIL_PASS`: your-app-password (no spaces)
