import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCategories } from "../services/CategoryService";
import { createProduct } from "../services/ProductService";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("RWF");
  const [stock, setStock] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
        toast.error("Unable to load categories.");
      }
    };

    loadCategories();
  }, []);

  const selectedCategory = useMemo(() => {
    return categories.find((category) => category.id === Number(selectedCategoryId));
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    setAttributeValues({});
  }, [selectedCategoryId]);

  const handleAttributeChange = (fieldName, value) => {
    setAttributeValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      toast.error("Please select a category.");
      return;
    }
    if (!productName.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!price) {
      toast.error("Price is required.");
      return;
    }
    if (!stock) {
      toast.error("Stock quantity is required.");
      return;
    }
    if (!mainImage) {
      toast.error("Main image is required.");
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        name: productName,
        price: Number(price),
        currency,
        stock: Number(stock),
        categoryId: Number(selectedCategoryId),
        attributes: { ...attributeValues, currency },
        mainImage,
        gallery,
      });

      toast.success("Product added successfully!");
      setProductName("");
      setPrice("");
      setStock("");
      setMainImage(null);
      setGallery([]);
      setAttributeValues({});
    } catch (err) {
      console.error("Failed to add product", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to add product.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderAttributeField = (field) => {
    const fieldName = field.name;
    const value = attributeValues[fieldName] || "";

    if (field.type === "boolean") {
      return (
        <select
          value={value}
          onChange={(e) =>
            handleAttributeChange(fieldName, e.target.value === "true")
          }
        >
          <option value="">-- Select --</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    if (Array.isArray(field.options) && field.options.length > 0) {
      return (
        <select
          value={value}
          onChange={(e) => handleAttributeChange(fieldName, e.target.value)}
        >
          <option value="">-- Select --</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleAttributeChange(fieldName, e.target.value)}
        />
      );
    }

    if (field.type === "date") {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => handleAttributeChange(fieldName, e.target.value)}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleAttributeChange(fieldName, e.target.value)}
      />
    );
  };

  return (
    <div className="add-product">
      <ToastContainer />
      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: "110px", flexShrink: 0 }}
            >
              <option value="RWF">RWF</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="KES">KES</option>
              <option value="UGX">UGX</option>
              <option value="TZS">TZS</option>
            </select>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Stock Quantity</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Main Image</label>
          <input type="file" onChange={(e) => setMainImage(e.target.files[0])} />
        </div>

        <div className="form-group">
          <label>Gallery Images <span style={{ color: "#888", fontWeight: "normal", fontSize: "13px" }}>(max 5 images)</span></label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length > 5) {
                toast.error("You can only upload up to 5 gallery images.");
                e.target.value = "";
                return;
              }
              setGallery(files);
            }}
          />
          {gallery.length > 0 && (
            <small style={{ color: "#555" }}>{gallery.length} file(s) selected</small>
          )}
        </div>

        {selectedCategory?.fields?.map((field) => (
          <div className="form-group" key={field.name}>
            <label>
              {field.name}
              {field.required ? " *" : ""}
            </label>
            {renderAttributeField(field)}
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
