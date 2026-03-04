import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCategories } from "../services/CategoryService";
import { createProduct } from "../services/ProductService";

// Compress image to stay under Cloudinary's 10MB free plan limit
const compressImage = (file, maxWidthPx = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidthPx) {
          height = Math.round((height * maxWidthPx) / width);
          width = maxWidthPx;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            const compressed = new File([blob], file.name, { type: "image/jpeg" });
            resolve(compressed);
          },
          "image/jpeg",
          quality
        );
      };
    };
  });
};

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
      // Compress all images before upload to stay within Cloudinary 10MB limit
      toast.info("Compressing images...", { autoClose: 1500 });
      const compressedMain = await compressImage(mainImage);
      const compressedGallery = await Promise.all(gallery.map((f) => compressImage(f)));

      await createProduct({
        name: productName,
        price: Number(price),
        currency,
        stock: Number(stock),
        categoryId: Number(selectedCategoryId),
        attributes: { ...attributeValues, currency },
        mainImage: compressedMain,
        gallery: compressedGallery,
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

  // Color palette presets
  const COLOR_PALETTE = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#E53935" },
    { name: "Pink", hex: "#EC407A" },
    { name: "Purple", hex: "#8E24AA" },
    { name: "Deep Purple", hex: "#5E35B1" },
    { name: "Blue", hex: "#1E88E5" },
    { name: "Light Blue", hex: "#64B5F6" },
    { name: "Cyan", hex: "#00ACC1" },
    { name: "Teal", hex: "#00897B" },
    { name: "Green", hex: "#43A047" },
    { name: "Light Green", hex: "#9CCC65" },
    { name: "Yellow", hex: "#FDD835" },
    { name: "Amber", hex: "#FFB300" },
    { name: "Orange", hex: "#FB8C00" },
    { name: "Deep Orange", hex: "#F4511E" },
    { name: "Brown", hex: "#6D4C41" },
    { name: "Grey", hex: "#757575" },
    { name: "Navy", hex: "#1A237E" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Cream", hex: "#FFFDD0" },
    { name: "Mint", hex: "#98FF98" },
    { name: "Lavender", hex: "#E6E6FA" },
    { name: "Coral", hex: "#FF6B6B" },
  ];

  const renderAttributeField = (field) => {
    const fieldName = field.name;
    const value = attributeValues[fieldName];
    const lowerName = fieldName.toLowerCase();

    // ── SIZE: multi-select checkboxes ──
    if ((lowerName === "sizes" || lowerName === "size") && Array.isArray(field.options)) {
      const selected = Array.isArray(value) ? value : [];
      const toggle = (opt) => {
        const next = selected.includes(opt)
          ? selected.filter((s) => s !== opt)
          : [...selected, opt];
        handleAttributeChange(fieldName, next);
      };
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
          {field.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "6px 14px",
                border: selected.includes(opt) ? "2px solid #6B2C91" : "1.5px solid #ccc",
                borderRadius: "6px",
                background: selected.includes(opt) ? "#f3e8ff" : "#fff",
                color: selected.includes(opt) ? "#6B2C91" : "#333",
                fontWeight: selected.includes(opt) ? "700" : "400",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {opt}
            </button>
          ))}
          {selected.length > 0 && (
            <small style={{ width: "100%", color: "#6B2C91", marginTop: "4px" }}>
              Selected: {selected.join(", ")}
            </small>
          )}
        </div>
      );
    }

    // ── COLOR: palette picker ──
    if (lowerName === "color" || lowerName === "coloroptions" || lowerName === "colour") {
      const selected = Array.isArray(value) ? value : (value ? [value] : []);
      const toggle = (colorName) => {
        const next = selected.includes(colorName)
          ? selected.filter((c) => c !== colorName)
          : [...selected, colorName];
        handleAttributeChange(fieldName, next);
      };
      return (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
            {COLOR_PALETTE.map((color) => (
              <div
                key={color.name}
                title={color.name}
                onClick={() => toggle(color.name)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: color.hex,
                  cursor: "pointer",
                  border: selected.includes(color.name)
                    ? "3px solid #6B2C91"
                    : "2px solid #ddd",
                  boxShadow: selected.includes(color.name) ? "0 0 0 2px #f3e8ff" : "none",
                  transform: selected.includes(color.name) ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.15s",
                }}
              />
            ))}
          </div>
          {selected.length > 0 && (
            <small style={{ color: "#6B2C91", marginTop: "6px", display: "block" }}>
              Selected: {selected.join(", ")}
            </small>
          )}
        </div>
      );
    }

    // ── BOOLEAN ──
    if (field.type === "boolean") {
      return (
        <select
          value={value || ""}
          onChange={(e) => handleAttributeChange(fieldName, e.target.value === "true")}
        >
          <option value="">-- Select --</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    // ── OPTIONS DROPDOWN ──
    if (Array.isArray(field.options) && field.options.length > 0) {
      return (
        <select
          value={value || ""}
          onChange={(e) => handleAttributeChange(fieldName, e.target.value)}
        >
          <option value="">-- Select --</option>
          {field.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    // ── NUMBER ──
    if (field.type === "number") {
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => handleAttributeChange(fieldName, e.target.value)}
        />
      );
    }

    // ── DATE ──
    if (field.type === "date") {
      return (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => handleAttributeChange(fieldName, e.target.value)}
        />
      );
    }

    // ── TEXT (default) ──
    return (
      <input
        type="text"
        value={value || ""}
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
