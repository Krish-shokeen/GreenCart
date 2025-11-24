const WebsiteFeedback = require("../models/websiteFeedback");

// Add Website Feedback
exports.addFeedback = async (req, res) => {
  try {
    const { rating, comment, category } = req.body;

    // Check if user already submitted feedback
    const existing = await WebsiteFeedback.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted feedback. You can update it instead." });
    }

    const feedback = await WebsiteFeedback.create({
      user: req.user.id,
      rating,
      comment,
      category: category || "general",
      isApproved: false
    });

    return res.status(201).json({ 
      message: "Thank you for your feedback! It will be reviewed and published soon.", 
      feedback 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update Website Feedback
exports.updateFeedback = async (req, res) => {
  try {
    const { rating, comment, category } = req.body;

    const feedback = await WebsiteFeedback.findOne({ user: req.user.id });
    
    if (!feedback) {
      return res.status(404).json({ message: "No feedback found to update" });
    }

    feedback.rating = rating;
    feedback.comment = comment;
    feedback.category = category || feedback.category;
    feedback.isApproved = false; // Reset approval status on update
    await feedback.save();

    return res.status(200).json({ 
      message: "Feedback updated successfully!", 
      feedback 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get All Approved Feedback
exports.getApprovedFeedback = async (req, res) => {
  try {
    const feedback = await WebsiteFeedback.find({ isApproved: true })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate average rating
    const avgRating = feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
      : 0;

    return res.status(200).json({ 
      feedback,
      averageRating: avgRating.toFixed(1),
      totalReviews: feedback.length
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get User's Own Feedback
exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await WebsiteFeedback.findOne({ user: req.user.id });
    
    return res.status(200).json({ feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete Feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await WebsiteFeedback.findOne({ user: req.user.id });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await WebsiteFeedback.findByIdAndDelete(feedback._id);

    return res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin: Approve Feedback
exports.approveFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await WebsiteFeedback.findByIdAndUpdate(
      feedbackId,
      { isApproved: true },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.status(200).json({ message: "Feedback approved", feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get All Feedback (including pending)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await WebsiteFeedback.find()
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({ feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
