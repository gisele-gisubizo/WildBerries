import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Auth.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/users"; // ✅ Update if your backend runs on another port

const Register = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (accountType === "customer") {
        // ✅ Send JSON for customer registration
        const customerData = {
          email: form.email,
          phone: form.phone,
          password: form.password,
          // role: "customer",
        };

        const res = await axios.post(
          `${API_BASE_URL}/register`,
          customerData
        );

        toast.success(res.data.message || "Customer registered successfully!");
      } else {
        // ✅ Seller requires FormData
        if (!form.nationalId || !form.license) {
          toast.error("Please upload National ID and License!");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("password", form.password);
        formData.append("address", form.address);
        formData.append("idCopy", form.nationalId); // backend expects "idCopy"
        formData.append("licenseDoc", form.license); // backend expects "licenseDoc"

        const res = await axios.post(
          `${API_BASE_URL}/register-seller`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        toast.success(res.data.message || "Seller registered successfully!");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Registration failed!"
      );
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

        {accountType === "customer" && (
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        )}

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
