import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Food");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);

  const availableTags = ["organic", "handmade", "recycled", "vegan", "local"];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      const product = res.data.product;
      
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setTags(product.tags);
      setImages(product.images);
      setStock(product.stock);
      setFetchingProduct(false);
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
      navigate("/my-products");
    }
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("images", file);
      });

      const res = await axios.post(
        `${API_URL}/api/auth/upload-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setImages([...images, ...res.data.urls]);
      setUploading(false);
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
      alert(err.response?.data?.message || "Image upload failed. Check console for details.");
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/products/${id}`,
        {
          name,
          description,
          price: Number(price),
          category,
          tags,
          images,
          stock: Number(stock)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product updated successfully!");
      navigate("/my-products");
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  if (fetchingProduct) return <div className="loading">Loading product...</div>;

  return (
    <div className="add-product-container">
      <h2>Edit Product</h2>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Clothing</option>
          <option>Home & Garden</option>
          <option>Beauty</option>
          <option>Crafts</option>
        </select>

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <label>Tags:</label>
        <div className="tags-selector">
          {availableTags.map(tag => (
            <button
              key={tag}
              type="button"
              className={`tag-btn ${tags.includes(tag) ? "active" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <label>Product Images:</label>
        <div className="image-preview">
          {images.map((url, i) => (
            <div key={i} className="preview-img-wrapper">
              <img src={url} alt="preview" className="preview-img" />
              <button 
                type="button" 
                className="remove-img-btn"
                onClick={() => removeImage(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <label>Add More Images:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />

        {uploading && <p>Uploading images...</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
