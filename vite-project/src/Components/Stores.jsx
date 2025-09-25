import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import "../Styles/stores.css";

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

const storesData = [
  { id: 1, name: "Fashion Hub", logo: store1, categories: ["Clothes", "Shoes", "Accessories"], description: "Your one-stop shop for trendy clothing and accessories." },
  { id: 2, name: "Tech World", logo: store2, categories: ["Gadgets", "Smart Devices"], description: "Latest gadgets and smart devices for tech enthusiasts." },
  { id: 3, name: "Home Essentials", logo: store3, categories: ["Furniture", "Decor"], description: "Quality furniture and decor for your home." },
  { id: 4, name: "Beauty Plus", logo: store4, categories: ["Makeup", "Skincare"], description: "Premium beauty products for your daily routine." },
  { id: 5, name: "Sports Arena", logo: store5, categories: ["Shoes", "Gear"], description: "Gear up with top sports equipment and apparel." },
  { id: 6, name: "Kids Zone", logo: store6, categories: ["Toys", "Clothes"], description: "Fun toys and cute clothes for kids." },
  { id: 7, name: "Book World", logo: store7, categories: ["Books", "Stationery"], description: "Explore a world of books and stationery." },
  { id: 8, name: "Pet Shop", logo: store8, categories: ["Pet Food", "Accessories"], description: "Everything your pets need to stay happy." },
  { id: 9, name: "Grocery King", logo: store9, categories: ["Food", "Beverages"], description: "Fresh groceries delivered to your door." },
  { id: 10, name: "Music Hub", logo: store10, categories: ["Instruments", "Accessories"], description: "Musical instruments for all skill levels." },
  { id: 11, name: "Garden Center", logo: store11, categories: ["Plants", "Tools"], description: "Grow your garden with our plants and tools." },
  { id: 12, name: "Office Supplies", logo: store12, categories: ["Stationery", "Electronics"], description: "Essential supplies for your office needs." },
  { id: 13, name: "Travel Essentials", logo: store13, categories: ["Luggage", "Accessories"], description: "Travel gear for your next adventure." },
];

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
  { id: 13, name: 'Item 13', image: item1, price: 34.99, storeId: 7 },
  { id: 14, name: 'Item 14', image: item2, price: 19.99, storeId: 7 },
  { id: 15, name: 'Item 15', image: item3, price: 39.99, storeId: 8 },
  { id: 16, name: 'Item 16', image: item4, price: 24.99, storeId: 8 },
  { id: 17, name: 'Item 17', image: item5, price: 44.99, storeId: 9 },
  { id: 18, name: 'Item 18', image: item3, price: 19.99, storeId: 9 },
  { id: 19, name: 'Item 19', image: item4, price: 39.99, storeId: 10 },
  { id: 20, name: 'Item 20', image: item5, price: 24.99, storeId: 11 },
];

const Stores = () => {
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState(null);

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  // Filter and sort products for the selected store
  const storeProducts = selectedStore
    ? items
        .filter((product) => product.storeId === selectedStore.id)
        .sort((a, b) => a.price - b.price) // Sort by price ascending
    : [];

  return (
    <div className="stores-page">
      {!selectedStore ? (
        <>
          <h1 className="page-title">All Stores</h1>
          <div className="stores-grid">
            {storesData.map((store) => (
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
              <p className="store-header-categories">Categories: {selectedStore.categories.join(", ")}</p>
              <p className="store-info">{selectedStore.description}</p>
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
                      <img src={product.image} alt={product.name} />
                      <div className="discount">-50%</div>
                    </div>
                    <div className="item-details">
                      <div className="price">
                        <span className="current-price">${product.price.toFixed(2)}</span>
                        <span className="old-price">${(product.price * 1.5).toFixed(2)}</span>
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