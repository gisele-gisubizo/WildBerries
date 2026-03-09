import apiClient from "./apiClient";

const PRODUCTS_PREFIX = "/products";

const normalizeProductList = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  const arrayFromValues = Object.values(payload).find((value) =>
    Array.isArray(value),
  );
  if (Array.isArray(arrayFromValues)) {
    return arrayFromValues;
  }

  const numericKeyItems = Object.entries(payload)
    .filter(([key, value]) => !Number.isNaN(Number(key)) && value && typeof value === "object")
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, value]) => value);
  if (numericKeyItems.length) {
    return numericKeyItems;
  }

  if (payload?.data && typeof payload.data === "object") {
    const nestedArray = Object.values(payload.data).find((value) =>
      Array.isArray(value),
    );
    if (Array.isArray(nestedArray)) {
      return nestedArray;
    }
  }

  return [];
};

export const fetchProducts = async (params = {}) => {
  const response = await apiClient.get(PRODUCTS_PREFIX, { params });
  const payload = response.data;
  return {
    success: payload?.success ?? true,
    products: normalizeProductList(payload),
    meta: {
      total: payload?.total ?? payload?.products?.length ?? payload?.data?.length ?? 0,
      page: payload?.page ?? params.page ?? 1,
      limit: payload?.limit ?? params.limit ?? 10,
    },
    raw: payload,
  };
};

export const fetchProductById = async (productId) => {
  const response = await apiClient.get(`${PRODUCTS_PREFIX}/${productId}`);
  const payload = response.data;
  // Backend returns { success: true, data: product }
  const product = payload?.data ?? payload?.product ?? payload;
  return {
    success: payload?.success ?? true,
    product,
    data: product,
    raw: payload,
  };
};

export const createProduct = async (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}`, item));
    } else if (typeof value === "object" && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  const response = await apiClient.post(PRODUCTS_PREFIX, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (productId, payload) => {
  const response = await apiClient.put(
    `${PRODUCTS_PREFIX}/${productId}`,
    payload,
  );
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await apiClient.delete(`${PRODUCTS_PREFIX}/${productId}`);
  return response.data;
};

