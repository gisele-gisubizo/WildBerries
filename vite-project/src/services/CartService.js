import apiClient from "./apiClient";

const CART_PREFIX = "/cart";

export const fetchCart = async () => {
  const response = await apiClient.get(CART_PREFIX);
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await apiClient.post(CART_PREFIX, { productId, quantity });
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await apiClient.put(`${CART_PREFIX}/${productId}`, {
    quantity,
  });
  return response.data;
};

export const removeCartItem = async (productId) => {
  const response = await apiClient.delete(`${CART_PREFIX}/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await apiClient.delete(`${CART_PREFIX}/clear`);
  return response.data;
};

