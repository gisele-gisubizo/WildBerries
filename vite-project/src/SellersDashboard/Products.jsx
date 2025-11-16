import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../services/ProductService";
import { useAuth } from "../contexts/AuthContext";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const loadProducts = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProducts({ limit: 200 });
        const sellerProducts = (response.products || []).filter(
          (product) => product.seller?.id === user.id,
        );
        setProducts(sellerProducts);
      } catch (err) {
        console.error("Failed to load products", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load products.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user?.id]);

  const decoratedProducts = useMemo(() => {
    return products.map((product) => {
      const stock = Number(product.stock) || 0;
      const status = stock > 0 ? "Active" : "Out of Stock";
      return {
        id: product.id,
        name: product.name,
        category: product.category?.name || "N/A",
        price: Number(product.price) || 0,
        stock,
        status,
      };
    });
  }, [products]);

  const filteredProducts = decoratedProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? p.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

  return (
    <div className="dashboard-section">
      <button
        className="export-btn"
        onClick={() => navigate("/seller-dashboard/add-product")}
      >
        + Add Product
      </button>

      <div className="dashboard-header-row">
        <h2>My Products</h2>
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select-filter"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price (RWF)</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.price.toLocaleString()} RWF</td>
                    <td>{p.stock}</td>
                    <td>
                      <span
                        className={`status-badge ${p.status
                          .replace(" ", "-")
                          .toLowerCase()}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
