import apiClient, { getApiBaseUrl } from "./apiClient";

const USERS_PREFIX = "/users";

export const registerCustomer = async (payload) => {
  const response = await apiClient.post(`${USERS_PREFIX}/register`, payload);
  return response.data;
};

export const registerSeller = async (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await apiClient.post(
    `${USERS_PREFIX}/register-seller`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const verifyOtp = async (payload) => {
  const response = await apiClient.post(`${USERS_PREFIX}/verify-otp`, payload);
  return response.data;
};

export const resendOtp = async (payload) => {
  const response = await apiClient.post(
    `${USERS_PREFIX}/resend-otp`,
    payload,
  );
  return response.data;
};

export const login = async (payload) => {
  const response = await apiClient.post(`${USERS_PREFIX}/login`, payload);
  return response.data;
};

export const getProfile = async (userId) => {
  const response = await apiClient.get(`${USERS_PREFIX}/${userId}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await apiClient.get(`${USERS_PREFIX}`);
  return response.data;
};

export const approveSeller = async (sellerId) => {
  const response = await apiClient.put(
    `${USERS_PREFIX}/sellers/${sellerId}/approve`,
  );
  return response.data;
};

export const rejectSeller = async (sellerId) => {
  const response = await apiClient.put(
    `${USERS_PREFIX}/sellers/${sellerId}/reject`,
  );
  return response.data;
};

export const getPendingSellers = async () => {
  const response = await apiClient.get(`${USERS_PREFIX}/sellers/pending`);
  return response.data;
};

export const getApprovedSellers = async () => {
  const response = await apiClient.get(`${USERS_PREFIX}/sellers/approved`);
  return response.data;
};

export const getRejectedSellers = async () => {
  const response = await apiClient.get(`${USERS_PREFIX}/sellers/rejected`);
  return response.data;
};

export const updateMyProfile = async (data) => {
  const response = await apiClient.put(`${USERS_PREFIX}/me/profile`, data);
  return response.data;
};

export const getApiBase = getApiBaseUrl;
