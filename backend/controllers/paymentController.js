const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ 
        message: "Invalid amount. Amount should be at least ₹1" 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(201).json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// Verify Razorpay Payment
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id // Our internal order ID
    } = req.body;

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Update order status in database
    if (order_id) {
      await Order.findByIdAndUpdate(order_id, {
        status: 'processing',
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentStatus: 'completed'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Get Payment Details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { payment_id } = req.params;

    const payment = await razorpay.payments.fetch(payment_id);

    return res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Get payment details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

// Refund Payment
exports.refundPayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { amount, reason = 'requested_by_customer' } = req.body;

    const refund = await razorpay.payments.refund(payment_id, {
      amount: amount ? Math.round(amount * 100) : undefined, // Full refund if amount not specified
      speed: 'normal',
      notes: {
        reason: reason
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      refund
    });

  } catch (error) {
    console.error('Refund error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
};

// Webhook handler for Razorpay events
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookBody = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        // Payment successful
        console.log('Payment captured:', paymentEntity.id);
        break;
      
      case 'payment.failed':
        // Payment failed
        console.log('Payment failed:', paymentEntity.id);
        break;
      
      case 'refund.processed':
        // Refund processed
        console.log('Refund processed:', paymentEntity.id);
        break;
      
      default:
        console.log('Unhandled webhook event:', event);
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Webhook processing failed' });
  }
};