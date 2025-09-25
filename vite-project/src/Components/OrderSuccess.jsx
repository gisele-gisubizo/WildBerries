import React from "react";
import { Link } from "react-router-dom";
import "../Styles/orderSuccess.css";

const OrderSuccess = () => {
  const orderNumber = Math.floor(Math.random() * 1000000); // simple random order number
  const totalPaid = localStorage.getItem("orderTotal") || "0.00";

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <h2>✅ Thank you for your order!</h2>
        <p>Your order has been placed successfully.</p>

        <div className="order-details">
          <p><strong>Order Number:</strong> #{orderNumber}</p>
          <p><strong>Total Paid:</strong> ${totalPaid}</p>
          <p>We will process your order and notify you shortly.</p>
        </div>

        <Link to="/site" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
