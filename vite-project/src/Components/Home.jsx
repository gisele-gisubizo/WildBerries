import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

import clothes1 from '../assets/images/clothes1.jpg';
import clothes2 from '../assets/images/clothes2.jpg';
import clothes3 from '../assets/images/clothes3.jpg';
import clothes4 from '../assets/images/clothes4.jpg';
import clothes5 from '../assets/images/clothes5.jpg';
import clothes6 from '../assets/images/clothes6.jpg';

import item1 from '../assets/images/home/item1.jpg';
import item2 from '../assets/images/home/item2.jpg';
import item3 from '../assets/images/home/item3.jpg';
import item4 from '../assets/images/home/item4.jpg';
import item5 from '../assets/images/home/item5.jpg';
import item6 from '../assets/images/home/item6.jpg';
import item7 from '../assets/images/home/item7.jpg';
import item8 from '../assets/images/home/item8.jpg';
import item9 from '../assets/images/home/item9.jpg';
import item10 from '../assets/images/home/item10.jpg';
import item11 from '../assets/images/home/item11.jpg';
import item12 from '../assets/images/home/item12.jpg';

import '../Styles/home.css';

// Static stores data
const storesData = [
  { id: 1, name: "Fashion Hub", categories: ["Clothes", "Shoes", "Accessories"] },
  { id: 2, name: "Tech World", categories: ["Gadgets", "Smart Devices"] },
  { id: 3, name: "Home Essentials", categories: ["Furniture", "Decor"] },
  { id: 4, name: "Beauty Plus", categories: ["Makeup", "Skincare"] },
  { id: 5, name: "Sports Arena", categories: ["Shoes", "Gear"] },
  { id: 6, name: "Kids Zone", categories: ["Toys", "Clothes"] },
  { id: 7, name: "Book World", categories: ["Books", "Stationery"] },
  { id: 8, name: "Pet Shop", categories: ["Pet Food", "Accessories"] },
  { id: 9, name: "Grocery King", categories: ["Food", "Beverages"] },
  { id: 10, name: "Music Hub", categories: ["Instruments", "Accessories"] },
  { id: 11, name: "Garden Center", categories: ["Plants", "Tools"] },
];

// Demo items with hidden categories, subcategories, and SHEIN description
const items = [
  { id: 1, name: 'Item 1', image: item1, price: 29.99, storeId: 1, category: "Women Clothing", subcategory: "Tops", description: "Trendy top from SHEIN, perfect for casual outings with a chic design." },
  { id: 2, name: 'Item 2', image: item2, price: 34.99, storeId: 1, category: "Women Clothing", subcategory: "Dresses", description: "Elegant dress from SHEIN, ideal for parties with a modern twist." },
  { id: 3, name: 'Item 3', image: item3, price: 19.99, storeId: 2, category: "Gadgets", subcategory: "Smartphones", description: "SHEIN-inspired smart gadget accessory, sleek and functional." },
  { id: 4, name: 'Item 4', image: item4, price: 39.99, storeId: 2, category: "Smart Devices", subcategory: "Watches", description: "Stylish smart watch from SHEIN collection, great for fitness." },
  { id: 5, name: 'Item 5', image: item5, price: 24.99, storeId: 3, category: "Home", subcategory: "Furniture", description: "Comfortable chair from SHEIN home line, trendy and affordable." },
  { id: 6, name: 'Item 6', image: item6, price: 44.99, storeId: 3, category: "Home", subcategory: "Decor", description: "SHEIN decorative wall art, perfect for home styling." },
  { id: 7, name: 'Item 7', image: item7, price: 29.99, storeId: 4, category: "Makeup", subcategory: "Lipstick", description: "Vibrant lipstick from SHEIN beauty range, long-lasting wear." },
  { id: 8, name: 'Item 8', image: item8, price: 34.99, storeId: 4, category: "Skincare", subcategory: "Moisturizers", description: "Hydrating moisturizer from SHEIN, skin-friendly formula." },
  { id: 9, name: 'Item 9', image: item9, price: 19.99, storeId: 5, category: "Shoes", subcategory: "Sneakers", description: "Stylish sneakers from SHEIN sports line, lightweight design." },
  { id: 10, name: 'Item 10', image: item10, price: 39.99, storeId: 5, category: "Gear", subcategory: "Bags", description: "Durable sports bag from SHEIN, perfect for workouts." },
  { id: 11, name: 'Item 11', image: item11, price: 24.99, storeId: 6, category: "Kids", subcategory: "Educational", description: "Educational toy from SHEIN kids collection, fun learning." },
  { id: 12, name: 'Item 12', image: item12, price: 44.99, storeId: 6, category: "Kids", subcategory: "Kids Wear", description: "Cute kids wear from SHEIN, comfortable and trendy." },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const images = [clothes1, clothes2, clothes3, clothes4, clothes5, clothes6];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') || 'all';
    const subcategory = searchParams.get('subcategory') || 'all';
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  }, [location.search]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const goToProduct = (id) => {
    navigate(`/site/product/${id}`);
  };

  const filteredItems = items.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const subcategoryMatch = selectedSubcategory === "all" || item.subcategory === selectedSubcategory;
    return categoryMatch && subcategoryMatch;
  });

  return (
    <div className="home">
      {/* Slider */}
      <div className="slider-container">
        <div className="slider">
          {images.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img src={image} alt={`Slide ${index + 1}`} />
              <div className="overlay"></div>
            </div>
          ))}
        </div>
        <button className="arrow prev" onClick={goToPrevious}><FaArrowLeft /></button>
        <button className="arrow next" onClick={goToNext}><FaArrowRight /></button>
      </div>

      {/* Items section */}
      <h2 className="section-title">Popular Items</h2>
      <div className="items-grid">
        {filteredItems.map((item) => {
          const store = storesData.find(s => s.id === item.storeId);
          return (
            <div
              key={item.id}
              className="item-card"
              onClick={() => goToProduct(item.id)}
            >
              <div className="item-image">
                <img src={item.image} alt={item.name} />
                <div className="discount">-50%</div>
              </div>
              <div className="item-details">
                <div className="price">
                  <span className="current-price">${item.price.toFixed(2)}</span>
                  <span className="old-price">${(item.price * 1.5).toFixed(2)}</span>
                </div>
                <p className="seller">{store?.name} / {item.name}</p>
                <div className="rating"><FaStar className="star-icon" /> 4.8 · 1,200 reviews</div>
              </div>
              <button
                className="buy-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToProduct(item.id);
                }}
              >
                Buy
              </button>
            </div>
          );
        })}
        {filteredItems.length === 0 && <p>No items found in this category.</p>}
      </div>
    </div>
  );
};

export default Home;