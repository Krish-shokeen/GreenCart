# 📧 OTP Verification Flow - How It Works

## ✅ Current Implementation

### User is NOT stored until verification is complete!

## 📊 Step-by-Step Flow

### Step 1: User Signs Up
**Frontend:** User fills signup form
```
Name: John Doe
Email: john@example.com
Password: ******
Role: buyer
```

**Backend Action:**
- ❌ Does NOT create account in `User` collection
- ✅ Stores data temporarily in `TempUser` collection
- ✅ Generates 6-digit OTP
- ✅ Sends OTP email

**Database State:**
```
TempUser Collection:
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "buyer",
  otp: "123456",
  createdAt: Date (expires in 10 minutes)
}

User Collection:
(empty - no account created yet)
```

**User Sees:**
- Toast: "✓ Verification code sent! Please check your email."
- Redirected to OTP verification page

---

### Step 2: User Receives Email
**Email Contains:**
- Welcome message
- 6-digit OTP code
- "This code will expire in 10 minutes"

---

### Step 3: User Enters OTP
**Frontend:** User enters 6-digit code

**Backend Action:**
1. ✅ Finds TempUser with matching email and OTP
2. ✅ **NOW creates account** in `User` collection
3. ✅ Deletes TempUser entry
4. ✅ Generates JWT token
5. ✅ Returns user data and token

**Database State:**
```
TempUser Collection:
(deleted - no longer needed)

User Collection:
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "buyer",
  isEmailVerified: true,
  createdAt: Date
}
```

**User Sees:**
- Toast: "✓ Email verified! Account created successfully!"
- Automatically logged in
- Redirected to dashboard

---

## 🔄 Alternative Scenarios

### Scenario A: User Doesn't Verify (Expires)
**What Happens:**
- TempUser entry expires after 10 minutes
- MongoDB automatically deletes it
- No account is created
- User can sign up again with same email

### Scenario B: User Tries to Sign Up Again (Before Verification)
**What Happens:**
- Old TempUser entry is deleted
- New TempUser entry is created
- New OTP is sent
- User can verify with new OTP

### Scenario C: Invalid OTP
**What Happens:**
- Returns error: "Invalid or expired OTP"
- TempUser remains (user can try again)
- User can request resend OTP

### Scenario D: User Resends OTP
**What Happens:**
- Generates new OTP
- Updates TempUser with new OTP
- Resets 10-minute expiry timer
- Sends new email

---

## 🔒 Security Features

1. **No Account Until Verified**
   - User data stored temporarily
   - Account only created after OTP verification

2. **Auto-Expiry**
   - TempUser expires after 10 minutes
   - Prevents database clutter

3. **One-Time Use**
   - OTP deleted after successful verification
   - Cannot be reused

4. **Hashed Password**
   - Password hashed before storing in TempUser
   - Never stored in plain text

5. **Email Ownership Proof**
   - Must have access to email to verify
   - Prevents fake accounts

---

## 📝 Messages Shown to User

### During Signup:
- ❌ NOT: "Account created!"
- ✅ YES: "Verification code sent! Please check your email."

### During Verification:
- Button text: "Verify Email"
- Loading: "Verifying..."

### After Verification:
- ❌ NOT: "Email verified successfully!"
- ✅ YES: "Email verified! Account created successfully!"

---

## 🗄️ Database Collections

### TempUser (Temporary Storage)
**Purpose:** Store unverified user data
**Lifetime:** 10 minutes
**Fields:**
- name
- email
- password (hashed)
- role
- otp
- createdAt (with TTL index)

### User (Permanent Storage)
**Purpose:** Store verified user accounts
**Lifetime:** Permanent
**Fields:**
- name
- email
- password (hashed)
- role
- isEmailVerified (always true)
- profilePic
- bio
- location
- rating
- createdAt
- updatedAt

---

## ✅ Summary

**Before OTP Verification:**
- ❌ No account in User collection
- ✅ Temporary data in TempUser collection
- ❌ Cannot login
- ❌ No access to app features

**After OTP Verification:**
- ✅ Account created in User collection
- ❌ TempUser data deleted
- ✅ Can login
- ✅ Full access to app features

**This ensures only verified email addresses can create accounts!** 🔒
