import { useState } from "react";
import axios from "axios";
import "../Styles/Auth.css";

const Login = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🧩 Replace with your actual backend API URL
      const res = await axios.post("http://localhost:4000/users/login", {
        phone: form.phone,
        password: form.password,
      });

      if (res.data.success) {
        alert("✅ Login successful!");
        console.log("User data:", res.data.data);

        // Save token to localStorage for auth persistence
        localStorage.setItem("token", res.data.data.token);

        // Example: redirect to dashboard after successful login
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        if (err.response.status === 400) {
          setError("❌ Invalid phone number or password.");
        } else if (err.response.status === 401) {
          setError("❌ Unauthorized. Please check your credentials.");
        } else {
          setError("⚠️ Something went wrong. Please try again later.");
        }
      }
       else {
        setError("⚠️ Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-dark" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-form-footer">
          <p className="secondary-text">
            Don't have an account?{" "}
            <a href="/register" className="login-link">
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
