import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:6969/api/products/seller/${user.id}`);
      setProducts(res.data.products);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:6969/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Product deleted!");
      fetchMyProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div className="loading">Loading your products...</div>;

  return (
    <div className="my-products-container">
      <div className="my-products-header">
        <h1>My Products</h1>
        <button className="add-new-btn" onClick={() => navigate("/add-product")}>
          + Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>You haven't added any products yet.</p>
          <button onClick={() => navigate("/add-product")}>Add Your First Product</button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.images[0] || "https://via.placeholder.com/300"}
                alt={product.name}
                className="product-img"
              />
              <h3>{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <div className="product-tags">
                {product.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <p className="stock-info">Stock: {product.stock}</p>
              
              <div className="product-actions">
                <button 
                  className="edit-btn"
                  onClick={() => navigate(`/edit-product/${product._id}`)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
