const User = require("../models/user");
const TempUser = require("../models/tempUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail } = require("../utils/emailService");

// -------- Signup --------
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
      console.log(`Deleted old pending verification for ${email}`);
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
      console.log(`OTP sent successfully to ${email}`);
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
      console.log(`OTP resent successfully to ${email}`);
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
