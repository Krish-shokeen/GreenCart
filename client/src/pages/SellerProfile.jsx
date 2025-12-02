import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

export default function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerInfo();
    fetchSellerProducts();
    fetchSellerReviews();
  }, [sellerId]);

  const fetchSellerInfo = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/user/${sellerId}`);
      setSeller(res.data.user);
      console.log('Seller info loaded:', res.data.user);
    } catch (err) {
      console.error('Error fetching seller info:', err);
      // If seller info fails, try to get it from products
    }
  };

  const fetchSellerProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/seller/${sellerId}`);
      setProducts(res.data.products);
      
      // If seller info not loaded yet, get it from first product
      if (!seller && res.data.products.length > 0) {
        setSeller(res.data.products[0].seller);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  const fetchSellerReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews/seller/${sellerId}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading seller profile...</p>
      </div>
    );
  }

  if (!seller && products.length === 0) {
    return (
      <div className="error-container">
        <h2>Seller Not Found</h2>
        <p>The seller you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/shop')} className="btn-back-shop">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="seller-profile-container">
      {/* Seller Info Card */}
      {seller ? (
        <div className="seller-info-card">
          <div className="seller-header">
            <img
              src={seller.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt={seller.name}
              className="seller-profile-pic"
            />
            <div className="seller-details">
              <h1>{seller.name}</h1>
              <p className="seller-role-badge">{seller.role}</p>
              
              {/* Rating Section */}
              <div className="seller-rating">
                <span className="rating-stars">
                  ⭐ {seller.rating > 0 ? seller.rating.toFixed(1) : "New Seller"}
                </span>
                {seller.totalRatings > 0 && (
                  <span className="rating-count">({seller.totalRatings} reviews)</span>
                )}
              </div>

              {/* Stats Grid */}
              <div className="seller-stats">
                <div className="stat">
                  <span className="stat-number">{products.length}</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{seller.totalSales || 0}</span>
                  <span className="stat-label">Sales</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {seller.memberSince 
                      ? new Date(seller.memberSince).getFullYear() 
                      : new Date(seller.createdAt).getFullYear()}
                  </span>
                  <span className="stat-label">Member Since</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="seller-contact-info">
            <h3>Contact Information</h3>
            <div className="contact-details">
              {seller.location && (
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <p className="contact-label">Location</p>
                    <p className="contact-value">{seller.location}</p>
                  </div>
                </div>
              )}
              {seller.address && (
                <div className="contact-item">
                  <span className="contact-icon">🏠</span>
                  <div>
                    <p className="contact-label">Address</p>
                    <p className="contact-value">{seller.address}</p>
                  </div>
                </div>
              )}
              {seller.phone && (
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <p className="contact-label">Phone</p>
                    <p className="contact-value">{seller.phone}</p>
                  </div>
                </div>
              )}
              {seller.email && (
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <p className="contact-label">Email</p>
                    <p className="contact-value">{seller.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          {seller.bio && (
            <div className="seller-bio">
              <h3>About the Seller</h3>
              <p>{seller.bio}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="seller-info-card">
          <p>Loading seller information...</p>
        </div>
      )}

      {/* Customer Reviews Section */}
      {reviews.length > 0 && (
        <div className="seller-reviews-section">
          <h2>Customer Reviews ({reviews.length})</h2>
          <div className="reviews-grid">
            {reviews.slice(0, 6).map(review => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <img 
                      src={review.user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                      alt={review.user?.name}
                      className="review-user-pic"
                    />
                    <div>
                      <div className="review-user-name">{review.user?.name}</div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                </div>
                {review.verified && (
                  <span className="verified-badge">✓ Verified Purchase</span>
                )}
                <p className="review-comment">{review.comment}</p>
                {review.product && (
                  <div className="review-product">
                    <img 
                      src={review.product.images?.[0] || "https://via.placeholder.com/50"} 
                      alt={review.product.name}
                      className="review-product-img"
                    />
                    <span className="review-product-name">{review.product.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seller's Products */}
      <div className="seller-products-section">
        <h2>Products by {seller?.name}</h2>

        {products.length === 0 ? (
          <div className="no-products">
            <p>This seller hasn't listed any products yet.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="product-img"
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <div className="product-tags">
                    {product.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
