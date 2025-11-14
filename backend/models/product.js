const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }], // ["organic", "handmade", "recycled"]
  images: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stock: { type: Number, default: 1 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
