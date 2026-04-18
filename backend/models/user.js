const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null }, // null for Google OAuth users
    googleId: { type: String, default: null },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
    location: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    memberSince: { type: Date, default: Date.now },
    isEmailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
