import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaHeart } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchProducts } from "../services/ProductService";
import { useCatalog } from "../contexts/CatalogContext";

import clothes1 from "../assets/images/clothes1.jpg";
import clothes2 from "../assets/images/clothes2.jpg";
import clothes3 from "../assets/images/clothes3.jpg";
import clothes4 from "../assets/images/clothes4.jpg";
import clothes5 from "../assets/images/clothes5.jpg";
import clothes6 from "../assets/images/clothes6.jpg";

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

import "../Styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories } = useCatalog();
  const images = [clothes1, clothes2, clothes3, clothes4, clothes5, clothes6];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [favorites, setFavorites] = useState(new Set()); // Track favorite item IDs
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category") || "all";
    const subcategory = searchParams.get("subcategory") || "all";
    const search = searchParams.get("search") || "";
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSearchQuery(search);
  }, [location.search]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      setProductsError("");
      try {
        const payload = await fetchProducts({ limit: 50 });
        setProducts(payload.products);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProductsError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load products.",
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const goToProduct = (id) => {
    navigate(`/site/product/${id}`);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productCategory = product?.category?.name || "all";
      const productAttributes = product?.attributes || {};

      // Category filter
      const categoryMatch =
        selectedCategory === "all" ||
        productCategory.toLowerCase() === selectedCategory.toLowerCase();

      // Subcategory filter
      let subcategoryMatch = true;
      if (selectedSubcategory !== "all") {
        subcategoryMatch = Object.values(productAttributes)
          .flat()
          .map((v) => (typeof v === "string" ? v.toLowerCase() : v))
          .includes(selectedSubcategory.toLowerCase());
      }

      // Search filter — matches name, category, seller, description
      let searchMatch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const nameMatch = product.name?.toLowerCase().includes(q);
        const catMatch = productCategory.toLowerCase().includes(q);
        const sellerMatch =
          product.seller?.name?.toLowerCase().includes(q) ||
          product.seller?.email?.toLowerCase().includes(q);
        const descMatch = productAttributes.description?.toLowerCase().includes(q);
        searchMatch = nameMatch || catMatch || sellerMatch || descMatch;
      }

      return categoryMatch && subcategoryMatch && searchMatch;
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery]);

  const getProductImage = (product) => {
    if (product?.images?.length) return product.images[0];

    const fallbackMap = {
      0: item1,
      1: item2,
      2: item3,
      3: item4,
      4: item5,
      5: item6,
      6: item7,
      7: item8,
      8: item9,
      9: item10,
      10: item11,
      11: item12,
    };

    const index = product?.id ? product.id % Object.keys(fallbackMap).length : 0;
    return fallbackMap[index] || item1;
  };

  const getSellerName = (product) => {
    return product?.seller?.name || product?.seller?.email || "Marketplace";
  };

  return (
    <div className="home">
      {/* Slider */}
      <div className="slider-container">
        <div className="slider">
          {images.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
            >
              <img src={image} alt={`Slide ${index + 1}`} />
              <div className="overlay"></div>
            </div>
          ))}
        </div>
        <button className="arrow prev" onClick={goToPrevious}>
          <FaArrowLeft />
        </button>
        <button className="arrow next" onClick={goToNext}>
          <FaArrowRight />
        </button>
      </div>

      {/* Items section */}
      <h2 className="section-title">Popular Items</h2>
      <div className="items-grid">
        {loadingProducts && <p>Loading products...</p>}
        {productsError && <p className="error-text">{productsError}</p>}
        {!loadingProducts && !productsError && filteredProducts.length === 0 && (
          <p style={{ padding: "20px", color: "#888", fontSize: "15px" }}>
            {searchQuery ? `No products found for "${searchQuery}"` : "No items found in this category."}
          </p>
        )}
        {!loadingProducts &&
          !productsError &&
          filteredProducts.map((product) => {
            const productId = product.id;
            const isFavorite = favorites.has(productId);
          return (
            <div
                key={productId}
                className="item-card"
                onClick={() => goToProduct(productId)}
              >
                <div className="item-image">
                  <img src={getProductImage(product)} alt={product.name} />
                  <div className="discount">-15%</div>
                  <button
                    className={`favorite-btn ${isFavorite ? "favorite-active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(productId);
                    }}
                  >
                    <FaHeart />
                  </button>
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
                  <p className="seller">
                    {getSellerName(product)} / {product.name}
                  </p>
                  <div className="rating">
                    <FaStar className="star-icon" /> 4.8 · 1,200 reviews
                  </div>
                </div>
                <button
                  className="view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToProduct(productId);
                  }}
                >
                  View
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;