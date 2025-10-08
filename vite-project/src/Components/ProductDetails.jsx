import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart, FaRulerCombined, FaHeart, FaPlus, FaMinus, FaCheckCircle } from "react-icons/fa";
import "../Styles/productDetails.css";

// Product images
import clothes3 from "../assets/images/clothes3.jpg";
import clothes4 from "../assets/images/clothes4.jpg";
import clothes5 from "../assets/images/clothes5.jpg";
import clothes6 from "../assets/images/clothes6.jpg";
import item1 from "../assets/images/home/item1.jpg";
import item2 from "../assets/images/home/item2.jpg";
import item3 from "../assets/images/home/item3.jpg";
import item4 from "../assets/images/home/item4.jpg";
import item5 from "../assets/images/home/item5.jpg";

const ProductDetails = ({ setCartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1); // Added quantity selector

  // Product mock data (unchanged)
  const productImages = [clothes3, clothes4, clothes5, clothes6];
  const product = {
    id,
    name: "Trendy Summer Outfit",
    price: 688,
    oldPrice: 1300,
    rating: 4.9,
    reviews: 156375,
    discount: 53,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Stylish, comfortable, and perfect for summer outings. Made from premium cotton and designed for all-day comfort.",
    specs: {
      Material: "100% Cotton",
      Color: "White & Beige",
      Fit: "Regular",
      Weight: "350g",
      "Available Stock": 32,
    },
  };

  const similarProducts = [
    { id: 1, name: "Similar Product 1", image: item1, price: 127 },
    { id: 2, name: "Similar Product 2", image: item2, price: 207 },
    { id: 3, name: "Similar Product 3", image: item3, price: 852 },
    { id: 4, name: "Similar Product 4", image: item4, price: 514 },
    { id: 5, name: "Similar Product 5", image: item5, price: 1141 },
  ];

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }
    const cartItem = { ...product, size: selectedSize, quantity, image: productImages[activeImage] };
    const savedCart = localStorage.getItem("cartItems");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    const existingItem = cartItems.find((item) => item.id === product.id && item.size === selectedSize);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push(cartItem);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    alert("Item added to cart!");
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const subtotal = product.price * quantity;
  const totalDiscount = (product.discount / 100) * subtotal;
  const total = subtotal - totalDiscount;

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
            <p className="basket-item-spec">Long sleeve hoodie, - 1 pcs</p>
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
            <span className="old-price">₽ {product.oldPrice}</span>
            <span className="discount">-{product.discount}%</span>
          </div>

          {/* Sizes */}
          <div className="sizes">
            <h3>Available Sizes</h3>
            <div className="size-options">
              {product.sizes.map((size, idx) => (
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

          {/* Description */}
          <div className="description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="specifications">
            <h3>Specifications</h3>
            <table>
              <tbody>
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <tr key={idx}>
                    <td className="label">{key}</td>
                    <td className="value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      {showSizeGuide && (
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
          {similarProducts.map((similar) => (
            <div key={similar.id} className="similar-card" onClick={() => navigate(`/site/product/${similar.id}`)}>
              <img src={similar.image} alt={similar.name} />
              <p>{similar.name}</p>
              <span className="similar-price">₽ {similar.price}</span>
              <button className="similar-view-btn">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;