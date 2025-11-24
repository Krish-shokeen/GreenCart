const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addFeedback,
  updateFeedback,
  getApprovedFeedback,
  getMyFeedback,
  deleteFeedback,
  approveFeedback,
  getAllFeedback
} = require("../controllers/feedbackController");

// Public routes
router.get("/approved", getApprovedFeedback);

// Protected routes (require authentication)
router.post("/", authMiddleware, addFeedback);
router.put("/", authMiddleware, updateFeedback);
router.get("/my-feedback", authMiddleware, getMyFeedback);
router.delete("/", authMiddleware, deleteFeedback);

// Admin routes (you can add admin middleware later)
router.put("/approve/:feedbackId", authMiddleware, approveFeedback);
router.get("/all", authMiddleware, getAllFeedback);

module.exports = router;
