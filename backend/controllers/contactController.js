const ContactMessage = require("../models/contactMessage");
const { sendContactEmail } = require("../utils/emailService");

// Submit Contact Form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Save to database
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent
    });

    // Send email notification to admin
    try {
      await sendContactEmail({
        name,
        email,
        subject,
        message,
        messageId: contactMessage._id,
        timestamp: contactMessage.createdAt
      });
    } catch (emailError) {
      console.error("Failed to send contact email:", emailError);
      // Don't fail the request if email fails, just log it
    }

    return res.status(201).json({
      message: "Message sent successfully! We'll get back to you soon.",
      messageId: contactMessage._id
    });

  } catch (err) {
    console.error("Contact form submission error:", err);
    return res.status(500).json({ 
      message: "Failed to send message. Please try again." 
    });
  }
};

// Get All Contact Messages (Admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({ messages });
  } catch (err) {
    console.error("Get messages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Mark Message as Read (Admin only)
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      messageId,
      { status: "read" },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ 
      message: "Message marked as read",
      data: message 
    });
  } catch (err) {
    console.error("Mark as read error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete Message (Admin only)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ContactMessage.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete message error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};