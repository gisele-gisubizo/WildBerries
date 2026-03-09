import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../Styles/profile.css";
import { useAuth } from "../contexts/AuthContext";
import { fetchOrders } from "../services/OrderService";

const Profile = () => {
  const navigate = useNavigate();
  const { user, initializing, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Track whether we've fetched orders already so we don't re-fetch on every render
  const ordersFetchedRef = useRef(false);

  // ---- Guard: redirect only after auth is fully resolved ----
  useEffect(() => {
    if (initializing) return; // still checking — do nothing
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [initializing, user, navigate]);

  // ---- Load orders once when the tab is opened ----
  useEffect(() => {
    if (initializing || !user || ordersFetchedRef.current) return;
    ordersFetchedRef.current = true;

    let cancelled = false;
    setOrdersLoading(true);

    fetchOrders()
      .then((payload) => {
        if (!cancelled && payload?.success && Array.isArray(payload.data)) {
          setOrders(payload.data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load orders", err);
          setOrdersError("Could not load orders.");
        }
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => { cancelled = true; };
  }, [initializing, user]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // ---- Render states ----
  if (initializing) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <p style={{ fontSize: "16px", color: "#888" }}>Loading...</p>
      </div>
    );
  }

  // user is null after initializing — redirect handled by useEffect above,
  // but render null here to avoid flashing empty UI while navigating
  if (!user) return null;

  const renderProfile = () => (
    <div className="tab-content">
      <h3>Personal Information</h3>
      <div className="user-details" style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
        {[
          ["Name", user.name],
          ["Email", user.email],
          ["Phone", user.phone],
          ["Address", user.address],
          ["Role", user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : null],
          ["Status", user.status],
          ["Joined", user.createdAt ? new Date(user.createdAt).toLocaleDateString() : null],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", gap: "12px", padding: "12px 16px", background: "#faf7ff", borderRadius: "8px", border: "1px solid #f0e6ff" }}>
            <span style={{ fontWeight: "700", color: "#555", minWidth: "90px" }}>{label}</span>
            <span style={{ color: "#333" }}>{value || <span style={{ color: "#bbb", fontStyle: "italic" }}>Not provided</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="tab-content">
      <h3>Order History</h3>
      {ordersLoading && <p style={{ color: "#888", marginTop: "12px" }}>Loading orders...</p>}
      {ordersError && <p style={{ color: "#e53935", marginTop: "12px" }}>{ordersError}</p>}
      {!ordersLoading && !ordersError && orders.length === 0 && (
        <p style={{ color: "#aaa", marginTop: "12px" }}>No orders yet. Start shopping!</p>
      )}
      {!ordersLoading && orders.length > 0 && (
        <div className="items-grid" style={{ marginTop: "16px" }}>
          {orders.flatMap((order) =>
            (order.items || []).map((item) => {
              const product = item.product || {};
              const coverImage = product.images?.[0] || null;
              return (
                <div key={`${order.id}-${item.id}`} className="item-card">
                  <div className="item-image">
                    {coverImage
                      ? <img src={coverImage} alt={product.name} />
                      : <div style={{ height: "160px", background: "#f0e6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "13px" }}>No Image</div>
                    }
                    <div className="discount" style={{ background: order.status === "delivered" ? "#43A047" : "#6B2C91" }}>
                      {order.status ?? "pending"}
                    </div>
                  </div>
                  <div className="item-details">
                    <div className="price">
                      <span className="current-price">${(Number(item.price) || 0).toFixed(2)}</span>
                    </div>
                    <p className="seller">{product.name || "Product"}</p>
                    <p className="description">Qty: {item.quantity} · Order #{order.id}</p>
                    <div className="order-info">
                      <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>Total: ${(Number(order.totalAmount) || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: "profile",   icon: <FaUser />,       label: "Profile"   },
    { id: "orders",    icon: <FaShoppingBag />, label: "Orders"    },
    { id: "favorites", icon: <FaHeart />,       label: "Favorites" },
    { id: "settings",  icon: <FaCog />,         label: "Settings"  },
  ];

  return (
    <div className="profile-container">
      {/* ---- SIDEBAR ---- */}
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="user-avatar"><FaUser size={36} color="#6B2C91" /></div>
          <h2>{user.name || "Welcome Back"}</h2>
          <p>{user.email || user.phone}</p>
          <p className="user-role" style={{ fontSize: "12px", color: "#a78bce", marginTop: "2px" }}>
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Customer"}
          </p>
        </div>

        <ul className="nav-tabs">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </li>
          ))}
          <li onClick={handleLogout} style={{ color: "#e53935", marginTop: "8px" }}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      {/* ---- CONTENT ---- */}
      <div className="profile-content">
        {activeTab === "profile"   && renderProfile()}
        {activeTab === "orders"    && renderOrders()}
        {activeTab === "favorites" && (
          <div className="tab-content">
            <h3>Favorites</h3>
            <p style={{ color: "#aaa", marginTop: "12px" }}>Favourites are coming soon. Keep shopping to build your wishlist!</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="tab-content">
            <h3>Settings</h3>
            <p style={{ color: "#aaa", marginTop: "12px" }}>Profile editing coming soon. Contact support if you need to update your details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
