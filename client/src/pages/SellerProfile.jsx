import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

export default function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerProducts();
  }, [sellerId]);

  const fetchSellerProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/seller/${sellerId}`);
      setProducts(res.data.products);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="seller-profile-container">
      <h2>Seller's Products</h2>

      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products yet</p>
        ) : (
          products.map(product => (
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
              <h3>{product.name}</h3>
              <p className="product-price">${product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
