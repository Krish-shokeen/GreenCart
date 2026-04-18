const User = require("../models/user");
const TempUser = require("../models/tempUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generateOTP, sendOTPEmail, sendPasswordResetEmail } = require("../utils/emailService");

// -------- Google OAuth --------
exports.googleAuth = async (req, res) => {
  try {
    const { googleId, email, name, profilePic, role, phone, location, address, bio } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ message: "Invalid Google credentials" });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    let isNewUser = false;

    if (user) {
      // Existing user - link Google if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        user.isEmailVerified = true;
        if (profilePic && user.profilePic === "https://cdn-icons-png.flaticon.com/512/3135/3135715.png") {
          user.profilePic = profilePic;
        }
        await user.save();
      }
    } else {
      // New user - role must be provided
      if (!role) {
        return res.status(200).json({ isNewUser: true, message: "Role selection required" });
      }
      isNewUser = true;
      user = await User.create({
        name: name || "User",
        email,
        googleId,
        authProvider: "google",
        profilePic: profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        role,
        phone: phone || "",
        location: location || "",
        address: address || "",
        bio: bio || "",
        isEmailVerified: true,
        password: null
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: isNewUser ? "Account created successfully" : "Google login successful",
      isNewUser,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
        location: user.location,
        address: user.address,
        phone: user.phone,
        rating: user.rating,
        totalRatings: user.totalRatings,
        totalSales: user.totalSales,
        memberSince: user.memberSince,
        isEmailVerified: true
      }
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists in User collection (verified users)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered and verified. Please login." });
    }

    // Check if there's a pending verification
    const existingTempUser = await TempUser.findOne({ email });
    if (existingTempUser) {
      // Delete old temp user and create new one (allows re-signup)
      await TempUser.deleteOne({ email });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Store user data temporarily with OTP
    await TempUser.create({
      name,
      email,
      password: hashedPassword,
      role: role || "buyer",
      otp
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Clean up temp user if email fails
      await TempUser.deleteOne({ email });
      return res.status(500).json({ 
        message: "Failed to send verification email. Please try again.",
        error: emailError.message 
      });
    }

    return res.status(201).json({
      message: existingTempUser 
        ? "New verification code sent to your email" 
        : "Verification code sent to your email",
      email: email,
      requiresVerification: true
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------- Login --------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    // Check password match
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
        location: user.location,
        address: user.address,
        phone: user.phone,
        rating: user.rating,
        totalRatings: user.totalRatings,
        totalSales: user.totalSales,
        memberSince: user.memberSince
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);   // <--- ADD THIS FOR DEBUGGING
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // from JWT middleware

        const { name, bio, profilePic, location, address, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, bio, profilePic, location, address, phone },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePic: updatedUser.profilePic,
                bio: updatedUser.bio,
                location: updatedUser.location,
                address: updatedUser.address,
                phone: updatedUser.phone,
                rating: updatedUser.rating,
                totalRatings: updatedUser.totalRatings,
                totalSales: updatedUser.totalSales,
                memberSince: updatedUser.memberSince
            }
        });

    } catch (err) {
        console.error("UPDATE PROFILE ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// -------- Verify OTP --------
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find temp user with matching email and OTP
    const tempUser = await TempUser.findOne({ email, otp });

    if (!tempUser) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Create actual user account now
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      isEmailVerified: true
    });

    // Delete temp user after successful verification
    await TempUser.deleteOne({ email });

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Email verified successfully! Account created.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
        location: user.location,
        address: user.address,
        phone: user.phone,
        rating: user.rating,
        totalRatings: user.totalRatings,
        totalSales: user.totalSales,
        memberSince: user.memberSince,
        isEmailVerified: true
      }
    });

  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------- Resend OTP --------
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if temp user exists
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({ message: "No pending verification found. Please sign up again." });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Update temp user with new OTP
    tempUser.otp = otp;
    tempUser.createdAt = Date.now(); // Reset expiry timer
    await tempUser.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, tempUser.name);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    return res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};


// -------- Check Email Availability --------
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check in User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ 
        available: false, 
        message: "Email already registered",
        verified: true
      });
    }

    // Check in TempUser collection
    const existingTempUser = await TempUser.findOne({ email });
    if (existingTempUser) {
      return res.status(200).json({ 
        available: false, 
        message: "Email has pending verification",
        verified: false,
        canResignup: true
      });
    }

    return res.status(200).json({ 
      available: true, 
      message: "Email is available" 
    });

  } catch (err) {
    console.error("Check email error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// -------- Get User/Seller Profile --------
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get user profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------- Check if user has password set --------
exports.getPasswordStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("password authProvider");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ hasPassword: !!user.password });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, resetToken, user.name);

    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------- Reset Password (via email link) --------
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------- Change / Set Password (from dashboard) --------
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // If user has a password, verify current one
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: user.password ? "Password changed successfully" : "Password set successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
