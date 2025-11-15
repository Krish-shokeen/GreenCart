import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(res.data.order);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Order not found");
      navigate("/orders");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      processing: "#17a2b8",
      shipped: "#007bff",
      delivered: "#28a745",
      cancelled: "#dc3545"
    };
    return colors[status] || "#6c757d";
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    setCancelling(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrder(res.data.order);
      alert("Order cancelled successfully");
      setCancelling(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
      setCancelling(false);
    }
  };

  const canCancelOrder = () => {
    return order && order.status !== "cancelled" && order.status !== "delivered";
  };

  if (loading) return <div className="loading">Loading order...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-detail-container">
      <button className="back-btn" onClick={() => navigate("/orders")}>
        ← Back to Orders
      </button>

      <div className="order-detail-header">
        <div>
          <h1>Order #{order._id.slice(-8)}</h1>
          <p className="order-date">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="order-header-actions">
          <span 
            className="order-status-badge"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {order.status.toUpperCase()}
          </span>
          {canCancelOrder() && (
            <button 
              className="cancel-order-btn" 
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      <div className="order-detail-content">
        <div className="order-items-section">
          <h2>Order Items</h2>
          {order.items.map((item) => (
            <div key={item._id} className="order-detail-item">
              <img
                src={item.product?.images[0] || "https://via.placeholder.com/100"}
                alt={item.product?.name}
                onClick={() => navigate(`/product/${item.product._id}`)}
              />
              <div className="order-item-info">
                <h3>{item.product?.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p className="item-price">${item.price.toFixed(2)} each</p>
              </div>
              <div className="order-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-info-section">
          <div className="info-card">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>

          <div className="info-card">
            <h3>Payment Method</h3>
            <p className="payment-method">
              {order.paymentMethod === "card" && "💳 Credit/Debit Card"}
              {order.paymentMethod === "paypal" && "💰 PayPal"}
              {order.paymentMethod === "cod" && "💵 Cash on Delivery"}
            </p>
          </div>

          <div className="info-card order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
