import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchCategories } from "../services/CategoryService";

const CatalogContext = createContext({
  categories: [],
  categoriesLoading: true,
  categoriesError: null,
  reloadCategories: async () => {},
});

export const CatalogProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const payload = await fetchCategories();
      if (payload?.success && Array.isArray(payload.data)) {
        setCategories(payload.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
      setCategoriesError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load categories.",
      );
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const value = useMemo(
    () => ({
      categories,
      categoriesLoading,
      categoriesError,
      reloadCategories: loadCategories,
    }),
    [categories, categoriesError, categoriesLoading, loadCategories],
  );

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => useContext(CatalogContext);

