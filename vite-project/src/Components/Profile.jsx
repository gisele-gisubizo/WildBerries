import React, { useState } from "react";
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../Styles/profile.css";

// Import product images (same as Home/Stores)
import item1 from "../assets/images/home/item1.jpg";
import item2 from "../assets/images/home/item2.jpg";
import item3 from "../assets/images/home/item3.jpg";
import item4 from "../assets/images/home/item4.jpg";
import item5 from "../assets/images/home/item5.jpg";
import item6 from "../assets/images/home/item6.jpg";
import item7 from "../assets/images/home/item7.jpg";
import item8 from "../assets/images/home/item8.jpg";
import item9 from "../assets/images/home/item9.jpg";
import item10 from "../assets/images/home/item10.jpg";
import item11 from "../assets/images/home/item11.jpg";
import item12 from "../assets/images/home/item12.jpg";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+250 788 123 456",
    address1: "123 Main Street",
    address2: "Apt 4B",
    city: "Kigali",
    state: "Kigali Province",
    postalCode: "12345",
    country: "Rwanda",
    gender: "Male",
    dateOfBirth: "1990-05-15",
    preferredContact: "Email",
  });

  const [editedUser, setEditedUser] = useState({ ...user });

  const orders = [
    { id: 1, date: "2025-09-01", total: "$49.98", status: "Delivered", product: { id: 1, name: "Item 1", image: item1, price: 29.99, description: "A stylish jacket for all seasons." } },
    { id: 2, date: "2025-09-05", total: "$29.99", status: "Shipped", product: { id: 4, name: "Item 4", image: item4, price: 39.99, description: "Elegant dress for special occasions." } },
  ];

  const favorites = [
    { id: 1, name: "Item 1", image: item1, price: 29.99, description: "A stylish jacket for all seasons." },
    { id: 4, name: "Item 4", image: item4, price: 39.99, description: "Elegant dress for special occasions." },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(editedUser);
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            <FaUser size={50} />
          </div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <ul className="nav-tabs">
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> Profile
          </li>
          <li
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingBag /> Orders
          </li>
          <li
            className={activeTab === "favorites" ? "active" : ""}
            onClick={() => setActiveTab("favorites")}
          >
            <FaHeart /> Favorites
          </li>
          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog /> Settings
          </li>
          <li
            className={activeTab === "logout" ? "active" : ""}
            onClick={() => setActiveTab("logout")}
          >
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>
      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="tab-content">
            <h3>Personal Information</h3>
            <div className="user-details">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Address Line 1:</strong> {user.address1}</p>
              <p><strong>Address Line 2:</strong> {user.address2}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>State/Province:</strong> {user.state}</p>
              <p><strong>Postal Code:</strong> {user.postalCode}</p>
              <p><strong>Country:</strong> {user.country}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
              <p><strong>Preferred Contact:</strong> {user.preferredContact}</p>
            </div>
          </div>
        )}
        {activeTab === "orders" && (
          <div className="tab-content">
            <h3>Order History</h3>
            {orders.length > 0 ? (
              <div className="items-grid">
                {orders.map((order) => (
                  <div key={order.id} className="item-card">
                    <div className="item-image">
                      <img src={order.product.image} alt={order.product.name} />
                      <div className="discount">-50%</div>
                    </div>
                    <div className="item-details">
                      <div className="price">
                        <span className="current-price">${order.product.price.toFixed(2)}</span>
                        <span className="old-price">${(order.product.price * 1.5).toFixed(2)}</span>
                      </div>
                      <p className="seller">{order.product.name}</p>
                      <p className="description">{order.product.description}</p>
                      <div className="order-info">
                        <p><strong>Order #{order.id}</strong> - {order.date}</p>
                        <p>Total: {order.total} | Status: {order.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders yet.</p>
            )}
          </div>
        )}
        {activeTab === "favorites" && (
          <div className="tab-content">
            <h3>Favorites</h3>
            {favorites.length > 0 ? (
              <div className="items-grid">
                {favorites.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <div className="discount">-50%</div>
                    </div>
                    <div className="item-details">
                      <div className="price">
                        <span className="current-price">${item.price.toFixed(2)}</span>
                        <span className="old-price">${(item.price * 1.5).toFixed(2)}</span>
                      </div>
                      <p className="seller">{item.name}</p>
                      <p className="description">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No favorites yet.</p>
            )}
          </div>
        )}
        {activeTab === "settings" && (
          <div className="tab-content">
            <h3>Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Address Line 1:</label>
                <input
                  type="text"
                  name="address1"
                  value={editedUser.address1}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Address Line 2:</label>
                <input
                  type="text"
                  name="address2"
                  value={editedUser.address2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={editedUser.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>State/Province:</label>
                <input
                  type="text"
                  name="state"
                  value={editedUser.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Postal Code:</label>
                <input
                  type="text"
                  name="postalCode"
                  value={editedUser.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Country:</label>
                <input
                  type="text"
                  name="country"
                  value={editedUser.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <select name="gender" value={editedUser.gender} onChange={handleInputChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editedUser.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Preferred Contact:</label>
                <select name="preferredContact" value={editedUser.preferredContact} onChange={handleInputChange}>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
              <button
                className="edit-btn"
                onClick={handleSave}
                disabled={!editMode}
              >
                {editMode ? "Save Changes" : "Edit Settings"}
              </button>
              {editMode && (
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setEditedUser({ ...user });
                    setEditMode(false);
                  }}
                >
                  Cancel
                </button>
              )}
              {!editMode && (
                <button
                  className="edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        )}
        {activeTab === "logout" && (
          <div className="tab-content">
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>
            <button className="edit-btn">Confirm Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;