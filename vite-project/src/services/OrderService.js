import apiClient from "./apiClient";

const ORDERS_PREFIX = "/orders";

export const checkout = async (payload = {}) => {
  const response = await apiClient.post(`${ORDERS_PREFIX}/checkout`, payload);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await apiClient.get(ORDERS_PREFIX);
  return response.data;
};

