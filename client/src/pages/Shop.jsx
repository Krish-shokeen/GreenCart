import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = ["organic", "handmade", "recycled", "vegan", "local"];

  useEffect(() => {
    fetchProducts();
  }, [selectedTags, search]);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedTags.length > 0) params.tags = selectedTags.join(",");

      const res = await axios.get(`${API_URL}/api/products`, { params });
      setProducts(res.data.products);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="shop-container">
      <h1 className="shop-title">🌿 Sustainable Marketplace</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter Tags */}
      <div className="filter-tags">
        {tags.map(tag => (
          <button
            key={tag}
            className={`tag-btn ${selectedTags.includes(tag) ? "active" : ""}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products found</p>
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
              <p className="product-price">₹{product.price}</p>
              <div className="product-tags">
                {product.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <p className="seller-name">by {product.seller?.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
