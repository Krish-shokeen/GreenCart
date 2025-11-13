import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:6969/api/auth/signup", {
        name,
        email,
        password,
      });

      setLoading(false);
      setSuccess(true);

      // Redirect to login after success
      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      setLoading(false);
      alert(
        err.response?.data?.message || 
        "Signup failed. Server error."
      );
    }
  };

  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Create Account 🌱</h2>
      <p className="auth-subtext">Join the GreenCart community today</p>

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

        <button type="submit" className={`auth-btn ${loading ? "loading" : ""}`}>
          {loading ? (
            <span className="spinner"></span>
          ) : success ? (
            "🎉 Account Created!"
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <NavLink to="/login">Login</NavLink>
      </p>
    </div>
  );
}
