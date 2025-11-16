import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/momoPayment.css";
import { useCart } from "../contexts/CartContext";

const MomoPayment = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [phone, setPhone] = useState("");

  const total = useMemo(() => {
    return cartItems
      .reduce((sum, item) => {
        const price = Number(item.product?.price) || 0;
        return sum + price * (item.quantity || 0);
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  const handlePayment = async () => {
    if (!phone) {
      alert("Please enter your Mobile Money number to proceed.");
      return;
    }

    alert(`A Mobile Money payment request of $${total} has been sent to ${phone}.`);

    await clearCart();
    navigate("/site/order-success", {
      state: {
        order: {
          id: "momo",
          status: "pending",
          totalAmount: Number(total),
        },
        totals: {
          subtotal: Number(total),
          shipping: 0,
          total: Number(total),
        },
      },
    });
  };

  return (
    <div className="momo-payment-container">
      <div className="momo-card">
        <h2>💜 Mobile Money Payment</h2>
        <p>
          Total Amount: <strong>${total}</strong>
        </p>
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
