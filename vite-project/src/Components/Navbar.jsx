import React, { useState } from "react";
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
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

const Navbar = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = [
    { 
      name: "All", 
      image: shop1, 
      link: "/", 
      subcategories: [] 
    },
    { 
      name: "New In", 
      image: shop2, 
      link: "/category/new", 
      subcategories: [
        { name: "New Arrivals", image: shop2, link: "/category/new/arrivals" },
        { name: "Trending Now", image: shop2, link: "/category/new/trending" }
      ] 
    },
    { 
      name: "Sale", 
      image: shop3, 
      link: "/category/sale", 
      subcategories: [
        { name: "Clearance", image: shop3, link: "/category/sale/clearance" },
        { name: "Discounts", image: shop3, link: "/category/sale/discounts" }
      ] 
    },
    { 
      name: "Women Clothing", 
      image: shop4, 
      link: "/category/women-clothing", 
      subcategories: [
        { name: "Dresses", image: shop4, link: "/category/women-clothing/dresses" },
        { name: "Tops", image: shop4, link: "/category/women-clothing/tops" },
        { name: "Pants", image: shop4, link: "/category/women-clothing/pants" },
        { name: "Skirts", image: shop4, link: "/category/women-clothing/skirts" }
      ] 
    },
    { 
      name: "Beachwear", 
      image: shop5, 
      link: "/category/beachwear", 
      subcategories: [
        { name: "Swimwear", image: shop5, link: "/category/beachwear/swimwear" },
        { name: "Cover-Ups", image: shop5, link: "/category/beachwear/cover-ups" },
        { name: "Accessories", image: shop5, link: "/category/beachwear/accessories" }
      ] 
    },
    { 
      name: "Kids", 
      image: shop6, 
      link: "/category/kids", 
      subcategories: [
        { name: "Boys", image: shop6, link: "/category/kids/boys" },
        { name: "Girls", image: shop6, link: "/category/kids/girls" },
        { name: "Baby", image: shop6, link: "/category/kids/baby" }
      ] 
    },
    { 
      name: "Curve", 
      image: shop7, 
      link: "/category/curve", 
      subcategories: [
        { name: "Plus Size Tops", image: shop7, link: "/category/curve/tops" },
        { name: "Plus Size Dresses", image: shop7, link: "/category/curve/dresses" }
      ] 
    },
    { 
      name: "Men", 
      image: shop8, 
      link: "/category/men", 
      subcategories: [
        { name: "Shirts", image: shop8, link: "/category/men/shirts" },
        { name: "Jeans", image: shop8, link: "/category/men/jeans" },
        { name: "Shoes", image: shop8, link: "/category/men/shoes" }
      ] 
    },
    { 
      name: "Home", 
      image: shop9, 
      link: "/category/home", 
      subcategories: [
        { name: "Furniture", image: shop9, link: "/category/home/furniture" },
        { name: "Decor", image: shop9, link: "/category/home/decor" },
        { name: "Kitchen", image: shop9, link: "/category/home/kitchen" }
      ] 
    },
    { 
      name: "Deals", 
      image: shop10, 
      link: "/category/deals", 
      subcategories: [
        { name: "Flash Sales", image: shop10, link: "/category/deals/flash" },
        { name: "Bundles", image: shop10, link: "/category/deals/bundles" }
      ] 
    },
    { 
      name: "Brands", 
      image: shop11, 
      link: "/category/brands", 
      subcategories: [
        { name: "Popular Brands", image: shop11, link: "/category/brands/popular" },
        { name: "New Brands", image: shop11, link: "/category/brands/new" }
      ] 
    },
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
          <Link to="/location" className="icon-button">
            <FaMapMarkerAlt />
            <span className="icon-label">Location</span>
          </Link>
          <Link to="/login" className="icon-button">
            <FaUser />
            <span className="icon-label">Profile</span>
          </Link>
          <Link to="/cart" className="icon-button">
            <FaShoppingCart />
            <span className="icon-label">Cart</span>
          </Link>
        </div>
      </div>

      {/* ---------- BOTTOM ---------- */}
      <div className="navbar-bottom">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.link}
            className={`nav-link ${activeCategory === cat.name.toLowerCase() ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.name.toLowerCase())}
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
                      onClick={() => setMenuOpen(true)}
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