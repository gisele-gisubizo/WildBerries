import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Auth.css";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, authLoading } = useAuth();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = await login({
        phone: form.phone,
        password: form.password,
      });

      if (payload?.success) {
        toast.success(payload?.message || "Login successful!");
        const role = payload?.data?.role;

        if (role === "admin") {
          navigate("/dashboard", { replace: true });
        } else if (role === "seller") {
          navigate("/seller-dashboard", { replace: true });
        } else {
          navigate("/site", { replace: true });
        }
      } else {
        setError(payload?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again later.";
      setError(apiMessage);
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

        <button type="submit" className="btn-dark" disabled={authLoading}>
          {authLoading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-form-footer">
          <p className="secondary-text">
            Don't have an account?{" "}
            <Link to="/register" className="login-link">
              Register here
            </Link>
          </p>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Login;
