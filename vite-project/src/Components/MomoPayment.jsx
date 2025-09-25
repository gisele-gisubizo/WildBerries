import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/momoPayment.css";

const MomoPayment = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const total = localStorage.getItem("orderTotal") || "0.00";

  const handlePayment = () => {
    if (!phone) {
      alert("Please enter your Mobile Money number to proceed.");
      return;
    }

    // Simulate MoMo payment request
    alert(`A Mobile Money payment request of $${total} has been sent to ${phone}.`);

    // After “payment”, redirect to a final confirmation page or home
    localStorage.removeItem("cartItems"); // clear cart
    localStorage.removeItem("orderTotal");
    localStorage.removeItem("paymentMethod");
    navigate("/site/order-success?paid=true"); // can use query param to show payment completed
  };

  return (
    <div className="momo-payment-container">
      <div className="momo-card">
        <h2>💜 Mobile Money Payment</h2>
        <p>Total Amount: <strong>${total}</strong></p>
        <p>Enter your Mobile Money number to complete the payment.</p>

        <input
          type="tel"
          placeholder="Enter your MoMo phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={handlePayment} className="pay-btn">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default MomoPayment;
;
