import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
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

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
