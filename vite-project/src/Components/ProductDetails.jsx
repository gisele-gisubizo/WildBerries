import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart, FaRulerCombined } from "react-icons/fa";
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

  // Product mock data
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

  const similarProducts = [item1, item2, item3, item4, item5];

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }
    const cartItem = { ...product, size: selectedSize, quantity: 1 };
    const savedCart = localStorage.getItem("cartItems");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    const existingItem = cartItems.find((item) => item.id === product.id && item.size === selectedSize);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push(cartItem);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    alert("Item added to cart!");
  };

  return (
    <div className="product-details">
      {/* === Image Gallery === */}
      <div className="image-gallery">
        <div className="main-image">
          <img src={productImages[activeImage]} alt="product" />
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

      {/* === Product Info === */}
      <div className="product-info">
        <h1>{product.name}</h1>
        <div className="rating">
          <FaStar /> {product.rating} ({product.reviews} reviews)
        </div>

        <div className="price-section">
          <span className="current-price">{product.price} ₽</span>
          <span className="old-price">{product.oldPrice} ₽</span>
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
            <button
              className="size-guide-btn"
              onClick={() => setShowSizeGuide(true)}
            >
              <FaRulerCombined /> Size Guide
            </button>
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
              <button
                className="close-btn"
                onClick={() => setShowSizeGuide(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

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

        {/* Buy Buttons */}
        <div className="action-buttons">
          <button className="buy-now-btn" onClick={() => navigate(`/product/${id}/buy`)}>
            Buy Now
          </button>
          <button
            className="add-to-cart-btn"
            onClick={addToCart}
            disabled={!selectedSize}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      {/* === Similar Products === */}
      <div className="similar-products">
        <h3>Similar Products</h3>
        <div className="similar-container">
          {similarProducts.map((img, idx) => (
            <div key={idx} className="similar-card">
              <img src={img} alt={`similar-${idx}`} />
              <p>Product {idx + 1}</p>
              <span>₽ {Math.floor(Math.random() * 1000) + 500}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;