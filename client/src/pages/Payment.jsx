import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../config/api";
import { useToast } from "../components/Toast";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const token = localStorage.getItem("token");

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "razorpay"
  });

  // Get shipping address from previous page
  const shippingAddress = location.state?.shippingAddress;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!shippingAddress) {
      showToast("Please complete shipping information first", "warning");
      navigate("/checkout");
      return;
    }

    fetchCart();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      showToast("Failed to load payment gateway", "error");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart);
      setLoading(false);

      if (!res.data.cart || res.data.cart.items.length === 0) {
        showToast("Your cart is empty", "warning");
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

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      showToast("Payment gateway is loading. Please wait...", "warning");
      return;
    }

    setSubmitting(true);

    try {
      // First create the order in our database
      const orderResponse = await axios.post(
        `${API_URL}/api/orders`,
        {
          shippingAddress,
          paymentMethod: "razorpay"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderResponse.data.order;

      // Create Razorpay order
      const razorpayOrderResponse = await axios.post(
        `${API_URL}/api/payment/create-order`,
        {
          amount: calculateTotal(),
          currency: "INR",
          receipt: `order_${order._id}`
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { order: razorpayOrder, key_id } = razorpayOrderResponse.data;

      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "GreenCart",
        description: "Sustainable Marketplace",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${API_URL}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order._id
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            if (verifyResponse.data.success) {
              showToast("✅ Payment successful! Order confirmed.", "success");
              navigate(`/orders/${order._id}`, { 
                state: { 
                  paymentSuccess: true,
                  paymentId: response.razorpay_payment_id
                }
              });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            showToast("Payment verification failed. Please contact support.", "error");
          }
        },
        prefill: {
          name: shippingAddress?.name || JSON.parse(localStorage.getItem("user"))?.name || "",
          email: JSON.parse(localStorage.getItem("user"))?.email || "",
          contact: shippingAddress?.phone || ""
        },
        notes: {
          address: `${shippingAddress?.street}, ${shippingAddress?.city}`
        },
        theme: {
          color: "#4caf50"
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false);
            showToast("Payment cancelled", "warning");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment initiation error:", error);
      showToast("Failed to initiate payment. Please try again.", "error");
      setSubmitting(false);
    }
  };

  const handleCODPayment = async () => {
    setSubmitting(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/orders`,
        {
          shippingAddress,
          paymentMethod: "cod"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("✅ Order placed successfully! Pay on delivery.", "success");
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to place order", "error");
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentData.paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else if (paymentData.paymentMethod === "cod") {
      handleCODPayment();
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
                <label className={`payment-method-option ${paymentData.paymentMethod === "razorpay" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentData.paymentMethod === "razorpay"}
                    onChange={handleChange}
                  />
                  <div className="payment-method-content">
                    <span className="payment-icon">💳</span>
                    <div>
                      <span>Online Payment</span>
                      <small>Card, UPI, Net Banking, Wallet</small>
                    </div>
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
                    <div>
                      <span>Cash on Delivery</span>
                      <small>Pay when delivered</small>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {paymentData.paymentMethod === "razorpay" && (
              <div className="payment-info">
                <div className="razorpay-info">
                  <h3>🔒 Secure Online Payment</h3>
                  <p>Pay securely using:</p>
                  <div className="payment-options-list">
                    <span>💳 Credit/Debit Cards</span>
                    <span>📱 UPI (GPay, PhonePe, Paytm)</span>
                    <span>🏦 Net Banking</span>
                    <span>💰 Digital Wallets</span>
                  </div>
                  <p className="security-note">
                    <span>🛡️</span> Powered by Razorpay - India's most trusted payment gateway
                  </p>
                </div>
              </div>
            )}

            {paymentData.paymentMethod === "cod" && (
              <div className="payment-info">
                <div className="cod-info">
                  <h3>💰 Cash on Delivery</h3>
                  <p>Pay with cash when your order is delivered to your doorstep.</p>
                  <ul>
                    <li>✅ No advance payment required</li>
                    <li>✅ Pay only after receiving your order</li>
                    <li>✅ Available for orders above ₹500</li>
                  </ul>
                </div>
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
                  ₹{(item.product?.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
