import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaUser, FaHome, FaCity, FaGlobe, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../Styles/location.css"; // Assuming you'll create a separate CSS file or integrate into existing

const Location = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    email: "", // Added email as it's often necessary for confirmations
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to a backend API
    // For now, simulate saving and redirect (e.g., back to home or profile)
    console.log("Address saved:", formData);
    alert("Address saved successfully!"); // Placeholder feedback
    navigate("/site"); // Redirect to main site or wherever appropriate
  };

  return (
    <div className="location-page">
      <div className="location-header">
        <FaMapMarkerAlt className="header-icon" />
        <h1>Set Your Delivery Address</h1>
      </div>
      <p className="location-description">
        Fill in your details below for accurate and fast delivery. You can edit this anytime from your profile.
      </p>
      <form className="location-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">
            <FaUser className="input-icon" /> Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address1">
            <FaHome className="input-icon" /> Address Line 1
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            placeholder="Street address, house number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address2">
            <FaHome className="input-icon" /> Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            placeholder="Apartment, suite, etc."
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">
            <FaCity className="input-icon" /> City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">
            <FaMapMarkerAlt className="input-icon" /> State/Region
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter your state or region"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="zip">
            <FaMapMarkerAlt className="input-icon" /> ZIP/Postal Code
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="Enter your ZIP code"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">
            <FaGlobe className="input-icon" /> Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter your country"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">
            <FaPhoneAlt className="input-icon" /> Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope className="input-icon" /> Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email for updates"
          />
        </div>
        <button type="submit" className="submit-button">
          Save Address
        </button>
      </form>
    </div>
  );
};

export default Location;