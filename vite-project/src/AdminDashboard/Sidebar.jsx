import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaStore,
  FaClipboardList,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaUserTie,
} from "react-icons/fa";
import "./sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* 🔹 Top Logo/Title */}
      <div className="sidebar-logo">
        <h2 className="logo-text">Wildberries</h2>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "nav-item active" : "nav-item"}
        >
          <FaHome /> Dashboard
        </Link>

        <Link
          to="/dashboard/vendors"
          className={isActive("/dashboard/vendors") ? "nav-item active" : "nav-item"}
        >
          <FaUserTie /> Vendors
        </Link>

        <Link
          to="/dashboard/shops"
          className={isActive("/dashboard/shops") ? "nav-item active" : "nav-item"}
        >
          <FaStore /> Shops
        </Link>

        <Link
          to="/dashboard/shopapplications"
          className={
            isActive("/dashboard/shopapplications")
              ? "nav-item active"
              : "nav-item"
          }
        >
          <FaClipboardList /> Shop&apos;s Applications
        </Link>

        <Link
          to="/dashboard/messages"
          className={isActive("/dashboard/messages") ? "nav-item active" : "nav-item"}
        >
          <FaEnvelope /> Messages
        </Link>

        <Link
          to="/dashboard/settings"
          className={isActive("/dashboard/settings") ? "nav-item active" : "nav-item"}
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

export default Sidebar;
