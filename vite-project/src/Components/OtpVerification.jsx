import { useState } from "react";
import "../Styles/Auth.css";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ OTP ${otp} submitted successfully! (Replace with backend verification)`);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>
        <p className="secondary-text">Enter the 6-digit code sent to your phone number</p>

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleChange}
          maxLength="6"
          required
        />

        <button type="submit" className="btn-dark">Verify</button>

        <div className="auth-form-footer">
          <p className="secondary-text">
            Didn’t receive the code?{" "}
            <a href="/resend-otp" className="login-link">Resend</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
