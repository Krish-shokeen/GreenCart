import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
import { useToast } from "../components/Toast";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  
  const email = location.state?.email;
  const userName = location.state?.name;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }

    // Countdown timer
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, email, navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      showToast("Please enter complete OTP", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email,
        otp: otpCode
      });

      showToast("✓ Email verified! Account created successfully!", "success");
      
      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
        window.location.reload(); // Refresh to update login state
      }, 1000);

    } catch (err) {
      showToast(err.response?.data?.message || "Invalid OTP", "error");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0").focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      await axios.post(`${API_URL}/api/auth/resend-otp`, { email });
      showToast("✓ OTP sent successfully!", "success");
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to resend OTP", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box verify-otp-box">
        <div className="auth-header">
          <h2>Verify Your Email</h2>
          <p>We've sent a 6-digit code to</p>
          <p className="email-display">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <div className="resend-section">
            {timer > 0 ? (
              <p className="timer-text">
                Resend OTP in <span className="timer">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="resend-btn"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Wrong email? <a href="/signup">Go back to signup</a>
          </p>
        </div>
      </div>
    </div>
  );
}
