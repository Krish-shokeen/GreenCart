import React from "react";
import { NavLink } from "react-router-dom";

export default function Login() {
  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Welcome Back 🌿</h2>
      <p className="auth-subtext">Login to continue your sustainable journey</p>

      <form className="auth-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" className="auth-btn">
          Login
        </button>
      </form>

      <p className="auth-footer">
        Don’t have an account? <NavLink to="/signup">Sign up</NavLink>
      </p>
    </div>
  );
}
