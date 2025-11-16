import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getApprovedSellers } from "../services/AuthService";

const ShopContext = createContext({
  approvedShops: [],
  loading: false,
  error: null,
  refreshApprovedShops: async () => {},
  addApprovedShop: () => {},
});

export const useShops = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [approvedShops, setApprovedShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApprovedShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getApprovedSellers();
      const sellers = response?.data || [];
      setApprovedShops(
        sellers.map((seller) => ({
          id: seller.id,
          owner: seller.name || seller.email,
          name: seller.name || seller.email,
          address: seller.address,
          email: seller.email,
          appliedDate: seller.createdAt,
          status:
            seller.status?.charAt(0).toUpperCase() + seller.status?.slice(1) ||
            "Approved",
        })),
      );
    } catch (err) {
      console.error("Failed to load approved shops", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load approved shops.",
      );
      setApprovedShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedShops();
  }, [fetchApprovedShops]);

  const addApprovedShop = useCallback((shop) => {
    setApprovedShops((prev) => {
      const exists = prev.some((item) => item.id === shop.id);
      if (exists) return prev;
      const normalizedStatus =
        shop.status?.charAt(0).toUpperCase() + shop.status?.slice(1) ||
        "Approved";
      return [...prev, { ...shop, status: normalizedStatus }];
    });
  }, []);

  const value = useMemo(
    () => ({
      approvedShops,
      loading,
      error,
      refreshApprovedShops: fetchApprovedShops,
      addApprovedShop,
    }),
    [approvedShops, addApprovedShop, error, fetchApprovedShops, loading],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
