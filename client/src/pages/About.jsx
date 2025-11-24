import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config/api";

export default function About() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [myFeedback, setMyFeedback] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApprovedFeedback();
    if (token) {
      fetchMyFeedback();
    }
  }, []);

  const fetchApprovedFeedback = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/feedback/approved`);
      setFeedbacks(res.data.feedback);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const fetchMyFeedback = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/feedback/my-feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyFeedback(res.data.feedback);
      if (res.data.feedback) {
        setRating(res.data.feedback.rating);
        setComment(res.data.feedback.comment);
        setCategory(res.data.feedback.category);
      }
    } catch (err) {
      console.error("Error fetching my feedback:", err);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert("Please login to submit feedback");
      window.location.href = "/login";
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = myFeedback ? "/api/feedback" : "/api/feedback";
      const method = myFeedback ? "put" : "post";
      
      const res = await axios[method](
        `${API_URL}${endpoint}`,
        { rating, comment, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setShowFeedbackForm(false);
      fetchMyFeedback();
      fetchApprovedFeedback();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!confirm("Are you sure you want to delete your feedback?")) return;

    try {
      await axios.delete(`${API_URL}/api/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Feedback deleted successfully");
      setMyFeedback(null);
      setRating(5);
      setComment("");
      setCategory("general");
      fetchApprovedFeedback();
    } catch (err) {
      alert("Failed to delete feedback");
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(Math.round(rating));
  };

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1 className="about-title">About GreenCart</h1>
        <p className="about-subtitle">
          Building a sustainable future, one purchase at a time
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <div className="about-text">
            <h2>🌿 Our Mission</h2>
            <p>
              GreenCart is more than just a marketplace—it's a movement towards conscious consumption. 
              We connect eco-conscious buyers with local sellers who share our passion for sustainability, 
              handmade craftsmanship, and environmental responsibility.
            </p>
            <p>
              Every product on our platform tells a story of care, creativity, and commitment to our planet. 
              From recycled materials to organic ingredients, we're building a community that values quality 
              over quantity and sustainability over convenience.
            </p>
          </div>
          <div className="about-image">
            <div className="image-placeholder">🌍</div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">♻️</div>
              <h3>Sustainability</h3>
              <p>
                We prioritize eco-friendly products and practices that minimize environmental impact 
                and promote a circular economy.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Community</h3>
              <p>
                Supporting local artisans and small businesses to create meaningful connections 
                between makers and buyers.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Quality</h3>
              <p>
                Every product is carefully curated to ensure it meets our high standards for 
                craftsmanship and sustainability.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Transparency</h3>
              <p>
                We believe in honest communication about product origins, materials, and 
                environmental impact.
              </p>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Local Sellers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Products Sold</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Eco-Friendly</div>
            </div>
          </div>
        </section>

        <section className="story-section">
          <h2>Our Story</h2>
          <div className="story-content">
            <p>
              GreenCart was born from a simple idea: what if shopping could be a force for good? 
              Founded in 2024, we started as a small community of eco-conscious individuals who 
              wanted to make sustainable living accessible to everyone.
            </p>
            <p>
              Today, we're proud to be a thriving marketplace that connects thousands of buyers 
              with local artisans, organic farmers, and sustainable brands. Every purchase on 
              GreenCart supports small businesses, reduces carbon footprint, and contributes to 
              a healthier planet.
            </p>
            <p>
              Join us in creating a greener tomorrow—because every choice matters, and together, 
              we can make a difference.
            </p>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>Join our community of conscious consumers and sustainable sellers</p>
          <div className="cta-buttons">
            <button className="cta-btn-primary" onClick={() => window.location.href = '/shop'}>
              Start Shopping
            </button>
            <button className="cta-btn-secondary" onClick={() => window.location.href = '/signup'}>
              Become a Seller
            </button>
          </div>
        </section>

        {/* Community Feedback Section */}
        <section className="feedback-section">
          <h2>Community Feedback</h2>
          <div className="feedback-header">
            <div className="overall-rating">
              <div className="rating-number">{averageRating}</div>
              <div className="rating-stars">{renderStars(averageRating)}</div>
              <div className="rating-count">Based on {totalReviews} reviews</div>
            </div>
            
            {token && (
              <div className="feedback-actions">
                {myFeedback ? (
                  <>
                    <button 
                      className="btn-edit-feedback"
                      onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                    >
                      {showFeedbackForm ? "Cancel" : "Edit Your Review"}
                    </button>
                    <button 
                      className="btn-delete-feedback"
                      onClick={handleDeleteFeedback}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn-add-feedback"
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  >
                    {showFeedbackForm ? "Cancel" : "Write a Review"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Feedback Form */}
          {showFeedbackForm && (
            <div className="feedback-form-container">
              <form onSubmit={handleSubmitFeedback} className="feedback-form">
                <h3>{myFeedback ? "Update Your Review" : "Share Your Experience"}</h3>
                
                <div className="form-group">
                  <label>Rating</label>
                  <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${rating >= star ? "active" : ""}`}
                        onClick={() => setRating(star)}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="feedback-category"
                  >
                    <option value="general">General</option>
                    <option value="user_experience">User Experience</option>
                    <option value="product_quality">Product Quality</option>
                    <option value="customer_service">Customer Service</option>
                    <option value="sustainability">Sustainability</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about GreenCart..."
                    required
                    rows="5"
                    className="feedback-textarea"
                  />
                </div>

                <button type="submit" className="btn-submit-feedback" disabled={submitting}>
                  {submitting ? "Submitting..." : myFeedback ? "Update Review" : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          {/* Display Feedbacks */}
          <div className="feedbacks-list">
            {feedbacks.length === 0 ? (
              <p className="no-feedback">No reviews yet. Be the first to share your experience!</p>
            ) : (
              feedbacks.map((feedback) => (
                <div key={feedback._id} className="feedback-card">
                  <div className="feedback-header-card">
                    <div className="feedback-user">
                      <img 
                        src={feedback.user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                        alt={feedback.user?.name}
                        className="feedback-user-pic"
                      />
                      <div>
                        <div className="feedback-user-name">{feedback.user?.name}</div>
                        <div className="feedback-date">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="feedback-rating-display">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  <div className="feedback-category-badge">{feedback.category.replace("_", " ")}</div>
                  <p className="feedback-comment">{feedback.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
