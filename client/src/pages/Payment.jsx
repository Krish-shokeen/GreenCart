import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  // Get shipping address from previous page
  const shippingAddress = location.state?.shippingAddress;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!shippingAddress) {
      alert("Please complete shipping information first");
      navigate("/checkout");
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

      if (!res.data.cart || res.data.cart.items.length === 0) {
        alert("Your cart is empty");
        navigate("/cart");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate card details if card payment is selected
    if (paymentData.paymentMethod === "card") {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        alert("Please fill in all card details");
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:6969/api/orders",
        {
          shippingAddress,
          paymentMethod: paymentData.paymentMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment successful! Order placed.");
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="payment-container">
      <h1>Payment</h1>

      <div className="payment-content">
        <div className="payment-form-section">
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                <label className={`payment-method-option ${paymentData.paymentMethod === "card" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentData.paymentMethod === "card"}
                    onChange={handleChange}
                  />
                  <div className="payment-method-content">
                    <span className="payment-icon">💳</span>
                    <span>Credit/Debit Card</span>
                  </div>
                </label>

                <label className={`payment-method-option ${paymentData.paymentMethod === "paypal" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentData.paymentMethod === "paypal"}
                    onChange={handleChange}
                  />
                  <div className="payment-method-content">
                    <span className="payment-icon">💰</span>
                    <span>PayPal</span>
                  </div>
                </label>

                <label className={`payment-method-option ${paymentData.paymentMethod === "cod" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentData.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <div className="payment-method-content">
                    <span className="payment-icon">💵</span>
                    <span>Cash on Delivery</span>
                  </div>
                </label>
              </div>
            </div>

            {paymentData.paymentMethod === "card" && (
              <div className="card-details">
                <h3>Card Details</h3>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentData.paymentMethod === "paypal" && (
              <div className="payment-info">
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}

            {paymentData.paymentMethod === "cod" && (
              <div className="payment-info">
                <p>Pay with cash when your order is delivered.</p>
              </div>
            )}

            <div className="payment-actions">
              <button 
                type="button" 
                className="back-to-checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                ← Back to Shipping
              </button>
              <button 
                type="submit" 
                className="pay-now-btn" 
                disabled={submitting}
              >
                {submitting ? "Processing..." : `Pay $${calculateTotal().toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>

        <div className="payment-summary-section">
          <h2>Order Summary</h2>
          
          <div className="shipping-info-card">
            <h3>Shipping Address</h3>
            <p>{shippingAddress?.street}</p>
            <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}</p>
            <p>{shippingAddress?.country}</p>
          </div>

          <div className="summary-items">
            {cart?.items.map((item) => (
              <div key={item._id} className="summary-item">
                <img
                  src={item.product?.images[0] || "https://via.placeholder.com/60"}
                  alt={item.product?.name}
                />
                <div className="summary-item-details">
                  <p>{item.product?.name}</p>
                  <p className="summary-item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="summary-item-price">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
