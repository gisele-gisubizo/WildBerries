import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart, FaRulerCombined, FaHeart, FaPlus, FaMinus, FaCheckCircle } from "react-icons/fa";
import "../Styles/productDetails.css";
import { fetchProductById, fetchProducts } from "../services/ProductService";
import { useCart } from "../contexts/CartContext";

import item1 from "../assets/images/home/item1.jpg";
import item2 from "../assets/images/home/item2.jpg";
import item3 from "../assets/images/home/item3.jpg";
import item4 from "../assets/images/home/item4.jpg";
import item5 from "../assets/images/home/item5.jpg";

const fallbackImages = [item1, item2, item3, item4, item5];

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
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchProductById(id);
        if (!response?.product) {
          throw new Error("Product not found");
        }

        setProduct(response.product);
        const attributeSizes =
          response.product?.attributes?.sizes ||
          response.product?.attributes?.size;
        if (Array.isArray(attributeSizes) && attributeSizes.length > 0) {
          setSelectedSize(attributeSizes[0]);
        }

        const listResponse = await fetchProducts({ limit: 8 });
        const related = listResponse.products
          .filter((item) => item.id !== response.product.id)
          .filter((item) => item.category?.id === response.product.category?.id)
          .slice(0, 5);
        setSimilarProducts(related);
      } catch (err) {
        console.error("Failed to fetch product details", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load product details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
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

  const addToCart = async () => {
    if (sizeOptions.length > 0 && !selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }
    try {
      await addItem(product.id, quantity);
      alert("Item added to cart!");
    } catch (err) {
      console.error("Failed to add item to cart", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add item to cart.",
      );
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const specs = useMemo(() => {
    if (!product?.attributes) return {};
    const { description, sizes, size, ...rest } = product.attributes;
    return rest;
  }, [product]);

  const price = Number(product?.price) || 0;
  const subtotal = price * quantity;
  const totalDiscount = subtotal * 0.1;
  const total = subtotal - totalDiscount;

  if (loading) {
    return (
      <div className="product-details-page">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <p className="error-message">{error || "Product not available."}</p>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Left Sidebar - Basket */}
      <div className="basket-sidebar">
        <div className="basket-header">
          <h3>Basket</h3>
          <span className="item-count">1 item</span>
        </div>
        <div className="basket-item">
          <img src={productImages[activeImage]} alt={product.name} className="basket-item-image" />
          <div className="basket-item-details">
            <p className="basket-item-name">{product.name}</p>
            <p className="basket-item-spec">{product.category?.name}</p>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FaMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}><FaPlus /></button>
            </div>
          </div>
          <div className="basket-price">
            <span className="current-basket-price">₽ {subtotal}</span>
            <span className="old-basket-price">₽ {(subtotal * 1.5).toFixed(0)}</span>
          </div>
          <button className="remove-item">Remove</button>
          <button className="view-btn">View</button>
        </div>
        <div className="basket-total">
          <h4>Order Total</h4>
          <div className="total-row">
            <span>Goods</span>
            <span>₽ {subtotal}</span>
          </div>
          <div className="total-row discount-row">
            <span>Discount</span>
            <span>-₽ {totalDiscount.toFixed(0)}</span>
          </div>
          <div className="total-row">
            <span>Total</span>
            <span className="final-total">₽ {total.toFixed(0)}</span>
          </div>
        </div>
        <button className="checkout-btn">Checkout</button>
      </div>

      {/* Main Product Area */}
      <div className="main-product-area">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={productImages[activeImage]} alt="product" />
            <button
              className={`favorite-btn ${isFavorite ? "favorite-active" : ""}`}
              onClick={toggleFavorite}
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
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="rating">
            <FaStar /> {product.rating} ({product.reviews.toLocaleString()} reviews)
          </div>
          <div className="price-section">
            <span className="current-price">₽ {product.price}</span>
            <span className="old-price">₽ {(Number(product.price) * 1.2).toFixed(0)}</span>
            <span className="discount">-10%</span>
          </div>

          {/* Sizes */}
          {sizeOptions.length > 0 && (
            <div className="sizes">
              <h3>Available Sizes</h3>
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
                <button className="size-guide-btn" onClick={() => setShowSizeGuide(true)}>
                  <FaRulerCombined /> Size Guide
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="description">
            <h3>Product Description</h3>
            <p>{product.attributes?.description || "No description available."}</p>
          </div>

          {/* Specifications */}
          {Object.keys(specs).length > 0 && (
            <div className="specifications">
              <h3>Specifications</h3>
              <table>
                <tbody>
                  {Object.entries(specs).map(([key, value], idx) => (
                    <tr key={idx}>
                      <td className="label">{key}</td>
                      <td className="value">
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Order Summary */}
      <div className="order-summary-sidebar">
        <div className="store-info">
          <h4>Nearest Store</h4>
          <div className="store-details">
            <span>Store, 1 min.</span>
            <span className="store-price">₽ 690</span>
          </div>
          <div className="discount-info">
            <span>My discount</span>
            <span className="discount-amount">-₽ 418</span>
          </div>
          <div className="payment-info">
            <span>WB Wallet discount</span>
            <span className="payment-discount">-₽ 6</span>
          </div>
          <div className="second-price">
            <span>Second</span>
            <span className="second-price-amount">₽ 266</span>
          </div>
        </div>
        <button className="buy-btn">Buy</button>
        <div className="payment-options">
          <label>
            <input type="checkbox" />
            <span className="checkmark"><FaCheckCircle /></span>
            Delivery with WB Express, pickup point
          </label>
          <label>
            <input type="checkbox" />
            <span className="checkmark"><FaCheckCircle /></span>
            Installment payment
          </label>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && sizeOptions.length > 0 && (
        <div className="size-guide-modal">
          <div className="modal-content">
            <h2>Size Guide</h2>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust (cm)</th>
                  <th>Waist (cm)</th>
                  <th>Hips (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>82-86</td>
                  <td>64-68</td>
                  <td>88-92</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>86-90</td>
                  <td>68-72</td>
                  <td>92-96</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>90-96</td>
                  <td>72-78</td>
                  <td>96-102</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>96-102</td>
                  <td>78-84</td>
                  <td>102-108</td>
                </tr>
              </tbody>
            </table>
            <button className="close-btn" onClick={() => setShowSizeGuide(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Similar Products */}
      <div className="similar-products">
        <h3>View Similar</h3>
        <div className="similar-container">
          {similarProducts.map((similar, idx) => {
            const cover =
              similar.images?.[0] || fallbackImages[idx % fallbackImages.length];
            return (
            <div key={similar.id} className="similar-card" onClick={() => navigate(`/site/product/${similar.id}`)}>
                <img src={cover} alt={similar.name} />
                <p>{similar.name}</p>
                <span className="similar-price">₽ {similar.price}</span>
                <button className="similar-view-btn">View</button>
              </div>
            );
          })}
          {similarProducts.length === 0 && <p>No similar products available.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;