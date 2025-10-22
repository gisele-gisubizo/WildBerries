import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_PRODUCTS = "http://localhost:4000/products";
const API_CATEGORIES = "http://localhost:4000/categories/structured";

const categoryFields = {
  "Fashion & Clothing": ["Description", "Stock Quantity", "Sizes (S, M, L, XL, custom)", "Color", "Material", "Gender", "Brand", "Images"],
  "Electronics & Gadgets": ["Description", "Stock Quantity", "Brand", "Model Number", "Warranty Period", "Condition", "Battery Capacity", "Storage/Memory", "Color Options", "Images"],
  "Home & Furniture": ["Description", "Stock Quantity", "Type", "Material", "Dimensions", "Weight", "Assembly Required (Yes/No)", "Brand", "Images"],
  "Food & Beverages": ["Description", "Stock Quantity", "Brand/Producer", "Weight/Volume", "Ingredients", "Expiry Date", "Storage Instructions", "Dietary Info", "Images"],
  "Beauty & Personal Care": ["Description", "Stock Quantity", "Brand", "Product Type", "Ingredients", "Expiry Date", "Skin/Hair Type", "Gender Target", "Images"],
  "Books & Stationery": ["Description", "Stock Quantity", "Type", "Author", "Publisher", "Edition/Year", "Language", "Genre", "ISBN", "Images"],
  "Health & Fitness": ["Description", "Stock Quantity", "Type", "Brand", "Weight/Size", "Ingredients", "Expiry Date", "Usage Instructions", "Images"],
  "Automotive & Accessories": ["Description", "Stock Quantity", "Brand", "Vehicle Type", "Model Compatibility", "Condition", "Warranty", "Material", "Images"],
  "Kids & Baby Products": ["Description", "Stock Quantity", "Age Group", "Gender", "Material", "Safety Certifications", "Brand", "Images"],
  "Real Estate & Property": ["Description", "Location", "Property Type", "Size", "Bedrooms / Bathrooms", "Furnished", "Availability", "Contact Info", "Images"],
  "Services": ["Description", "Service Category", "Service Area", "Availability", "Contact Info", "Images (optional)"],
};

const inputTypes = {
  "Price": "number",
  "Stock Quantity": "number",
  "Expiry Date": "date",
};

const dropdownFields = {
  Gender: ["Men", "Women", "Unisex", "Kids"],
};

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]); // now an array
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subSubcategory, setSubSubcategory] = useState("");
  const [productName, setProductName] = useState("");
  const [formData, setFormData] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/categories");
        setMainCategories(res.data.data.map((cat) => cat.name));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (selectedCategory) => {
    setCategory(selectedCategory);
    setSubcategory("");
    setSubSubcategory("");
    setProductName("");
    setFormData({});
    setCategoriesData([]);

    try {
      const res = await axios.get(`${API_CATEGORIES}/${selectedCategory}`);
      setCategoriesData(res.data.data.subcategories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (field, value) => {
    const val = inputTypes[field] === "number" ? Number(value) : value;

    let key;
    if (field === "Price") key = "price";
    else if (field === "Stock Quantity") key = "stock";
    else if (field.toLowerCase().includes("description")) key = "description";
    else key = field;

    setFormData({ ...formData, [key]: val });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) {
      toast.error("Main image is required!");
      return;
    }
    if (!formData.price) {
      toast.error("Price is required!");
      return;
    }
    if (!formData.stock) {
      toast.error("Stock Quantity is required!");
      return;
    }
    if (!formData.description) {
      toast.error("Description is required!");
      return;
    }


    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", productName || "");
      data.append("categoryId", "1");
      data.append("price", formData.price || 0);
      data.append("stock", formData.stock || 0);
      data.append("description", formData.description || "");
      data.append("attributes", JSON.stringify(formData));
      data.append("mainImage", mainImage);
      gallery.forEach((file) => data.append("gallery", file));

      const token = localStorage.getItem("token");
      const res = await axios.post(API_PRODUCTS, data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Product added successfully!");
        setFormData({});
        setCategory("");
        setSubcategory("");
        setSubSubcategory("");
        setProductName("");
        setMainImage(null);
        setGallery([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Map subcategories
  const subcategoryOptions = categoriesData.map((sub) => sub.subcategory);

  // Map sub-subcategories dynamically
  const subSubOptions = subcategory
    ? categoriesData.find((sub) => sub.subcategory === subcategory)?.options || {}
    : {};

  // Map product names
  const productOptions = subSubcategory
    ? subSubOptions[subSubcategory] || []
    : [];

  return (
    <div className="add-product">
      <ToastContainer />
      <h2>Add New Product</h2>

      {/* Category */}
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">-- Select Category --</option>
          {mainCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      {category && (
        <div className="form-group">
          <label>Subcategory</label>
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
            <option value="">-- Select Subcategory --</option>
            {subcategoryOptions.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      {/* Sub-subcategory */}
      {subcategory && Object.keys(subSubOptions).length > 0 && (
        <div className="form-group">
          <label>Sub-subcategory</label>
          <select value={subSubcategory} onChange={(e) => setSubSubcategory(e.target.value)}>
            <option value="">-- Select Sub-subcategory --</option>
            {Object.keys(subSubOptions).map((subSub) => (
              <option key={subSub} value={subSub}>{subSub}</option>
            ))}
          </select>
        </div>
      )}

      {/* Product Name */}
      {subSubcategory && productOptions.length > 0 && (
        <div className="form-group">
          <label>Product Name</label>
          <select value={productName} onChange={(e) => setProductName(e.target.value)}>
            <option value="">-- Select Product --</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {/* Product Fields */}
      {category && (
        <form onSubmit={handleSubmit}>
          {/* Universal Price field */}
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={formData.price || ""}
              onChange={(e) => handleInputChange("Price", e.target.value)}
              required
            />
          </div>


          {categoryFields[category]?.map((field) => (
            <div className="form-group" key={field}>
              <label>{field}</label>
              {field.toLowerCase().includes("images") ? (
                <>
                  <input type="file" onChange={(e) => setMainImage(e.target.files[0])} />
                  <input type="file" multiple onChange={(e) => setGallery(Array.from(e.target.files))} />
                </>
              ) : dropdownFields[field] ? (
                <select onChange={(e) => handleInputChange(field, e.target.value)}>
                  <option value="">-- Select --</option>
                  {dropdownFields[field].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.toLowerCase().includes("description") ? (
                <textarea onChange={(e) => handleInputChange(field, e.target.value)} />
              ) : (
                <input type={inputTypes[field] || "text"} onChange={(e) => handleInputChange(field, e.target.value)} />
              )}
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      )}
    </div>
  );
}
