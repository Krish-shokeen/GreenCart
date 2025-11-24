const mongoose = require("mongoose");

const websiteFeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["user_experience", "product_quality", "customer_service", "sustainability", "general"],
    default: "general"
  },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("WebsiteFeedback", websiteFeedbackSchema);
