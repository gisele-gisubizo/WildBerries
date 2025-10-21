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
          to="/seller-dashboard"
          className={isActive("/seller-dashboard") ? "nav-item active" : "nav-item"}
        >
          <FaHome /> Dashboard
        </Link>

        <Link
          to="/seller-dashboard/products"
          className={isActive("/seller-dashboard/products") ? "nav-item active" : "nav-item"}
        >
          <FaBoxOpen /> Products
        </Link>

        <Link
          to="/seller-dashboard/orders"
          className={isActive("/seller-dashboard/orders") ? "nav-item active" : "nav-item"}
        >
          <FaShoppingCart /> Orders
        </Link>

        <Link
          to="/seller-dashboard/payments"
          className={isActive("/seller-dashboard/payments") ? "nav-item active" : "nav-item"}
        >
          <FaMoneyBillWave /> Payments
        </Link>
     <Link
          to="/seller-dashboard/messages"
          className={isActive("/seller-dashboard/messages") ? "nav-item active" : "nav-item"}
        >
          <FaEnvelope /> Messages
        </Link>

        <Link
          to="/seller-dashboard/settings"
          className={isActive("/seller-dashboard/settings") ? "nav-item active" : "nav-item"}
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
