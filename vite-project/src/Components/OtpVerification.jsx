import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/Auth.css";
import { useAuth } from "../contexts/AuthContext";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const resolvedEmail = useMemo(() => {
    return (
      location.state?.email ||
      sessionStorage.getItem("pendingVerificationEmail") ||
      ""
    );
  }, [location.state]);

  useEffect(() => {
    if (!resolvedEmail) {
      navigate("/register");
      return;
    }
    setEmail(resolvedEmail);
  }, [navigate, resolvedEmail]);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await verifyOtp({ email, otp });
      if (response?.success) {
        setMessage(response.message || "OTP verified successfully!");
        sessionStorage.removeItem("pendingVerificationEmail");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response?.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Try again later.";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await resendOtp({ email });
      if (response?.success) {
        setMessage(response?.message || "OTP resent successfully. Check your email.");
      } else {
        setError(response?.message || "Failed to resend OTP. Try again later.");
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend OTP. Try again later.";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>
        <p className="secondary-text">
          Enter the 6-digit code sent to {email}
        </p>

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleChange}
          maxLength="6"
          required
        />

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <button type="submit" className="btn-dark" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="auth-form-footer">
          <p className="secondary-text">
            Didn’t receive the code?{" "}
            <span
              onClick={handleResend}
              className="login-link"
              style={{ cursor: "pointer" }}
            >
              Resend
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
