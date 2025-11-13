import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on initial load
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app-container">

        {/* Navbar */}
        <nav className="navbar slide-down">
          <h1 className="logo">🌿 GreenCart</h1>

          <div className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {isLoggedIn ? (
              <button onClick={handleLogout} className="login-btn">
                Logout
              </button>
            ) : (
              <NavLink to="/login">
                <button className="login-btn">Login</button>
              </NavLink>
            )}
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          {/* HOME PAGE */}
          <Route
            path="/"
            element={
              <header className="hero fade-in">
                <h2 className="hero-title pop-in">
                  Local. Sustainable. <span>Conscious Shopping.</span>
                </h2>
                <p className="hero-desc">
                  Discover eco-friendly, handmade, and recycled products from
                  local sellers in your city. Support sustainability while
                  shopping smart. 🌱
                </p>
                <button className="cta-btn pulse">Explore Marketplace</button>
              </header>
            }
          />

          {/* Auth pages with callback */}
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* FOOTER */}
        <footer className="footer fade-up">
          <p>© 2025 GreenCart | Built with ❤️ for a greener tomorrow</p>
        </footer>

      </div>
    </Router>
  );
}
