const Review = require("../models/review");
const Product = require("../models/product");

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if user already reviewed
    const existing = await Review.findOne({ product: productId, user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      totalRatings: reviews.length
    });

    return res.status(201).json({ message: "Review added", review });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get Reviews for a Product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({ reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Recalculate product rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating,
      totalRatings: reviews.length
    });

    return res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
