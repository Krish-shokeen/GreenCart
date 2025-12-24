import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import SellerProfile from "./pages/SellerProfile";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Toast from "./components/Toast";
import VerifyOTP from "./pages/VerifyOTP";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowDropdown(false);
    setShowMobileMenu(false);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app-container">

        {/* Navbar */}
        <nav className="navbar slide-down">
          <h1 className="logo">🌿 GreenCart</h1>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${showMobileMenu ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            <NavLink to="/" end className="nav-btn">Home</NavLink>
            <NavLink to="/shop" className="nav-btn">Shop</NavLink>
            <NavLink to="/about" className="nav-btn">About</NavLink>
            <NavLink to="/contact" className="nav-btn">Contact</NavLink>
            {isLoggedIn && <NavLink to="/cart" className="nav-btn">🛒 Cart</NavLink>}

            {isLoggedIn && JSON.parse(localStorage.getItem("user"))?.role === "seller" && (
              <>
                <NavLink to="/my-products" className="nav-btn">My Products</NavLink>
                <NavLink to="/add-product" className="nav-btn">+ Add Product</NavLink>
              </>
            )}

            {isLoggedIn ? (
              <div className="profile-menu" ref={dropdownRef}>
                <img
                  src={
                    JSON.parse(localStorage.getItem("user"))?.profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  className="profile-icon"
                  onClick={() => setShowDropdown(!showDropdown)}
                  alt="profile"
                />

                {showDropdown && (
                  <div className="dropdown">
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/orders">My Orders</NavLink>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login">
                <button className="login-btn">Login</button>
              </NavLink>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className={`mobile-nav ${showMobileMenu ? 'active' : ''}`} ref={mobileMenuRef}>
            <div className="mobile-nav-content">
              <NavLink to="/" end className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                🏠 Home
              </NavLink>
              <NavLink to="/shop" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                🛍️ Shop
              </NavLink>
              <NavLink to="/about" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                ℹ️ About
              </NavLink>
              <NavLink to="/contact" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                📞 Contact
              </NavLink>
              
              {isLoggedIn && (
                <>
                  <NavLink to="/cart" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                    🛒 Cart
                  </NavLink>
                  <NavLink to="/dashboard" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                    👤 Dashboard
                  </NavLink>
                  <NavLink to="/orders" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                    📦 My Orders
                  </NavLink>
                  
                  {JSON.parse(localStorage.getItem("user"))?.role === "seller" && (
                    <>
                      <NavLink to="/my-products" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                        📋 My Products
                      </NavLink>
                      <NavLink to="/add-product" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                        ➕ Add Product
                      </NavLink>
                    </>
                  )}
                  
                  <button className="mobile-nav-link logout-btn" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </>
              )}
              
              {!isLoggedIn && (
                <NavLink to="/login" className="mobile-nav-link login-link" onClick={() => setShowMobileMenu(false)}>
                  🔑 Login
                </NavLink>
              )}
            </div>
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* Footer */}
        <footer className="footer fade-up">
          <p>© 2025 GreenCart | Built with ❤️ for a greener tomorrow</p>
        </footer>

        {/* Toast Notifications */}
        <Toast />
      </div>
    </Router>
  );
}
