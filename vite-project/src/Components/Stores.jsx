import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import "../Styles/stores.css";
import { fetchProducts } from "../services/ProductService";
import { getApprovedSellers } from "../services/AuthService";

// Store images
import store1 from "../assets/images/store1.jpg";
import store2 from "../assets/images/store2.jpg";
import store3 from "../assets/images/store3.jpg";
import store4 from "../assets/images/store1.jpg";
import store5 from "../assets/images/store2.jpg";
import store6 from "../assets/images/store3.jpg";
import store7 from "../assets/images/store1.jpg";
import store8 from "../assets/images/store2.jpg";
import store9 from "../assets/images/store3.jpg";
import store10 from "../assets/images/store1.jpg";
import store11 from "../assets/images/store2.jpg";
import store12 from "../assets/images/store2.jpg";
import store13 from "../assets/images/store3.jpg";

// Product images
import item1 from "../assets/images/home/item1.jpg";
import item2 from "../assets/images/home/item2.jpg";
import item3 from "../assets/images/home/item3.jpg";
import item4 from "../assets/images/home/item4.jpg";
import item5 from "../assets/images/home/item5.jpg";
import item6 from "../assets/images/home/item6.jpg";
import item7 from "../assets/images/home/item7.jpg";
import item8 from "../assets/images/home/item8.jpg";
import item9 from "../assets/images/home/item9.jpg";
import item10 from "../assets/images/home/item10.jpg";
import item11 from "../assets/images/home/item11.jpg";
import item12 from "../assets/images/home/item12.jpg";

const storeImages = [
  store1,
  store2,
  store3,
  store4,
  store5,
  store6,
  store7,
  store8,
  store9,
  store10,
  store11,
  store12,
  store13,
];

const Stores = () => {
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [productsBySeller, setProductsBySeller] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStores = async () => {
      setLoading(true);
      setError("");
      try {
        const sellerResponse = await getApprovedSellers();
        const sellerList = sellerResponse?.data || [];
        const productsResponse = await fetchProducts({ limit: 100 });
        const grouped = productsResponse.products.reduce((acc, product) => {
          const sellerId = product?.seller?.id;
          if (!sellerId) return acc;
          if (!acc[sellerId]) acc[sellerId] = [];
          acc[sellerId].push(product);
          return acc;
        }, {});
        setProductsBySeller(grouped);
        setStores(
          sellerList.map((seller, index) => ({
            ...seller,
            logo: storeImages[index % storeImages.length],
          })),
        );
      } catch (err) {
        console.error("Failed to load stores", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load stores.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  const goToProduct = (id) => {
    navigate(`/site/product/${id}`);
  };

  const storeProducts = useMemo(() => {
    if (!selectedStore) return [];
    const sellerProducts = productsBySeller[selectedStore.id] || [];
    return [...sellerProducts].sort(
      (a, b) => Number(a.price || 0) - Number(b.price || 0),
    );
  }, [productsBySeller, selectedStore]);

  if (loading) {
    return (
      <div className="stores-page">
        <p>Loading stores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stores-page">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="stores-page">
      {!selectedStore ? (
        <>
          <h1 className="page-title">All Stores</h1>
          <div className="stores-grid">
            {stores.map((store) => (
              <div
                key={store.id}
                className="store-card"
                onClick={() => setSelectedStore(store)}
              >
                <img src={store.logo} alt={store.name} className="store-logo" />
                <h3 className="store-name">{store.name}</h3>
                <p className="store-categories">{store.categories.join(", ")}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="back-button" onClick={() => setSelectedStore(null)}>
            ← Back to Stores
          </button>
          <div className="store-header">
            <img src={selectedStore.logo} alt={selectedStore.name} className="store-header-logo" />
            <div>
              <h2>{selectedStore.name}</h2>
              <p className="store-header-categories">
                Category: {selectedStore.category?.name || "Not specified"}
              </p>
              <p className="store-info">
                {selectedStore.address || "No address provided."}
              </p>
            </div>
          </div>
          <div className="store-products">
            <h3>{selectedStore.name} Products ({storeProducts.length} items)</h3>
            {storeProducts.length > 0 ? (
              <div className="items-grid">
                {storeProducts.map((product) => (
                  <div
                    key={product.id}
                    className="item-card"
                    onClick={() => goToProduct(product.id)}
                  >
                    <div className="item-image">
                      <img
                        src={product.images?.[0] || item1}
                        alt={product.name}
                      />
                      <div className="discount">-50%</div>
                    </div>
                    <div className="item-details">
                      <div className="price">
                        <span className="current-price">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="old-price">
                          ${(Number(product.price) * 1.2).toFixed(2)}
                        </span>
                      </div>
                      <div className="labels">
                        <span className="label sale">SALE</span>
                        <span className="label good-price">GOOD PRICE</span>
                      </div>
                      <p className="seller">{selectedStore.name} / {product.name}</p>
                      <div className="rating">
                        <FaStar className="star-icon" /> 4.8 · 1,200 reviews
                      </div>
                    </div>
                    <button
                      className="buy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToProduct(product.id);
                      }}
                    >
                      <FaShoppingCart className="cart-icon" /> Buy
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-products">No products available for this store.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Stores;