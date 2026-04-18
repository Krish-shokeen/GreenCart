import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import API_URL from "../config/api";
import { useToast } from "../components/Toast";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const showToast = useToast();

  const [modalStep, setModalStep] = useState(0); // 0=hidden, 1=role, 2=details
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("buyer");
  const [details, setDetails] = useState({ name: "", phone: "", location: "", address: "", bio: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      setLoading(false);
      setSuccess(true);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (onLogin) onLogin();
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const res = await axios.post(`${API_URL}/api/auth/google`, {
        googleId: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        profilePic: firebaseUser.photoURL,
      });

      if (res.data.isNewUser && !res.data.token) {
        setPendingGoogleUser({
          googleId: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          profilePic: firebaseUser.photoURL,
        });
        setDetails(d => ({ ...d, name: firebaseUser.displayName || "" }));
        setModalStep(1);
        setGoogleLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (onLogin) onLogin();
      navigate("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        alert(err.response?.data?.message || "Google login failed.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email: forgotEmail });
      showToast("✓ Reset link sent! Check your email.", "success");
      setShowForgot(false);
      setForgotEmail("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send reset email.", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleDetailsConfirm = async () => {    setGoogleLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/google`, {
        ...pendingGoogleUser,
        name: details.name || pendingGoogleUser.name,
        role: selectedRole,
        phone: details.phone,
        location: details.location,
        address: details.address,
        bio: details.bio,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (onLogin) onLogin();
      setModalStep(0);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create account.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <h2 className="auth-title">Welcome Back 🌿</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className={`auth-btn ${loading ? "loading" : ""}`}>
          {loading ? "Loading..." : success ? "Success!" : "Login"}
        </button>
        <button type="button" className="forgot-password-link" onClick={() => setShowForgot(true)}>
          Forgot password?
        </button>
      </form>

      <div className="auth-divider"><span>or</span></div>

      <button className="google-auth-btn" onClick={handleGoogleLogin} disabled={googleLoading} type="button">
        {googleLoading ? <span>Signing in...</span> : <><GoogleIcon /> Continue with Google</>}
      </button>

      <p className="auth-footer">
        Don't have an account? <NavLink to="/signup">Sign up</NavLink>
      </p>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="role-modal-overlay">
          <div className="role-modal">
            <h3>Reset Password 🔑</h3>
            <p>Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleForgotPassword} className="onboarding-form" style={{ maxHeight: "none" }}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="your@email.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
              </div>
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button className="back-btn" type="button" onClick={() => setShowForgot(false)}>Cancel</button>
                <button className="auth-btn" type="submit" disabled={forgotLoading}>
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalStep > 0 && (        <div className="role-modal-overlay">
          <div className="role-modal">

            <div className="modal-steps">
              <div className={`modal-step ${modalStep >= 1 ? "active" : ""}`}>1</div>
              <div className="modal-step-line" />
              <div className={`modal-step ${modalStep >= 2 ? "active" : ""}`}>2</div>
            </div>

            {modalStep === 1 && (
              <>
                <h3>Welcome to GreenCart! 🌿</h3>
                {pendingGoogleUser?.profilePic && (
                  <img
                    src={pendingGoogleUser.profilePic}
                    alt="profile"
                    className="google-profile-preview"
                  />
                )}
                <p>Hi <strong>{pendingGoogleUser?.name}</strong>, how will you use GreenCart?</p>
                <div className="role-options">
                  <button className={`role-option ${selectedRole === "buyer" ? "active" : ""}`} onClick={() => setSelectedRole("buyer")} type="button">
                    <span className="role-icon">🛒</span>
                    <span className="role-label">Buyer</span>
                    <span className="role-desc">Shop sustainable products</span>
                  </button>
                  <button className={`role-option ${selectedRole === "seller" ? "active" : ""}`} onClick={() => setSelectedRole("seller")} type="button">
                    <span className="role-icon">🏪</span>
                    <span className="role-label">Seller</span>
                    <span className="role-desc">Sell eco-friendly products</span>
                  </button>
                </div>
                <button className="auth-btn" onClick={() => setModalStep(2)} type="button">Next →</button>
              </>
            )}

            {modalStep === 2 && (
              <>
                <h3>Complete Your Profile</h3>
                <p>Just a few more details to get you started</p>
                <div className="onboarding-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" placeholder="Your full name" value={details.name} onChange={(e) => setDetails(d => ({ ...d, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+91 98765 43210" value={details.phone} onChange={(e) => setDetails(d => ({ ...d, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>City / Location</label>
                    <input type="text" placeholder="e.g. New Delhi" value={details.location} onChange={(e) => setDetails(d => ({ ...d, location: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" placeholder="Street, City, State" value={details.address} onChange={(e) => setDetails(d => ({ ...d, address: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Bio <span className="optional">(optional)</span></label>
                    <textarea placeholder={selectedRole === "seller" ? "Tell buyers about your products..." : "Tell us a bit about yourself..."} value={details.bio} onChange={(e) => setDetails(d => ({ ...d, bio: e.target.value }))} rows={3} />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="back-btn" onClick={() => setModalStep(1)} type="button">← Back</button>
                  <button className="auth-btn" onClick={handleDetailsConfirm} disabled={!details.name || googleLoading} type="button">
                    {googleLoading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
