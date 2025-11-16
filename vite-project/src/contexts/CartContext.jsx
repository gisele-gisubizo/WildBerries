import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as CartService from "../services/CartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext({
  cart: null,
  cartItems: [],
  cartLoading: false,
  cartError: null,
  cartCount: 0,
  loadCart: async () => {},
  addItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
});

const extractCartData = (payload) => {
  if (!payload) return null;
  if (payload?.data?.items) return payload.data;
  if (payload?.cart?.items) return payload.cart;
  if (payload?.items) return payload;
  return payload;
};

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  const loadCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return null;
    }

    setCartLoading(true);
    setCartError(null);
    try {
      const payload = await CartService.fetchCart();
      const cartData = extractCartData(payload);
      setCart(cartData);
      return cartData;
    } catch (error) {
      console.error("Failed to load cart", error);
      setCartError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load cart.",
      );
      setCart(null);
      return null;
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [token, loadCart]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      const payload = await CartService.addToCart(productId, quantity);
      const cartData = extractCartData(payload);
      setCart(cartData);
      return cartData;
    },
    [],
  );

  const updateItem = useCallback(async (productId, quantity) => {
    const payload = await CartService.updateCartItem(productId, quantity);
    const cartData = extractCartData(payload);
    setCart(cartData);
    return cartData;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const payload = await CartService.removeCartItem(productId);
    const cartData = extractCartData(payload);
    setCart(cartData);
    return cartData;
  }, []);

  const clearCartItems = useCallback(async () => {
    const payload = await CartService.clearCart();
    const cartData = extractCartData(payload);
    setCart(cartData);
    return cartData;
  }, []);

  const cartItems = useMemo(() => cart?.items || [], [cart]);
  const cartCount = useMemo(
    () =>
      cartItems.reduce((total, item) => total + (item.quantity || 0), 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cart,
      cartItems,
      cartLoading,
      cartError,
      cartCount,
      loadCart,
      addItem,
      updateItem,
      removeItem,
      clearCart: clearCartItems,
    }),
    [
      cart,
      cartItems,
      cartCount,
      cartError,
      cartLoading,
      addItem,
      clearCartItems,
      loadCart,
      removeItem,
      updateItem,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

