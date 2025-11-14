import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
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

  const availableTags = ["organic", "handmade", "recycled", "vegan", "local"];

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
        "http://localhost:6969/api/auth/upload-images",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:6969/api/products",
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

      alert("Product added successfully!");
      navigate("/shop");
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>

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

        <label>Upload Images:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />

        {uploading && <p>Uploading images...</p>}

        <div className="image-preview">
          {images.map((url, i) => (
            <img key={i} src={url} alt="preview" className="preview-img" />
          ))}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
