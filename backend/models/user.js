const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
    isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
