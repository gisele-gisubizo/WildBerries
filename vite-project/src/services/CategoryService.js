import apiClient from "./apiClient";

const CATEGORIES_PREFIX = "/categories";

export const fetchCategories = async () => {
  const response = await apiClient.get(CATEGORIES_PREFIX);
  return response.data;
};

export const fetchCategoryById = async (categoryId) => {
  const response = await apiClient.get(`${CATEGORIES_PREFIX}/${categoryId}`);
  return response.data;
};

export const fetchStructuredCategory = async (name) => {
  const response = await apiClient.get(
    `${CATEGORIES_PREFIX}/structured/${encodeURIComponent(name)}`,
  );
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await apiClient.post(CATEGORIES_PREFIX, payload);
  return response.data;
};

export const updateCategory = async (categoryId, payload) => {
  const response = await apiClient.put(
    `${CATEGORIES_PREFIX}/${categoryId}`,
    payload,
  );
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await apiClient.delete(
    `${CATEGORIES_PREFIX}/${categoryId}`,
  );
  return response.data;
};

