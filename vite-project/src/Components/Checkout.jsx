import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/checkout.css";
import { useCart } from "../contexts/CartContext";
import { checkout as checkoutOrder } from "../services/OrderService";
import { useAuth } from "../contexts/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartLoading, cartError, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    payment: "cash",
  });

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.product?.price) || 0;
      return sum + price * (item.quantity || 0);
    }, 0);
    const shipping = cartItems.length ? 20 : 0;
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await checkoutOrder({
        paymentMethod: form.payment,
        shippingAddress: `${form.address}, ${form.city}`,
      });

      if (response?.success) {
        await clearCart();
        navigate("/site/order-success", {
          state: {
            order: response.data,
            totals,
          },
        });
      } else {
        alert(response?.message || "Failed to complete checkout.");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong during checkout.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="checkout-container">
        <h2 className="checkout-title">Checkout</h2>
        <p>Loading cart details...</p>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="checkout-container">
        <h2 className="checkout-title">Checkout</h2>
        <p className="error-text">{cartError}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="checkout-container">
        <h2 className="checkout-title">Checkout</h2>
        <p className="error-text">Please log in to complete your purchase.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
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
            type="text"
            name="address"
            placeholder="Street Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />

          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={form.payment === "cash"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="mobile"
                checked={form.payment === "mobile"}
                onChange={handleChange}
              />
              Mobile Money
            </label>
          </div>

          <button type="submit" className="place-order-btn" disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${totals.shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
