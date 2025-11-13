import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:6969/api/auth/login", {
        email,
        password,
      });

      setLoading(false);
      setSuccess(true);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Tell App.jsx that login is successful
      if (onLogin) onLogin();

      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Welcome Back 🌿</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />

        <input 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit" className={`auth-btn ${loading ? "loading" : ""}`}>
          {loading ? "Loading..." : success ? "Success!" : "Login"}
        </button>

      </form>

      <p className="auth-footer">
        Don't have an account? <NavLink to="/signup">Sign up</NavLink>
      </p>
    </div>
  );
}
