import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
import { useToast } from "../components/Toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(savedUser.name || "");
  const [bio, setBio] = useState(savedUser.bio || "");
  const [location, setLocation] = useState(savedUser.location || "");
  const [address, setAddress] = useState(savedUser.address || "");
  const [phone, setPhone] = useState(savedUser.phone || "");
  const [profilePic, setProfilePic] = useState(savedUser.profilePic);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch real password status from backend
  const [hasPassword, setHasPassword] = useState(null); // null = loading
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get(`${API_URL}/api/auth/password-status`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setHasPassword(res.data.hasPassword))
      .catch(() => setHasPassword(false));
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const res = await axios.post(`${API_URL}/api/auth/upload-profile-pic`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(res.data.url);
    } catch {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/auth/update-profile`,
        { name, bio, location, address, phone, profilePic },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      showToast("✓ Profile updated successfully!", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setPwLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showToast("✓ Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setHasPassword(true); // update UI after setting password
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update password", "error");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="profile-container">

      {/* Profile Info */}
      <div className="profile-card">
        <h2>Your Profile</h2>

        <img src={profilePic} className="big-profile-pic" alt="Profile" />

        <label>Upload New Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        {uploading && <p className="uploading-msg">Uploading...</p>}

        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Bio:</label>
        <textarea rows="4" value={bio} onChange={(e) => setBio(e.target.value)} />

        <label>Location:</label>
        <input type="text" placeholder="e.g. New Delhi, India" value={location} onChange={(e) => setLocation(e.target.value)} />

        <label>Address:</label>
        <input type="text" placeholder="e.g. 123 Main St, Apt 4B" value={address} onChange={(e) => setAddress(e.target.value)} />

        <label>Phone:</label>
        <input type="tel" placeholder="e.g. +91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Password Section */}
      <div className="profile-card">
        {hasPassword === null ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>{hasPassword ? "Change Password 🔒" : "Set Password 🔑"}</h2>
            <p className="password-section-desc">
              {hasPassword
                ? "Update your current password."
                : "You signed up with Google. Set a password to also log in with email."}
            </p>
            <form onSubmit={handlePasswordChange}>
              {hasPassword && (
                <>
                  <label>Current Password:</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </>
              )}
              <label>New Password:</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label>Confirm New Password:</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="save-btn" disabled={pwLoading}>
                {pwLoading ? "Updating..." : hasPassword ? "Change Password" : "Set Password"}
              </button>
            </form>
          </>
        )}
      </div>

    </div>
  );
}
