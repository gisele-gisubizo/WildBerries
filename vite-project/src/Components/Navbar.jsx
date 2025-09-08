import React, { useState } from 'react';
import { FaMapMarkerAlt, FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import '../Styles/navbar.css';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(2); // Example cart count
  const [showMenu, setShowMenu] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">wildBerries</span>
        <span className="menu-icon" onClick={() => setShowMenu(!showMenu)}>☰</span>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search wildBerries"
            className="search-bar"
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <div className={`navbar-center ${showMenu ? 'active' : ''}`}>
        <div className="nav-item" onMouseEnter={() => setShowCatalogDropdown(true)} onMouseLeave={() => setShowCatalogDropdown(false)}>
          <a href="#" className="nav-link">Catalog</a>
          {showCatalogDropdown && (
            <div className="dropdown">
              <a href="#">Clothes</a>
              <a href="#">Shoes</a>
              <a href="#">Accessories</a>
            </div>
          )}
        </div>
        <a href="#" className="nav-link">Suppliers</a>
        <a href="#" className="nav-link">Stores</a>
        <a href="#" className="nav-link">Deals</a>
      </div>

      <div className="navbar-right">
        <div className="icon-button location-button">
          <FaMapMarkerAlt />
          <span className="icon-label">Address</span>
          <div className="dropdown">
            <a href="#">Kigali</a>
            <a href="#">Musanze</a>
            <a href="#">Rubavu</a>
          </div>
        </div>

        <div className="icon-button cart-button">
          <FaShoppingCart />
          <span className="icon-label">Cart ({cartCount})</span>
        </div>

        <div className="icon-button user-button" onMouseEnter={() => setShowAccountDropdown(true)} onMouseLeave={() => setShowAccountDropdown(false)}>
          <FaUser />
          <span className="icon-label">Account</span>
          {showAccountDropdown && (
            <div className="dropdown account-dropdown">
              <a href="#">Profile</a>
              <a href="#">Orders</a>
              <a href="#">Favorites</a>
              <a href="#">Logout</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
