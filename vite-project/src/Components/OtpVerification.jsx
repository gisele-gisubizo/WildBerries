import { useState } from "react";
import axios from "axios";
import "../Styles/Auth.css";

const OtpVerification = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:4000/users/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        setMessage("✅ OTP verified successfully!");
        // Redirect to dashboard or next page
        window.location.href = "/login"; 
      } else {
        setError("❌ Verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("⚠️ Something went wrong. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle resending OTP
  const handleResend = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:4000/resend-otp", { email });
      if (res.data.success) {
        setMessage("✅ OTP resent successfully! Check your email.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to resend OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>
        <p className="secondary-text">Enter the 6-digit code sent to your email/phone</p>

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
            <span onClick={handleResend} className="login-link" style={{ cursor: "pointer" }}>
              Resend
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
