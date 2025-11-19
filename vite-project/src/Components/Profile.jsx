import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "../Styles/profile.css";
import { useAuth } from "../contexts/AuthContext";
import { fetchOrders } from "../services/OrderService";

const Profile = () => {
  const navigate = useNavigate();
  const { user, initializing, logout, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initializing) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const data = await refreshProfile();
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load profile information.",
        );
      } finally {
        setProfileLoading(false);
      }
    };

    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const payload = await fetchOrders();
        if (payload?.success && Array.isArray(payload.data)) {
          setOrders(payload.data);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadProfile();
    loadOrders();
  }, [initializing, navigate, refreshProfile, user]);

  const displayProfile = useMemo(() => {
    if (!profile && user) {
      return {
        id: user.id,
        phone: user.phone,
        role: user.role,
      };
    }
    return profile;
  }, [profile, user]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const renderOrderItems = () => {
    if (ordersLoading) {
      return <p>Loading orders...</p>;
    }

    if (!orders.length) {
      return <p>No orders yet.</p>;
    }

    return (
      <div className="items-grid">
        {orders.map((order) => {
          const lineItems = order.items || [];
          return lineItems.map((item) => {
            const product = item.product || {};
            const coverImage =
              product.images && product.images.length > 0
                ? product.images[0]
                : null;

            return (
              <div key={`${order.id}-${item.id}`} className="item-card">
                <div className="item-image">
                  {coverImage ? (
                    <img src={coverImage} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                  <div className="discount">{order.status ?? "pending"}</div>
                </div>
                <div className="item-details">
                  <div className="price">
                    <span className="current-price">
                      ${(Number(item.price) || 0).toFixed(2)}
                    </span>
                    <span className="old-price">
                      ${((Number(item.price) || 0) * 1.1).toFixed(2)}
                    </span>
                  </div>
                  <p className="seller">{product.name || "Product"}</p>
                  <p className="description">
                    Quantity: {item.quantity} · Order #{order.id}
                  </p>
                  <div className="order-info">
                    <p>
                      <strong>Placed:</strong>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p>Total: ${(Number(order.totalAmount) || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            <FaUser size={50} />
          </div>
          <h2>{displayProfile?.name || "Welcome Back"}</h2>
          <p>{displayProfile?.email || displayProfile?.phone}</p>
          <p className="user-role">
            {displayProfile?.role
              ? displayProfile.role.charAt(0).toUpperCase() +
                displayProfile.role.slice(1)
              : ""}
          </p>
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
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="tab-content">
            <h3>Personal Information</h3>
            {profileLoading ? (
              <p>Loading profile...</p>
            ) : (
              <div className="user-details">
                <p>
                  <strong>Name:</strong>{" "}
                  {displayProfile?.name || "Not provided"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {displayProfile?.email || "Not provided"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {displayProfile?.phone || "Not provided"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {displayProfile?.address || "Not provided"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {displayProfile?.status || "Pending"}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {displayProfile?.createdAt
                    ? new Date(displayProfile.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="tab-content">
            <h3>Order History</h3>
            {renderOrderItems()}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="tab-content">
            <h3>Favorites</h3>
            <p>
              Favorites are coming soon. Keep shopping to build your wishlist!
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="tab-content">
            <h3>Settings</h3>
            <p>
              Profile editing will be available soon. Contact support if you
              need to update your details.
            </p>
          </div>
        )}

        {activeTab === "logout" && (
          <div className="tab-content">
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>
            <button className="edit-btn" onClick={handleLogout}>
              Confirm Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
