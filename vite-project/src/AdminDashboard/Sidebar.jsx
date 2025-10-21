import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaStore,
  FaClipboardList,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Optional: remove any other stored user data
    // localStorage.removeItem("user");

    // Redirect to home or login
    navigate("/", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* 🔹 Top Logo/Title */}
      <div className="sidebar-logo">
        <h2 className="logo-text">Wildberries</h2>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/Dashboard"
          className={isActive("/Dashboard") ? "nav-item active" : "nav-item"}
        >
          <FaHome /> Dashboard
        </Link>

        <Link
          to="/Dashboard/applications"
          className={isActive("/Dashboard/applications") ? "nav-item active" : "nav-item"}
        >
          <FaClipboardList /> Applications
        </Link>

        <Link
          to="/Dashboard/shops"
          className={isActive("/Dashboard/shops") ? "nav-item active" : "nav-item"}
        >
          <FaStore /> Shops
        </Link>

        <Link
          to="/Dashboard/messages"
          className={isActive("/Dashboard/messages") ? "nav-item active" : "nav-item"}
        >
          <FaEnvelope /> Messages
        </Link>

        <Link
          to="/Dashboard/settings"
          className={isActive("/Dashboard/settings") ? "nav-item active" : "nav-item"}
        >
          <FaCog /> Settings
        </Link>

        <button onClick={handleLogout} className="nav-item logout">
      <FaSignOutAlt /> Logout
    </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
