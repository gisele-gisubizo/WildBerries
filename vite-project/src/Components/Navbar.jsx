import React, { useState } from "react";
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaTimes, FaHome } from "react-icons/fa";
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

function Navbar() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { 
      name: "All", 
      image: shop1, 
      link: "/site?category=all&subcategory=all", 
      subcategories: [] 
    },
    { 
      name: "New In", 
      image: shop2, 
      link: "/site?category=New In&subcategory=all", 
      subcategories: [
        { name: "New Arrivals", image: shop2, link: "/site?category=New In&subcategory=New Arrivals" },
        { name: "Trending Now", image: shop2, link: "/site?category=New In&subcategory=Trending Now" }
      ] 
    },
    { 
      name: "Sale", 
      image: shop3, 
      link: "/site?category=Sale&subcategory=all", 
      subcategories: [
        { name: "Clearance", image: shop3, link: "/site?category=Sale&subcategory=Clearance" },
        { name: "Discounts", image: shop3, link: "/site?category=Sale&subcategory=Discounts" }
      ] 
    },
    { 
      name: "Women Clothing", 
      image: shop4, 
      link: "/site?category=Women Clothing&subcategory=all", 
      subcategories: [
        { name: "Dresses", image: shop4, link: "/site?category=Women Clothing&subcategory=Dresses" },
        { name: "Tops", image: shop4, link: "/site?category=Women Clothing&subcategory=Tops" },
        { name: "Pants", image: shop4, link: "/site?category=Women Clothing&subcategory=Pants" },
        { name: "Skirts", image: shop4, link: "/site?category=Women Clothing&subcategory=Skirts" }
      ] 
    },
    { 
      name: "Beachwear", 
      image: shop5, 
      link: "/site?category=Beachwear&subcategory=all", 
      subcategories: [
        { name: "Swimwear", image: shop5, link: "/site?category=Beachwear&subcategory=Swimwear" },
        { name: "Cover-Ups", image: shop5, link: "/site?category=Beachwear&subcategory=Cover-Ups" },
        { name: "Accessories", image: shop5, link: "/site?category=Beachwear&subcategory=Accessories" }
      ] 
    },
    { 
      name: "Kids", 
      image: shop6, 
      link: "/site?category=Kids&subcategory=all", 
      subcategories: [
        { name: "Boys", image: shop6, link: "/site?category=Kids&subcategory=Boys" },
        { name: "Girls", image: shop6, link: "/site?category=Kids&subcategory=Girls" },
        { name: "Baby", image: shop6, link: "/site?category=Kids&subcategory=Baby" }
      ] 
    },
    { 
      name: "Curve", 
      image: shop7, 
      link: "/site?category=Curve&subcategory=all", 
      subcategories: [
        { name: "Plus Size Tops", image: shop7, link: "/site?category=Curve&subcategory=Plus Size Tops" },
        { name: "Plus Size Dresses", image: shop7, link: "/site?category=Curve&subcategory=Plus Size Dresses" }
      ] 
    },
    { 
      name: "Men", 
      image: shop8, 
      link: "/site?category=Men&subcategory=all", 
      subcategories: [
        { name: "Shirts", image: shop8, link: "/site?category=Men&subcategory=Shirts" },
        { name: "Jeans", image: shop8, link: "/site?category=Men&subcategory=Jeans" },
        { name: "Shoes", image: shop8, link: "/site?category=Men&subcategory=Shoes" }
      ] 
    },
    { 
      name: "Home", 
      image: shop9, 
      link: "/site?category=Home&subcategory=all", 
      subcategories: [
        { name: "Furniture", image: shop9, link: "/site?category=Home&subcategory=Furniture" },
        { name: "Decor", image: shop9, link: "/site?category=Home&subcategory=Decor" },
        { name: "Kitchen", image: shop9, link: "/site?category=Home&subcategory=Kitchen" }
      ] 
    },
    { 
      name: "Deals", 
      image: shop10, 
      link: "/site?category=Deals&subcategory=all", 
      subcategories: [
        { name: "Flash Sales", image: shop10, link: "/site?category=Deals&subcategory=Flash Sales" },
        { name: "Bundles", image: shop10, link: "/site?category=Deals&subcategory=Bundles" }
      ] 
    },
    { 
      name: "Brands", 
      image: shop11, 
      link: "/site?category=Brands&subcategory=all", 
      subcategories: [
        { name: "Popular Brands", image: shop11, link: "/site?category=Brands&subcategory=Popular Brands" },
        { name: "New Brands", image: shop11, link: "/site?category=Brands&subcategory=New Brands" }
      ] 
    },
  ];

  const navLinks = [
    { name: "All", link: "/site?category=all&subcategory=all" },
    { name: "Women", link: "/site?category=Women Clothing&subcategory=all" },
    { name: "Men", link: "/site?category=Men&subcategory=all" },
    { name: "Kids", link: "/site?category=Kids&subcategory=all" },
    { name: "Curve", link: "/site?category=Curve&subcategory=all" },
    { name: "Home", link: "/site" },
  ];

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
          <Link to="/site/profile" className="icon-button">
            <FaUser />
            <span className="icon-label">Profile</span>
          </Link>
          <Link to="/site/cart" className="icon-button">
            <FaShoppingCart />
            <span className="icon-label">Cart</span>
          </Link>
        </div>
      </div>

      {/* ---------- BOTTOM ---------- */}
      <div className="navbar-bottom">
        {navLinks.map((cat) => (
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
        ))}
      </div>

      {/* ---------- Sidebar Menu ---------- */}
      {menuOpen && (
        <div className="sidebar-menu">
          <button className="close-button" onClick={() => setMenuOpen(false)}>
            <FaTimes />
          </button>
          {categories.map((cat) => (
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
}

export default Navbar;