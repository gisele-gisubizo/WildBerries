import React, { useState, useEffect } from "react";
import "../Styles/checkout.css";

const Checkout = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    payment: "cash",
  });

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const shipping = 20.0; // fixed shipping for example

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    const items = savedCart ? JSON.parse(savedCart) : [];
    setCartItems(items);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Order placed successfully!\nTotal: $${(subtotal + shipping).toFixed(2)}`);
    // Optionally clear cart
    localStorage.removeItem("cartItems");
    setCartItems([]);
    
  // Redirect to Order Success page
  window.location.href = "/site/order-success";
  };

  const total = subtotal + shipping;

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-content">
        {/* LEFT SIDE → FORM */}
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

          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>

        {/* RIGHT SIDE → SUMMARY */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
