import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import {
  FaCog,
  FaUserCircle,
  FaBell,
  FaDesktop,
  FaLock,
  FaSave,
} from "react-icons/fa";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: "Admin User",
    email: "admin@example.com",
    password: "",
    theme: "light",
    language: "English",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    twoFactorAuth: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log("Saved settings:", settings);
    toast.success("✅ Settings saved successfully!", {
      position: "top-right",
      autoClose: 2500,
    });
  };

  return (
    <div className="dashboard-container settings-page">
      <div className="dashboard-header-row">
        <h2>
          <FaCog style={{ marginRight: "10px", color: "#007bff" }} /> Admin
          Settings
        </h2>
      </div>

      <div className="settings-container">
        {/* PROFILE SETTINGS */}
        <section className="settings-section card">
          <h3 className="settings-title">
            <FaUserCircle className="section-icon" /> Profile Information
          </h3>
          <div className="settings-row">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={settings.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
          <div className="settings-row">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="settings-row">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={settings.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
        </section>

        {/* NOTIFICATION SETTINGS */}
        <section className="settings-section card">
          <h3 className="settings-title">
            <FaBell className="section-icon" /> Notification Preferences
          </h3>
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              Email Notifications
            </label>
          </div>
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleChange}
              />
              SMS Notifications
            </label>
          </div>
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                name="pushNotifications"
                checked={settings.pushNotifications}
                onChange={handleChange}
              />
              Push Notifications
            </label>
          </div>
        </section>

        {/* SYSTEM SETTINGS */}
        <section className="settings-section card">
          <h3 className="settings-title">
            <FaDesktop className="section-icon" /> System Preferences
          </h3>
          <div className="settings-row">
            <label>Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
            >
              <option value="light">🌞 Light</option>
              <option value="dark">🌙 Dark</option>
            </select>
          </div>
          <div className="settings-row">
            <label>Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="French">Français</option>
              <option value="Kinyarwanda">Kinyarwanda</option>
            </select>
          </div>
        </section>

        {/* SECURITY SETTINGS */}
        <section className="settings-section card">
          <h3 className="settings-title">
            <FaLock className="section-icon" /> Security
          </h3>
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={handleChange}
              />
              Enable Two-Factor Authentication (2FA)
            </label>
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="settings-actions">
          <button className="save-btn" onClick={handleSave}>
            <FaSave style={{ marginRight: "8px" }} /> Save Settings
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
