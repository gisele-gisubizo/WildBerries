import React, { useState } from "react";
import "../Styles/stores.css";

// Import store images like in Home
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

const storesData = [
  { id: 1, name: "Fashion Hub", logo: store1, categories: ["Clothes", "Shoes", "Accessories"] },
  { id: 2, name: "Tech World", logo: store2, categories: ["Gadgets", "Smart Devices"] },
  { id: 3, name: "Home Essentials", logo: store3, categories: ["Furniture", "Decor"] },
  { id: 4, name: "Beauty Plus", logo: store4, categories: ["Makeup", "Skincare"] },
  { id: 5, name: "Sports Arena", logo: store5, categories: ["Shoes", "Gear"] },
  { id: 6, name: "Kids Zone", logo: store6, categories: ["Toys", "Clothes"] },
  { id: 7, name: "Book World", logo: store7, categories: ["Books", "Stationery"] },
  { id: 8, name: "Pet Shop", logo: store8, categories: ["Pet Food", "Accessories"] },
  { id: 9, name: "Grocery King", logo: store9, categories: ["Food", "Beverages"] },
  { id: 10, name: "Music Hub", logo: store10, categories: ["Instruments", "Accessories"] },
  { id: 11, name: "Garden Center", logo: store11, categories: ["Plants", "Tools"] },
  { id: 12, name: "Office Supplies", logo: store12, categories: ["Stationery", "Electronics"] },
  { id: 13, name: "Travel Essentials", logo: store13, categories: ["Luggage", "Accessories"] },
  { id: 11, name: "Garden Center", logo: store11, categories: ["Plants", "Tools"] },
  { id: 12, name: "Office Supplies", logo: store12, categories: ["Stationery", "Electronics"] },
  { id: 13, name: "Travel Essentials", logo: store13, categories: ["Luggage", "Accessories"] },
  { id: 11, name: "Garden Center", logo: store11, categories: ["Plants", "Tools"] },
  { id: 12, name: "Office Supplies", logo: store12, categories: ["Stationery", "Electronics"] },
  
];

const Stores = () => {
  const [selectedStore, setSelectedStore] = useState(null);

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
            <h2>{selectedStore.name}</h2>
            <p className="store-header-categories">{selectedStore.categories.join(", ")}</p>
          </div>
          {/* Optionally, add products for the selected store here */}
        </>
      )}
    </div>
  );
};

export default Stores;
