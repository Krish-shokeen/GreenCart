import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        email,
        password,
        role,
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Create Account 🌱</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="buyer">🛒 Buyer</option>
          <option value="seller">🏪 Seller</option>
        </select>

        <button type="submit" className={`auth-btn ${loading ? "loading" : ""}`}>
          {loading ? "Loading..." : success ? "Account Created!" : "Sign Up"}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <NavLink to="/login">Login</NavLink>
      </p>
    </div>
  );
}
