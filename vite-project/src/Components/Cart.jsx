import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/cart.css";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartLoading, cartError, updateItem, removeItem, clearCart } =
    useCart();
  const { user } = useAuth();

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.product?.price) || 0;
      return sum + price * (item.quantity || 0);
    }, 0);
    const shipping = cartItems.length > 0 ? 20 : 0;
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [cartItems]);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateItem(productId, quantity);
    } catch (err) {
      console.error("Failed to update cart item", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update item quantity.",
      );
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId);
    } catch (err) {
      console.error("Failed to remove cart item", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to remove item from cart.",
      );
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error("Failed to clear cart", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to clear cart at this time.",
      );
    }
  };

  if (cartLoading) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">Shopping Bag</h2>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">Shopping Bag</h2>
        <p className="error-text">{cartError}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">Shopping Bag</h2>
        <p className="empty-cart">
          Please log in to view items in your cart.
        </p>
        <button className="checkout-btn" onClick={() => navigate("/login")}>
          Log In
        </button>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">Shopping Bag</h2>
        <p className="empty-cart">Your bag is empty.</p>
        <button className="checkout-btn" onClick={() => navigate("/site")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Bag</h2>
      <div className="cart-items">
        {cartItems.map((item) => {
          const product = item.product || {};
          const productId = product.id;
          const image = product.images?.[0];

          return (
            <div key={`${item.id}-${productId}`} className="cart-item">
              {image ? (
                <img src={image} alt={product.name} className="cart-item-image" />
              ) : (
                <div className="cart-item-image placeholder">No image</div>
              )}
              <div className="cart-item-details">
                <h3>{product.name}</h3>
                <p className="cart-price">${Number(product.price).toFixed(2)}</p>

                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(productId, (item.quantity || 1) - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(productId, (item.quantity || 1) + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span className="summary-price">${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span className="summary-price">${totals.shipping.toFixed(2)}</span>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <span className="summary-price">${totals.total.toFixed(2)}</span>
        </div>
        <div className="cart-summary-actions">
          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
          <Link to="/site/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
