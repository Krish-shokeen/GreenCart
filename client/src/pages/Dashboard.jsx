import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(savedUser.name || "");
  const [bio, setBio] = useState(savedUser.bio || "");
  const [location, setLocation] = useState(savedUser.location || "");
  const [address, setAddress] = useState(savedUser.address || "");
  const [phone, setPhone] = useState(savedUser.phone || "");
  const [profilePic, setProfilePic] = useState(savedUser.profilePic);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟦 Upload File to Cloudinary via Backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/upload-profile-pic`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProfilePic(res.data.url); // Set uploaded image URL
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      alert("Image upload failed");
    }
  };

  // 🟦 Save Updated Profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/auth/update-profile`,
        {
          name,
          bio,
          location,
          address,
          phone,
          profilePic
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      setSaving(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => {
        setMessage("");
        navigate("/"); // Redirect to home page
      }, 2000);
    } catch (err) {
      setSaving(false);
      alert("Failed to update profile");
    }
  };


  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Profile</h2>

        <img src={profilePic} className="big-profile-pic" alt="Profile" />

        <label>Upload New Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileUpload} />

        {uploading && <p className="uploading-msg">Uploading...</p>}

        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Bio:</label>
        <textarea
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <label>Location:</label>
        <input
          type="text"
          placeholder="e.g. New York, USA"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label>Address:</label>
        <input
          type="text"
          placeholder="e.g. 123 Main St, Apt 4B"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label>Phone:</label>
        <input
          type="tel"
          placeholder="e.g. +1 234 567 8900"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}
