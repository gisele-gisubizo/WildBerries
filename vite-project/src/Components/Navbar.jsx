import React from 'react';
import { FaMapMarkerAlt, FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import '../Styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">wildBerries</span>
        <span className="menu-icon">☰</span>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search wildBerries"
            className="search-bar"
          />
          <FaSearch className="search-icon" />
        </div>
      </div>
      <div className="navbar-center">
        <a href="#" className="nav-link">Catalog</a>
        <a href="#" className="nav-link">Suppliers</a>
        <a href="#" className="nav-link">Stores</a>
        <a href="#" className="nav-link">Deals</a>
      </div>
      <div className="navbar-right">
        <button className="icon-button">
          <FaMapMarkerAlt />
          <span className="icon-label">Address</span>
        </button>
        <button className="icon-button">
          <FaShoppingCart />
          <span className="icon-label">Cart</span>
        </button>
        <button className="icon-button">
          <FaUser />
          <span className="icon-label">Login</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;