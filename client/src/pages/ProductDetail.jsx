import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(res.data.product);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews/${id}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post(
        `${API_URL}/api/cart/add`,
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Added to cart!");
      setAddingToCart(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
      setAddingToCart(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to add a review");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/reviews`,
        { productId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Review added!");
      setComment("");
      setRating(5);
      fetchReviews();
      fetchProduct();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add review");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <img
          src={product.images[0] || "https://via.placeholder.com/500"}
          alt={product.name}
          className="detail-img"
        />

        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="detail-price">${product.price}</p>

          <div className="tags-row">
            {product.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <p className="description">{product.description}</p>

          <div className="seller-info">
            <img src={product.seller.profilePic} alt="seller" className="seller-avatar" />
            <div>
              <p><strong>{product.seller.name}</strong></p>
              <p>{product.seller.location}</p>
              <p>⭐ {product.seller.rating.toFixed(1)}</p>
            </div>
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>

        {token && (
          <form className="review-form" onSubmit={handleAddReview}>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={5}>⭐⭐⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={1}>⭐</option>
            </select>
            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        )}

        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <img src={review.user.profilePic} alt="user" className="review-avatar" />
                <div>
                  <strong>{review.user.name}</strong>
                  <p>{"⭐".repeat(review.rating)}</p>
                </div>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
