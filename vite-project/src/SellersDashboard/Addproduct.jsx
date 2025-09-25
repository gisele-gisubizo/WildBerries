import React, { useState } from "react";

// Complete hierarchy with subcategories and sub-subcategories
const productHierarchy = {
  "Fashion & Clothing": {
    Women: {
      Dresses: ["Party Dress", "Casual Dress", "Evening Dress"],
      Tops: ["Blouse", "T-shirt", "Tank Top"],
      Pants: ["Jeans", "Leggings", "Trousers"],
      Shoes: ["Heels", "Flats", "Sneakers"],
    },
    Men: {
      Shirts: ["Casual Shirt", "Formal Shirt"],
      Pants: ["Jeans", "Trousers", "Shorts"],
      Shoes: ["Formal Shoes", "Sneakers", "Boots"],
    },
    Kids: {
      Clothing: ["T-shirt", "Shorts", "School Uniform"],
      Shoes: ["Sneakers", "Sandals"],
      Toys: ["Action Figures", "Dolls"],
    },
  },
  "Electronics & Gadgets": {
    Smartphones: {
      Apple: ["iPhone 14", "iPhone 13"],
      Samsung: ["Galaxy S23", "Galaxy A53"],
      Tecno: ["Spark 10", "Camon 19"],
    },
    Laptops: {
      Dell: ["Inspiron", "XPS"],
      HP: ["Pavilion", "Envy"],
      Lenovo: ["ThinkPad", "IdeaPad"],
    },
    TVs: {
      Samsung: ["QLED", "LED"],
      LG: ["OLED", "NanoCell"],
    },
    Accessories: {
      Chargers: ["USB-C", "Wireless"],
      Headphones: ["Over-Ear", "In-Ear"],
    },
  },
  "Home & Furniture": {
    Sofas: { Leather: ["2-Seater", "3-Seater"], Fabric: ["2-Seater", "3-Seater"] },
    Beds: { Single: ["Wood", "Metal"], Double: ["Wood", "Metal"] },
    Tables: { Dining: ["4-Seater", "6-Seater"], Coffee: ["Round", "Square"] },
    Chairs: { Office: ["Ergonomic", "Standard"], Dining: ["Wooden", "Plastic"] },
  },
  "Food & Beverages": {
    Snacks: { Chips: ["Potato Chips", "Tortilla Chips"], Nuts: ["Almonds", "Cashews"] },
    Drinks: { Soda: ["Coke", "Pepsi"], Juice: ["Orange", "Mango"] },
    Groceries: { Rice: ["Basmati", "Jasmine"], Flour: ["Wheat", "Maize"] },
    "Frozen Food": { Meat: ["Chicken", "Beef"], Vegetables: ["Peas", "Corn"] },
  },
  "Beauty & Personal Care": {
    Makeup: { Face: ["Foundation", "Blush"], Eyes: ["Mascara", "Eyeliner"] },
    Haircare: { Shampoo: ["Moisturizing", "Volumizing"], Conditioner: ["Repair", "Hydrating"] },
    Skincare: { Creams: ["Day", "Night"], Serums: ["Vitamin C", "Hyaluronic"] },
    Fragrance: { Perfume: ["Men", "Women"], BodySpray: ["Men", "Women"] },
  },
  "Books & Stationery": {
    Books: { Fiction: ["Novel", "Short Stories"], NonFiction: ["Biography", "Self-Help"] },
    Notebooks: { Spiral: ["A4", "A5"], Hardcover: ["A4", "A5"] },
    "Office Supplies": { Pens: ["Ballpoint", "Gel"], Papers: ["A4", "A3"] },
  },
  "Health & Fitness": {
    Supplements: { Vitamins: ["Multivitamin", "Vitamin C"], Protein: ["Whey", "Soy"] },
    "Gym Equipment": { Cardio: ["Treadmill", "Bike"], Strength: ["Dumbbells", "Kettlebells"] },
    Wellness: { Oils: ["Essential", "Massage"], Devices: ["Massager", "Thermometer"] },
  },
  "Automotive & Accessories": {
    "Car Accessories": { SeatCovers: ["Leather", "Fabric"], Mats: ["Rubber", "Carpet"] },
    "Motorbike Accessories": { Helmets: ["Full Face", "Half Face"], Gloves: ["Leather", "Mesh"] },
    "Spare Parts": { Engine: ["Filters", "Belts"], Body: ["Bumpers", "Mirrors"] },
  },
  "Kids & Baby Products": {
    Toys: { Educational: ["Blocks", "Puzzles"], Fun: ["Action Figures", "Dolls"] },
    Clothing: { Boys: ["Shirts", "Shorts"], Girls: ["Dresses", "Tops"] },
    "Baby Care": { Feeding: ["Bottles", "Breast Pumps"], Hygiene: ["Diapers", "Wipes"] },
  },
  "Real Estate & Property": {
    Houses: { Rent: ["2-Bedroom", "3-Bedroom"], Sale: ["2-Bedroom", "3-Bedroom"] },
    Apartments: { Rent: ["Studio", "1-Bedroom"], Sale: ["Studio", "1-Bedroom"] },
    Land: { Residential: ["Plot 200sqm", "Plot 500sqm"], Commercial: ["Plot 500sqm", "Plot 1000sqm"] },
    Commercial: { Office: ["Small", "Large"], Shop: ["Small", "Large"] },
  },
  Services: {
    Cleaning: { Home: ["Regular", "Deep"], Office: ["Regular", "Deep"] },
    Repairs: { Electronics: ["Phone", "Laptop"], Home: ["Plumbing", "Electrical"] },
    Tutoring: { School: ["Math", "English"], College: ["Programming", "Physics"] },
    Transport: { Taxi: ["Short", "Long"], Delivery: ["Local", "Intercity"] },
  },
};

// Fields per category
const categoryFields = {
  "Fashion & Clothing": [
    "Price",
    "Description",
    "Stock Quantity",
    "Sizes (S, M, L, XL, custom)",
    "Color",
    "Material",
    "Gender",
    "Brand",
    "Images",
  ],
  "Electronics & Gadgets": [
    "Price",
    "Description",
    "Stock Quantity",
    "Brand",
    "Model Number",
    "Warranty Period",
    "Condition",
    "Battery Capacity",
    "Storage/Memory",
    "Color Options",
    "Images",
  ],
  "Home & Furniture": [
    "Price",
    "Description",
    "Stock Quantity",
    "Type",
    "Material",
    "Dimensions",
    "Weight",
    "Assembly Required (Yes/No)",
    "Brand",
    "Images",
  ],
  "Food & Beverages": [
    "Price",
    "Description",
    "Stock Quantity",
    "Brand/Producer",
    "Weight/Volume",
    "Ingredients",
    "Expiry Date",
    "Storage Instructions",
    "Dietary Info",
    "Images",
  ],
  "Beauty & Personal Care": [
    "Price",
    "Description",
    "Stock Quantity",
    "Brand",
    "Product Type",
    "Ingredients",
    "Expiry Date",
    "Skin/Hair Type",
    "Gender Target",
    "Images",
  ],
  "Books & Stationery": [
    "Price",
    "Description",
    "Stock Quantity",
    "Type",
    "Author",
    "Publisher",
    "Edition/Year",
    "Language",
    "Genre",
    "ISBN",
    "Images",
  ],
  "Health & Fitness": [
    "Price",
    "Description",
    "Stock Quantity",
    "Type",
    "Brand",
    "Weight/Size",
    "Ingredients",
    "Expiry Date",
    "Usage Instructions",
    "Images",
  ],
  "Automotive & Accessories": [
    "Price",
    "Description",
    "Stock Quantity",
    "Brand",
    "Vehicle Type",
    "Model Compatibility",
    "Condition",
    "Warranty",
    "Material",
    "Images",
  ],
  "Kids & Baby Products": [
    "Price",
    "Description",
    "Stock Quantity",
    "Age Group",
    "Gender",
    "Material",
    "Safety Certifications",
    "Brand",
    "Images",
  ],
  "Real Estate & Property": [
    "Price",
    "Description",
    "Location",
    "Property Type",
    "Size",
    "Bedrooms / Bathrooms",
    "Furnished",
    "Availability",
    "Contact Info",
    "Images",
  ],
  Services: [
    "Price",
    "Description",
    "Service Category",
    "Service Area",
    "Availability",
    "Contact Info",
    "Images (optional)",
  ],
};

// Input types
const inputTypes = {
  Price: "number",
  "Stock Quantity": "number",
  "Expiry Date": "date",
  "Warranty Period": "number",
  "Weight/Volume": "number",
  Weight: "number",
};

// Dropdown options
const dropdownFields = {
  Condition: ["New", "Used", "Refurbished"],
  Gender: ["Men", "Women", "Unisex", "Kids"],
  "Assembly Required (Yes/No)": ["Yes", "No"],
};

export default function AddProductPage() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subSubcategory, setSubSubcategory] = useState("");
  const [productName, setProductName] = useState("");
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      category,
      subcategory,
      subSubcategory,
      productName,
      ...formData,
    });
    alert("Product added successfully ✅");
  };

  const subSubOptions =
    category && subcategory ? Object.keys(productHierarchy[category][subcategory]) : [];
  const productOptions =
    category && subcategory && subSubcategory
      ? productHierarchy[category][subcategory][subSubcategory]
      : [];

  return (
    <div className="add-product">
      <h2>Add New Product</h2>

      {/* Category */}
      <div className="form-group">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory("");
            setSubSubcategory("");
            setProductName("");
            setFormData({});
          }}
        >
          <option value="">-- Select Category --</option>
          {Object.keys(productHierarchy).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      {category && (
        <div className="form-group">
          <label>Subcategory</label>
          <select
            value={subcategory}
            onChange={(e) => {
              setSubcategory(e.target.value);
              setSubSubcategory("");
              setProductName("");
            }}
          >
            <option value="">-- Select Subcategory --</option>
            {Object.keys(productHierarchy[category]).map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sub-subcategory */}
      {subcategory && subSubOptions.length > 0 && (
        <div className="form-group">
          <label>Sub-subcategory</label>
          <select
            value={subSubcategory}
            onChange={(e) => {
              setSubSubcategory(e.target.value);
              setProductName("");
            }}
          >
            <option value="">-- Select Sub-subcategory --</option>
            {subSubOptions.map((subSub) => (
              <option key={subSub} value={subSub}>
                {subSub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Product Name */}
      {subSubcategory && productOptions.length > 0 && (
        <div className="form-group">
          <label>Product Name</label>
          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          >
            <option value="">-- Select Product --</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Other Fields */}
      {productName && category && (
        <form onSubmit={handleSubmit}>
          {categoryFields[category].map((field) => (
            <div className="form-group" key={field}>
              <label>{field}</label>
              {dropdownFields[field] ? (
                <select onChange={(e) => handleInputChange(field, e.target.value)}>
                  <option value="">-- Select --</option>
                  {dropdownFields[field].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.toLowerCase().includes("description") ? (
                <textarea
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              ) : field.toLowerCase().includes("images") ? (
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleInputChange(field, Array.from(e.target.files))
                  }
                />
              ) : (
                <input
                  type={inputTypes[field] || "text"}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              )}
            </div>
          ))}
          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>
      )}
    </div>
  );
}
