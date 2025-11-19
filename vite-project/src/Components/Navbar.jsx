import { useMemo, useState } from "react";
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/navbar.css";
import shop1 from "../assets/images/shop1.jpg";
import shop2 from "../assets/images/shop2.jpg";
import shop3 from "../assets/images/shop3.jpg";
import shop4 from "../assets/images/shop4.jpg";
import shop5 from "../assets/images/shop5.jpg";
import shop6 from "../assets/images/shop6.jpg";
import shop7 from "../assets/images/shop7.jpg";
import shop8 from "../assets/images/shop8.jpg";
import shop9 from "../assets/images/shop9.jpg";
import shop10 from "../assets/images/shop10.jpg";
import shop11 from "../assets/images/shop11.jpg";
import { useCatalog } from "../contexts/CatalogContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { categories, categoriesLoading } = useCatalog();
  const { cartCount } = useCart();

  const categoryImages = useMemo(
    () => ({
      "Fashion & Clothing": shop4,
      "Electronics & Gadgets": shop2,
      "Home & Furniture": shop9,
      "Food & Beverages": shop10,
      "Beauty & Personal Care": shop5,
      "Books & Stationery": shop3,
      "Health & Fitness": shop7,
      "Automotive & Accessories": shop8,
      "Kids & Baby Products": shop6,
      "Real Estate & Property": shop1,
      Services: shop11,
    }),
    [],
  );

  const fallbackImages = [shop4, shop5, shop6, shop7, shop8, shop9, shop10, shop11, shop2, shop3];

  const menuCategories = useMemo(() => {
    const dynamicCategories =
      categories?.map((category, index) => {
        const image =
          categoryImages[category.name] ||
          fallbackImages[index % fallbackImages.length] ||
          shop1;

        const subcategories =
          category.fields?.map((field, idx) => ({
            name: field.name,
            image:
              fallbackImages[(index + idx) % fallbackImages.length] || image,
            link: `/site?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(field.name)}`,
          })) || [];

        return {
          name: category.name,
          image,
          link: `/site?category=${encodeURIComponent(category.name)}&subcategory=all`,
          subcategories,
        };
      }) || [];

    return [
      {
        name: "All",
        image: shop1,
        link: "/site?category=all&subcategory=all",
        subcategories: [],
      },
      ...dynamicCategories,
    ];
  }, [categories, categoryImages, fallbackImages]);

  return (
    <nav className="navbar">
      {/* ---------- TOP ---------- */}
      <div className="navbar-top">
        <div className="navbar-left">
          <span className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>☰</span>
          <span className="logo">wildBerries</span>
        </div>

        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-bar" />
          <FaSearch className="search-icon" />
        </div>

        <div className="navbar-right">
          <Link to="/site/location" className="icon-button">
            <FaMapMarkerAlt />
            <span className="icon-label">Location</span>
          </Link>
          <Link to="/site/profile" className="icon-button"> {/* Changed to /site/profile */}
            <FaUser />
            <span className="icon-label">Profile</span>
          </Link>
          <Link to="/site/cart" className="icon-button">
            <FaShoppingCart />
            <span className="icon-label">
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </span>
          </Link>
        </div>
      </div>

      {/* ---------- BOTTOM ---------- */}
      <div className="navbar-bottom">
        {categoriesLoading ? (
          <span className="nav-loading">Loading categories...</span>
        ) : (
          menuCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className={`nav-link ${activeCategory === cat.name.toLowerCase() ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(cat.name.toLowerCase());
                navigate(cat.link);
              }}
            >
              {cat.name}
            </Link>
          ))
        )}
      </div>

      {/* ---------- Sidebar Menu ---------- */}
      {menuOpen && (
        <div className="sidebar-menu">
          <button className="close-button" onClick={() => setMenuOpen(false)}>
            <FaTimes />
          </button>
          {menuCategories.map((cat) => (
            <div key={cat.name} className="sidebar-category">
              <Link
                to={cat.link}
                className={`sidebar-link ${activeCategory === cat.name.toLowerCase() ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat.name.toLowerCase());
                  navigate(cat.link);
                }}
              >
                <img src={cat.image} alt={cat.name} className="sidebar-image" />
                <span className="sidebar-name">{cat.name}</span>
              </Link>
              {cat.subcategories.length > 0 && (
                <div className="subcategory-section">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.link}
                      className="subcategory-link"
                      onClick={() => {
                        setActiveCategory(sub.name.toLowerCase());
                        navigate(sub.link);
                      }}
                    >
                      <img src={sub.image} alt={sub.name} className="subcategory-image" />
                      <span className="subcategory-name">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;