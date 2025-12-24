const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentDetails,
  refundPayment,
  handleWebhook
} = require("../controllers/paymentController");

// Create Razorpay order
router.post("/create-order", authMiddleware, createRazorpayOrder);

// Verify payment
router.post("/verify-payment", authMiddleware, verifyRazorpayPayment);

// Get payment details
router.get("/payment/:payment_id", authMiddleware, getPaymentDetails);

// Process refund
router.post("/refund/:payment_id", authMiddleware, refundPayment);

// Webhook endpoint (no auth required)
router.post("/webhook", handleWebhook);

// Get Razorpay key for frontend
router.get("/config", (req, res) => {
  res.json({
    key_id: process.env.RAZORPAY_KEY_ID
  });
});

module.exports = router;