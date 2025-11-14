import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:6969/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await axios.put(
        "http://localhost:6969/api/cart/update",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:6969/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Clear all items from cart?")) return;

    try {
      const res = await axios.delete("http://localhost:6969/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart);
    } catch (err) {
      alert("Failed to clear cart");
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-container">
      <h1>🛒 Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/shop")}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.product?.images[0] || "https://via.placeholder.com/150"}
                  alt={item.product?.name}
                  className="cart-item-img"
                  onClick={() => navigate(`/product/${item.product._id}`)}
                />

                <div className="cart-item-details">
                  <h3>{item.product?.name}</h3>
                  <p className="cart-item-price">${item.product?.price}</p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p>${(item.product?.price * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item.product._id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
