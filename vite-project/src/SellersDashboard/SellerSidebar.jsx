import React from 'react' 
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,     // Products
  FaShoppingCart, // Orders
  FaMoneyBillWave, // Payments
  FaCog,
  FaSignOutAlt,
  FaEnvelope,
} from "react-icons/fa";
import '../AdminDashboard/sidebar.css';

const SellerSidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2 className="logo-text">Wildberries</h2>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/SellerDashboard"
          className={isActive("/SellerDashboard") ? "nav-item active" : "nav-item"}
        >
          <FaHome /> Dashboard
        </Link>

        <Link
          to="/SellerDashboard/products"
          className={isActive("/SellerDashboard/products") ? "nav-item active" : "nav-item"}
        >
          <FaBoxOpen /> Products
        </Link>

        <Link
          to="/SellerDashboard/orders"
          className={isActive("/SellerDashboard/orders") ? "nav-item active" : "nav-item"}
        >
          <FaShoppingCart /> Orders
        </Link>

        <Link
          to="/SellerDashboard/payments"
          className={isActive("/SellerDashboard/payments") ? "nav-item active" : "nav-item"}
        >
          <FaMoneyBillWave /> Payments
        </Link>
     <Link
          to="/SellerDashboard/messages"
          className={isActive("/SellerDashboard/messages") ? "nav-item active" : "nav-item"}
        >
          <FaEnvelope /> Messages
        </Link>

        <Link
          to="/SellerDashboard/settings"
          className={isActive("/SellerDashboard/settings") ? "nav-item active" : "nav-item"}
        >
          <FaCog /> Settings
        </Link>

        <Link to="/" className="nav-item logout">
          <FaSignOutAlt /> Logout
        </Link>
      </nav>
    </aside>
  );
};
export default SellerSidebar;
