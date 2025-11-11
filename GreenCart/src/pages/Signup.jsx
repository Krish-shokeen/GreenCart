import React from "react";
import { NavLink } from "react-router-dom";

export default function Signup() {
  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Create Account 🌱</h2>
      <p className="auth-subtext">Join the GreenCart community today</p>

      <form className="auth-form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" className="auth-btn">
          Sign Up
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <NavLink to="/login">Login</NavLink>
      </p>
    </div>
  );
}
