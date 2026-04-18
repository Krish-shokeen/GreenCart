import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
import { useToast } from "../components/Toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, { token, newPassword });
      showToast("✓ Password reset successfully! Please log in.", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Reset failed. Link may have expired.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Set New Password 🔒</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password (min 6 characters)"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
