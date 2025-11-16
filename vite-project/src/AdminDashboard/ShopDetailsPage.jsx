import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./dashboard.css";
import { useShops } from "./ShopContext";
import { fetchProducts } from "../services/ProductService";

export default function ShopDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { approvedShops } = useShops();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shopFromState = location.state?.shop;
  const shop =
    shopFromState ||
    approvedShops.find((s) => s.id === Number(id)) || {
      id: Number(id),
    };

  useEffect(() => {
    const loadProducts = async () => {
      if (!shop?.id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProducts({ limit: 200 });
        const list = response.products || [];
        setProducts(
          list.filter((product) => product?.seller?.id === shop.id),
        );
      } catch (err) {
        console.error("Failed to load products for shop", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load products for this shop.",
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [shop?.id]);

  const formattedStatus = useMemo(() => {
    if (!shop?.status) return "N/A";
    return shop.status.charAt(0).toUpperCase() + shop.status.slice(1);
  }, [shop?.status]);

  if (!shop || !shop.id) {
    return (
      <div className="dashboard-container">
        <h3>Shop not found!</h3>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container shop-details-page">
      <div className="shop-info-card">
        <h2>{shop.name || "N/A"}</h2>
        <p>
          <strong>Owner:</strong> {shop.owner || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {shop.email || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {shop.address || "N/A"}
        </p>
        <p>
          <strong>Applied Date:</strong>{" "}
          {shop.appliedDate
            ? new Date(shop.appliedDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge ${shop.status || ""}`}>
            {formattedStatus}
          </span>
        </p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Back to Shops
        </button>
      </div>

      <div className="shop-products-section">
        <h3>Products</h3>
        {loading && <p>Loading products...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p>No products added by this shop yet.</p>
        )}
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={
                  product.images?.[0] ||
                  "https://source.unsplash.com/300x200/?product"
                }
                alt={product.name}
              />
              <h4>{product.name}</h4>
              <p className="product-price">
                RWF {Number(product.price).toLocaleString()}
              </p>
              <button className="view-product-btn">View Product</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
