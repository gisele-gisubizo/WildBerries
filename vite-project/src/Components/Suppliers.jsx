import React, { useState } from "react";
import "../Styles/suppliers.css";

// Import images like Stores page
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

const suppliersData = [
  { id: 1, name: "Fashion Co", logo: store1, categories: ["Clothes", "Shoes"] },
  { id: 2, name: "Tech Supplies", logo: store2, categories: ["Electronics", "Gadgets"] },
  { id: 3, name: "Home Essentials", logo: store3, categories: ["Furniture", "Decor"] },
  { id: 4, name: "Beauty Plus", logo: store4, categories: ["Makeup", "Skincare"] },
  { id: 5, name: "Sports Arena", logo: store5, categories: ["Shoes", "Gear"] },
  { id: 6, name: "Kids Zone", logo: store6, categories: ["Toys", "Clothes"] },
  { id: 7, name: "Book World", logo: store7, categories: ["Books", "Stationery"] },
  { id: 8, name: "Pet Shop", logo: store8, categories: ["Pet Food", "Accessories"] },
  { id: 9, name: "Grocery King", logo: store9, categories: ["Food", "Beverages"] },
  { id: 10, name: "Music Hub", logo: store10, categories: ["Instruments", "Accessories"] },
];

const Suppliers = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  return (
    <div className="suppliers-page">
      {!selectedSupplier ? (
        <>
          <h1 className="page-title">Suppliers</h1>
          <div className="suppliers-grid">
            {suppliersData.map((supplier) => (
              <div
                key={supplier.id}
                className="supplier-card"
                onClick={() => setSelectedSupplier(supplier)}
              >
                <img src={supplier.logo} alt={supplier.name} className="supplier-logo" />
                <h3 className="supplier-name">{supplier.name}</h3>
                <p className="supplier-categories">{supplier.categories.join(", ")}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="back-button" onClick={() => setSelectedSupplier(null)}>
            ← Back to Suppliers
          </button>
          <div className="supplier-header">
            <img src={selectedSupplier.logo} alt={selectedSupplier.name} className="supplier-header-logo" />
            <h2>{selectedSupplier.name}</h2>
            <p className="supplier-header-categories">{selectedSupplier.categories.join(", ")}</p>
            {/* Optionally, add products supplied by this supplier */}
          </div>
        </>
      )}
    </div>
  );
};

export default Suppliers;
