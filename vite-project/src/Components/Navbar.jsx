import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import "../Styles/navbar.css";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(2);
  const [showMenu, setShowMenu] = useState(false);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  return (
    <nav className="navbar">
      {/* ---------- LEFT ---------- */}
      <div className="navbar-left">
        <span className="logo">wildBerries</span>
        <span className="menu-icon" onClick={() => setShowMenu(!showMenu)}>☰</span>
        <div className="search-container">
          <input type="text" placeholder="Search wildBerries" className="search-bar" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* ---------- CENTER ---------- */}
      <div className={`navbar-center ${showMenu ? "active" : ""}`}>
        <div 
          className="nav-item" 
          onMouseEnter={() => setShowCatalogDropdown(true)} 
          onMouseLeave={() => setShowCatalogDropdown(false)}
        >
          <a href="#" className="nav-link">Catalog</a>
          {showCatalogDropdown && (
            <div className="dropdown center-dropdown">
              <a href="#">Clothes</a>
              <a href="#">Shoes</a>
              <a href="#">Accessories</a>
            </div>
          )}
        </div>
        <a href="/suppliers" className="nav-link">Suppliers</a>
        <a href="/stores" className="nav-link">Stores</a>  
        <a href="#" className="nav-link">Deals</a>
      </div>

      {/* ---------- RIGHT ---------- */}
      <div className="navbar-right">
        {/* Location */}
        <div 
          className="icon-button location-button" 
          onMouseEnter={() => setShowLocationDropdown(true)} 
          onMouseLeave={() => setShowLocationDropdown(false)}
        >
          <FaMapMarkerAlt />
          <span className="icon-label">Address</span>
          {showLocationDropdown && (
            <div className="dropdown location-dropdown">
              <a href="#">Kigali</a>
              <a href="#">Musanze</a>
              <a href="#">Rubavu</a>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="icon-button cart-button">
          <FaShoppingCart />
          <span className="icon-label">Cart ({cartCount})</span>
        </div>

        {/* Account */}
        <Link to="/profile" className="icon-button user-button">
          <FaUser />
          <span className="icon-label">Account</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;