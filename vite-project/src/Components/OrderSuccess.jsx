import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Styles/orderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const totals = location.state?.totals;

  useEffect(() => {
    if (!order) {
      navigate("/site", { replace: true });
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <h2>✅ Thank you for your order!</h2>
        <p>Your order has been placed successfully.</p>

        <div className="order-details">
          <p>
            <strong>Order Number:</strong> #{order.id}
          </p>
          <p>
            <strong>Total Paid:</strong> $
            {((totals?.total ?? Number(order.totalAmount)) || 0).toFixed(2)}
          </p>
          <p>Status: {order.status}</p>
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
