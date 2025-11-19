import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Auth.css";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { registerCustomer, registerSeller } = useAuth();
  const [accountType, setAccountType] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    nationalId: null,
    license: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const redirectToOtp = (email) => {
    sessionStorage.setItem("pendingVerificationEmail", email);
    navigate("/otp", { state: { email } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (accountType === "customer") {
        const payload = {
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: "customer",
        };

        const response = await registerCustomer(payload);
        toast.success(response?.message || "Customer registered successfully!");
        redirectToOtp(form.email);
      } else {
        if (!form.nationalId || !form.license) {
          toast.error("Please upload both National ID and Shop License.");
          setLoading(false);
          return;
        }

        const response = await registerSeller({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          address: form.address,
          idCopy: form.nationalId,
          licenseDoc: form.license,
        });

        toast.success(response?.message || "Seller registered successfully!");
        redirectToOtp(form.email);
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed!";
      toast.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-tabs">
          <button
            type="button"
            className={accountType === "customer" ? "active-tab" : ""}
            onClick={() => setAccountType("customer")}
          >
            Customer
          </button>
          <button
            type="button"
            className={accountType === "seller" ? "active-tab" : ""}
            onClick={() => setAccountType("seller")}
          >
            Seller
          </button>
        </div>

        <h2>
          Create {accountType === "customer" ? "Customer" : "Seller"} Account
        </h2>

        {accountType === "seller" && (
          <input
            type="text"
            name="name"
            placeholder="Full Name or Shop Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

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
        <p className="comment">
          *Password must contain at least one lowercase, one uppercase letter, and one number
        </p>

        {accountType === "seller" && (
          <>
            <input
              type="text"
              name="address"
              placeholder="Shop Address / Your Address"
              value={form.address}
              onChange={handleChange}
              required
            />
            <label className="file-label">
              National ID Copy:
              <input
                type="file"
                name="nationalId"
                accept=".pdf,.jpg,.png"
                onChange={handleChange}
                required
              />
            </label>
            <label className="file-label">
              Shop License:
              <input
                type="file"
                name="license"
                accept=".pdf,.jpg,.png"
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}

        <button type="submit" className="btn-dark" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="auth-form-footer">
          <p className="secondary-text">
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Login here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
