import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart, FaRulerCombined, FaHeart, FaPlus, FaMinus } from "react-icons/fa";
import "../Styles/productDetails.css";
import { fetchProductById, fetchProducts } from "../services/ProductService";
import { useCart } from "../contexts/CartContext";

import item1 from "../assets/images/home/item1.jpg";
import item2 from "../assets/images/home/item2.jpg";
import item3 from "../assets/images/home/item3.jpg";
import item4 from "../assets/images/home/item4.jpg";
import item5 from "../assets/images/home/item5.jpg";

const fallbackImages = [item1, item2, item3, item4, item5];

// CSS filter presets that shift the image hue/saturation to approximate each color.
// This is the same technique used by commercial fashion sites — no AI needed.
const COLOR_FILTER = {
  Black:        "grayscale(1) brightness(0.15)",
  White:        "grayscale(1) brightness(2.2) saturate(0)",
  Red:          "hue-rotate(0deg) saturate(3) brightness(1)",
  Pink:         "hue-rotate(320deg) saturate(3) brightness(1.1)",
  Purple:       "hue-rotate(270deg) saturate(3) brightness(0.9)",
  "Deep Purple":"hue-rotate(260deg) saturate(4) brightness(0.7)",
  Blue:         "hue-rotate(220deg) saturate(3) brightness(1)",
  "Light Blue": "hue-rotate(210deg) saturate(2) brightness(1.25)",
  Cyan:         "hue-rotate(185deg) saturate(3) brightness(1)",
  Teal:         "hue-rotate(175deg) saturate(2.5) brightness(0.85)",
  Green:        "hue-rotate(120deg) saturate(2.5) brightness(0.95)",
  "Light Green":"hue-rotate(100deg) saturate(2) brightness(1.1)",
  Yellow:       "hue-rotate(45deg) saturate(4) brightness(1.2)",
  Amber:        "hue-rotate(30deg) saturate(4) brightness(1.1)",
  Orange:       "hue-rotate(20deg) saturate(4) brightness(1)",
  "Deep Orange":"hue-rotate(10deg) saturate(4) brightness(0.95)",
  Brown:        "hue-rotate(15deg) saturate(1.5) brightness(0.5)",
  Grey:         "grayscale(1) brightness(0.6)",
  Navy:         "hue-rotate(225deg) saturate(4) brightness(0.4)",
  Beige:        "hue-rotate(35deg) saturate(0.6) brightness(1.3)",
  Cream:        "hue-rotate(40deg) saturate(0.4) brightness(1.5)",
  Mint:         "hue-rotate(150deg) saturate(2) brightness(1.2)",
  Lavender:     "hue-rotate(280deg) saturate(1.5) brightness(1.3)",
  Coral:        "hue-rotate(5deg) saturate(3) brightness(1.05)",
};

// Swatch hex values for the color picker circles
const COLOR_MAP = {
  Black: "#000000", White: "#FFFFFF", Red: "#E53935", Pink: "#EC407A",
  Purple: "#8E24AA", "Deep Purple": "#5E35B1", Blue: "#1E88E5",
  "Light Blue": "#64B5F6", Cyan: "#00ACC1", Teal: "#00897B",
  Green: "#43A047", "Light Green": "#9CCC65", Yellow: "#FDD835",
  Amber: "#FFB300", Orange: "#FB8C00", "Deep Orange": "#F4511E",
  Brown: "#6D4C41", Grey: "#757575", Navy: "#1A237E", Beige: "#F5F5DC",
  Cream: "#FFFDD0", Mint: "#98FF98", Lavender: "#E6E6FA", Coral: "#FF6B6B",
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchProductById(id);
        const prod = response?.product || response?.data || response;
        if (!prod || !prod.id) throw new Error("Product not found");

        setProduct(prod);

        const attrSizes = prod?.attributes?.sizes || prod?.attributes?.size;
        if (Array.isArray(attrSizes) && attrSizes.length > 0) setSelectedSize(attrSizes[0]);

        const attrColors = prod?.attributes?.color || prod?.attributes?.colors;
        if (Array.isArray(attrColors) && attrColors.length > 0) setSelectedColor(attrColors[0]);

        const listResponse = await fetchProducts({ limit: 20 });
        const related = (listResponse.products || [])
          .filter((item) => item.id !== prod.id)
          .filter((item) => item.category?.id === prod.category?.id)
          .slice(0, 6);
        setSimilarProducts(related);
      } catch (err) {
        console.error("Failed to fetch product details", err);
        setError(err?.response?.data?.message || err?.message || "Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  const productImages = useMemo(() => {
    if (product?.images?.length) return product.images;
    return fallbackImages;
  }, [product]);

  const sizeOptions = useMemo(() => {
    if (!product?.attributes) return [];
    if (Array.isArray(product.attributes.sizes)) return product.attributes.sizes;
    if (Array.isArray(product.attributes.size)) return product.attributes.size;
    return [];
  }, [product]);

  const colorOptions = useMemo(() => {
    if (!product?.attributes) return [];
    const c = product.attributes.color || product.attributes.colors || product.attributes.colorOptions;
    return Array.isArray(c) ? c : c ? [c] : [];
  }, [product]);

  // The CSS filter applied to the product image when a color is selected
  const imageFilter = selectedColor ? (COLOR_FILTER[selectedColor] || "none") : "none";

  const currency = product?.attributes?.currency || "RWF";

  const specs = useMemo(() => {
    if (!product?.attributes) return {};
    const { description, sizes, size, color, colors, colorOptions: _co, currency: _cu, ...rest } = product.attributes;
    return rest;
  }, [product]);

  const price = Number(product?.price) || 0;
  const subtotal = price * quantity;
  const discountAmount = subtotal * 0.1;
  const total = subtotal - discountAmount;

  const addToCart = async () => {
    if (sizeOptions.length > 0 && !selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }
    setAddingToCart(true);
    try {
      await addItem(product.id, quantity);
      alert("Item added to cart successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Failed to add item to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page" style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "18px", color: "#666" }}>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page" style={{ minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "red", fontSize: "16px" }}>{error || "Product not available."}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: "16px", padding: "8px 20px", cursor: "pointer", borderRadius: "6px", border: "1px solid #ccc" }}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="main-product-area">

        {/* ---- IMAGE GALLERY ---- */}
        <div className="image-gallery">
          <div className="main-image">
            {/* Color tint overlay — a semi-transparent layer in the selected color blended over the image */}
            <div className="image-color-wrapper">
              <img
                src={productImages[activeImage]}
                alt={product.name}
                className="product-main-img"
                style={{
                  filter: imageFilter,
                  transition: "filter 0.35s ease",
                }}
              />
              {/* Subtle color overlay for richer tinting on light/neutral images */}
              {selectedColor && COLOR_MAP[selectedColor] && (
                <div
                  className="color-overlay"
                  style={{
                    backgroundColor: COLOR_MAP[selectedColor],
                    opacity: selectedColor === "White" || selectedColor === "Cream" || selectedColor === "Beige" ? 0 : 0.18,
                    transition: "background-color 0.35s ease, opacity 0.35s ease",
                  }}
                />
              )}
            </div>
            <button
              className={`favorite-btn ${isFavorite ? "favorite-active" : ""}`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <FaHeart />
            </button>
          </div>

          <div className="thumbnail-container">
            {productImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className={activeImage === index ? "active" : ""}
                onClick={() => setActiveImage(index)}
                style={{ filter: imageFilter, transition: "filter 0.3s ease" }}
              />
            ))}
          </div>
        </div>

        {/* ---- PRODUCT INFO ---- */}
        <div className="product-info">
          <p style={{ fontSize: "13px", color: "#999", marginBottom: "4px" }}>
            {product.category?.name} &middot; Sold by{" "}
            <strong>{product.seller?.name || product.seller?.email || "Marketplace"}</strong>
          </p>
          <h1>{product.name}</h1>

          <div className="rating">
            <FaStar style={{ color: "#FFB300" }} />
            <span style={{ color: "#333", marginLeft: "4px" }}>4.8</span>
            <span style={{ color: "#999", marginLeft: "4px" }}>&middot; 1,200 reviews</span>
          </div>

          <div className="price-section">
            <span className="current-price">{currency} {Number(product.price).toLocaleString()}</span>
            <span className="old-price">{currency} {(Number(product.price) * 1.2).toLocaleString()}</span>
            <span className="discount">-10%</span>
          </div>

          {/* COLOR PICKER */}
          {colorOptions.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", marginBottom: "10px", color: "#1a1a2e", fontWeight: "700" }}>
                Color:{" "}
                <span style={{ fontWeight: "500", color: "#6B2C91" }}>{selectedColor || "Select"}</span>
              </h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {colorOptions.map((colorName) => (
                  <button
                    key={colorName}
                    title={colorName}
                    onClick={() => setSelectedColor(colorName)}
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: COLOR_MAP[colorName] || "#ccc",
                      cursor: "pointer",
                      border: selectedColor === colorName ? "3px solid #6B2C91" : "2px solid #ddd",
                      boxShadow: selectedColor === colorName
                        ? "0 0 0 3px rgba(107,44,145,0.25)"
                        : "0 1px 3px rgba(0,0,0,0.15)",
                      transform: selectedColor === colorName ? "scale(1.22)" : "scale(1)",
                      transition: "all 0.15s ease",
                      outline: "none",
                      padding: 0,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
              {selectedColor && (
                <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
                  Preview: image is tinted to approximate the selected colour
                </p>
              )}
            </div>
          )}

          {/* SIZE PICKER */}
          {sizeOptions.length > 0 && (
            <div className="sizes">
              <h3>
                Available Sizes
                <button className="size-guide-btn" style={{ marginLeft: "12px" }} onClick={() => setShowSizeGuide(true)}>
                  <FaRulerCombined /> Size Guide
                </button>
              </h3>
              <div className="size-options">
                {sizeOptions.map((size, idx) => (
                  <button
                    key={idx}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontWeight: "600", color: "#333" }}>Quantity:</span>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FaMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}><FaPlus /></button>
            </div>
            {product.stock != null && (
              <span style={{ fontSize: "13px", color: "#999" }}>{product.stock} in stock</span>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button
              onClick={addToCart}
              disabled={addingToCart}
              style={{
                flex: 1, minWidth: "140px", background: "#6B2C91", color: "#fff",
                border: "none", padding: "14px 0", borderRadius: "8px",
                fontSize: "16px", fontWeight: "700", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              <FaShoppingCart />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={() => navigate("/site/checkout")}
              style={{
                flex: 1, minWidth: "140px", background: "#fff", color: "#6B2C91",
                border: "2px solid #6B2C91", padding: "14px 0",
                borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: "pointer",
              }}
            >
              Buy Now
            </button>
          </div>

          {/* ORDER SUMMARY */}
          <div style={{ background: "#f9f4ff", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "14px" }}>
              <span>Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
              <span>{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "14px", color: "#E53935" }}>
              <span>Discount (10%)</span>
              <span>-{currency} {discountAmount.toFixed(0)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "16px", borderTop: "1px solid #e0d0f0", paddingTop: "10px" }}>
              <span>Total</span>
              <span style={{ color: "#6B2C91" }}>{currency} {total.toFixed(0)}</span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="description">
            <h3>Product Description</h3>
            <p>{product.attributes?.description || "No description provided for this product."}</p>
          </div>

          {/* SPECIFICATIONS */}
          {Object.keys(specs).length > 0 && (
            <div className="specifications">
              <h3>Specifications</h3>
              <table>
                <tbody>
                  {Object.entries(specs).map(([key, value], idx) => (
                    <tr key={idx}>
                      <td className="label" style={{ textTransform: "capitalize" }}>{key}</td>
                      <td className="value">{Array.isArray(value) ? value.join(", ") : String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", maxWidth: "420px", width: "100%" }}>
            <h2 style={{ marginBottom: "16px", fontSize: "20px" }}>Size Guide</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f3e8ff" }}>
                  {["Size","Bust (cm)","Waist (cm)","Hips (cm)"].map((h) => (
                    <th key={h} style={{ padding: "8px", textAlign: "left", fontSize: "13px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[["XS","76-80","58-62","82-86"],["S","82-86","64-68","88-92"],["M","86-90","68-72","92-96"],["L","90-96","72-78","96-102"],["XL","96-102","78-84","102-108"],["XXL","102-110","84-92","108-116"]].map(([s,...m]) => (
                  <tr key={s} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px", fontWeight: "700" }}>{s}</td>
                    {m.map((v, i) => <td key={i} style={{ padding: "8px" }}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setShowSizeGuide(false)} style={{ marginTop: "16px", width: "100%", padding: "11px", background: "#6B2C91", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "15px" }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <div className="similar-products">
          <h3>You May Also Like</h3>
          <div className="similar-container">
            {similarProducts.map((similar, idx) => {
              const cover = similar.images?.[0] || fallbackImages[idx % fallbackImages.length];
              const simCurrency = similar.attributes?.currency || "RWF";
              return (
                <div key={similar.id} className="similar-card" onClick={() => navigate(`/site/product/${similar.id}`)}>
                  <img src={cover} alt={similar.name} />
                  <p>{similar.name}</p>
                  <span className="similar-price">{simCurrency} {Number(similar.price).toLocaleString()}</span>
                  <button className="similar-view-btn">View</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
