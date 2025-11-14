import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:6969/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet</p>
          <button onClick={() => navigate("/shop")}>Start Shopping</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="order-card"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8)}</p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.product?.images[0] || "https://via.placeholder.com/60"}
                    alt={item.product?.name}
                    className="order-item-thumb"
                  />
                ))}
                {order.items.length > 3 && (
                  <span className="more-items">+{order.items.length - 3}</span>
                )}
              </div>

              <div className="order-footer">
                <p className="order-total">Total: ${order.totalAmount.toFixed(2)}</p>
                <p className="order-items-count">{order.items.length} items</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
