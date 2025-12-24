import { useState } from "react";
import axios from "axios";
import API_URL from "../config/api";
import { useToast } from "../components/Toast";

export default function Contact() {
  const showToast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, we'll use a simple mailto approach as backup
      // and also try the API
      
      try {
        const res = await axios.post(`${API_URL}/api/contact`, formData);
        showToast("✅ Message sent successfully! We'll get back to you soon.", "success");
        setSubmitted(true);
        
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", subject: "", message: "" });
        }, 5000);
        
      } catch (apiError) {
        console.log("API failed, using fallback method");
        
        // Fallback: Create mailto link and show instructions
        const mailtoLink = `mailto:krishshokeen55@gmail.com?subject=GreenCart Contact: ${formData.subject}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ASubject: ${formData.subject}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
        
        // Open mailto link
        window.open(mailtoLink, '_blank');
        
        showToast("📧 Opening your email client to send the message...", "info");
        setSubmitted(true);
        
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", subject: "", message: "" });
        }, 5000);
      }
      
    } catch (err) {
      console.error("Contact form error:", err);
      showToast("❌ Failed to send message. Please try again or email us directly.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          We'd love to hear from you! Whether you have questions, feedback, or just want to say hello.
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info-section">
          <h2>Contact Information</h2>
          
          <div className="contact-info-cards">
            <div className="contact-info-card">
              <div className="contact-icon">📧</div>
              <h3>Email Us</h3>
              <p>krishshokeen55@gmail.com</p>
              <p className="contact-detail">We'll respond within 24 hours</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">📞</div>
              <h3>Call Us</h3>
              <p>+91 98731 23485</p>
              <p className="contact-detail">Mon-Fri, 9AM-6PM IST</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">📍</div>
              <h3>Visit Us</h3>
              <p>Roshanpura, Najafgarh</p>
              <p className="contact-detail">New Delhi - 110043</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">💬</div>
              <h3>Instagram</h3>
              <div className="social-links">
                <a href="https://www.instagram.com/krish_shokeen_27/" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">📷</span>
                </a>
              </div>
              <p className="contact-detail">@krish_shokeen_27</p>
            </div>
          </div>

          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-list">
              <div className="faq-item">
                <h4>🛍️ How do I place an order?</h4>
                <p>Browse our shop, add items to cart, and proceed to checkout. It's that simple!</p>
              </div>
              <div className="faq-item">
                <h4>🚚 What are the shipping options?</h4>
                <p>We offer free standard shipping on all orders. Express shipping is available at checkout.</p>
              </div>
              <div className="faq-item">
                <h4>♻️ Are all products eco-friendly?</h4>
                <p>Yes! Every product on GreenCart meets our sustainability standards.</p>
              </div>
              <div className="faq-item">
                <h4>🏪 How can I become a seller?</h4>
                <p>Sign up for a seller account and start listing your sustainable products today!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Message Sent!</h3>
              <p>Thank you for contacting us. We'll get back to you soon.</p>
            </div>
          ) : (
            <div>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="seller">Seller Questions</option>
                    <option value="technical">Technical Issue</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
              
              <div className="alternative-contact">
                <p>Or send us an email directly:</p>
                <button 
                  type="button" 
                  className="email-direct-btn"
                  onClick={() => {
                    const mailtoLink = `mailto:krishshokeen55@gmail.com?subject=GreenCart Contact: ${formData.subject || 'General Inquiry'}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
                    window.open(mailtoLink, '_blank');
                  }}
                >
                  📧 Open Email Client
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
