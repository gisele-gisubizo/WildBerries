import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa'; // Removed FaShoppingCart
import { useNavigate } from 'react-router-dom';
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

// Duplicate storesData here to map store names (static for now)
const storesData = [
  { id: 1, name: "Fashion Hub", logo: "", categories: ["Clothes", "Shoes", "Accessories"] },
  { id: 2, name: "Tech World", logo: "", categories: ["Gadgets", "Smart Devices"] },
  { id: 3, name: "Home Essentials", logo: "", categories: ["Furniture", "Decor"] },
  { id: 4, name: "Beauty Plus", logo: "", categories: ["Makeup", "Skincare"] },
  { id: 5, name: "Sports Arena", logo: "", categories: ["Shoes", "Gear"] },
  { id: 6, name: "Kids Zone", logo: "", categories: ["Toys", "Clothes"] },
  { id: 7, name: "Book World", logo: "", categories: ["Books", "Stationery"] },
  { id: 8, name: "Pet Shop", logo: "", categories: ["Pet Food", "Accessories"] },
  { id: 9, name: "Grocery King", logo: "", categories: ["Food", "Beverages"] },
  { id: 10, name: "Music Hub", logo: "", categories: ["Instruments", "Accessories"] },
  { id: 11, name: "Garden Center", logo: "", categories: ["Plants", "Tools"] },
];

const Home = () => {
  const navigate = useNavigate();

  const images = [clothes1, clothes2, clothes3, clothes4, clothes5, clothes6];
  const items = [
    { id: 1, name: 'Item 1', image: item1, price: 29.99, storeId: 1 },
    { id: 2, name: 'Item 2', image: item2, price: 34.99, storeId: 1 },
    { id: 3, name: 'Item 3', image: item3, price: 19.99, storeId: 2 },
    { id: 4, name: 'Item 4', image: item4, price: 39.99, storeId: 2 },
    { id: 5, name: 'Item 5', image: item5, price: 24.99, storeId: 3 },
    { id: 6, name: 'Item 6', image: item6, price: 44.99, storeId: 3 },
    { id: 7, name: 'Item 7', image: item7, price: 29.99, storeId: 4 },
    { id: 8, name: 'Item 8', image: item8, price: 34.99, storeId: 4 },
    { id: 9, name: 'Item 9', image: item9, price: 19.99, storeId: 5 },
    { id: 10, name: 'Item 10', image: item10, price: 39.99, storeId: 5 },
    { id: 11, name: 'Item 11', image: item11, price: 24.99, storeId: 6 },
    { id: 12, name: 'Item 12', image: item12, price: 44.99, storeId: 6 },
    { id: 13, name: 'Item 8', image: item1, price: 34.99, storeId: 7 },
    { id: 14, name: 'Item 9', image: item2, price: 19.99, storeId: 7 },
    { id: 15, name: 'Item 10', image: item3, price: 39.99, storeId: 8 },
    { id: 16, name: 'Item 11', image: item4, price: 24.99, storeId: 8 },
    { id: 17, name: 'Item 12', image: item5, price: 44.99, storeId: 9 },
    { id: 18, name: 'Item 3', image: item3, price: 19.99, storeId: 9 },
    { id: 19, name: 'Item 4', image: item4, price: 39.99, storeId: 10 },
    { id: 20, name: 'Item 5', image: item5, price: 24.99, storeId: 11 },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
    const interval = setInterval(slide, 10000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    const slider = document.querySelector('.slider');
    slider.style.transition = 'none';
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
    const slider = document.querySelector('.slider');
    slider.style.transition = 'none';
  };

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="home">
      {/* Slider */}
      <div className="slider-container">
        <div className="slider">
          {images.map((image, index) => (
            <div
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              key={index}
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

      {/* Items Grid */}
      <div className="items-grid">
        {items.map((item) => {
          const store = storesData.find(s => s.id === item.storeId);
          const storeName = store ? store.name : 'Wildberries';
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

                <div className="labels">
                  <span className="label sale">SALE</span>
                  <span className="label good-price">GOOD PRICE</span>
                </div>

                <p className="seller">{storeName} / {item.name}</p>

                <div className="rating">
                  <FaStar className="star-icon" /> 4.8 · 1,200 reviews
                </div>
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
      </div>
    </div>
  );
};

export default Home;