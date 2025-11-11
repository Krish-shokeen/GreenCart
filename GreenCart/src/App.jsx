import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar */}
        <nav className="navbar slide-down">
          <h1 className="logo">🌿 GreenCart</h1>
          <div className="nav-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/login">
              <button className="login-btn">Login</button>
            </NavLink>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        {/* Footer */}
        <footer className="footer fade-up">
          <p>© 2025 GreenCart | Built with ❤️ for a greener tomorrow</p>
        </footer>
      </div>
    </Router>
  );
}
