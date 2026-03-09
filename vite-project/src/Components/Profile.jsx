import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt,
  FaEdit, FaCheck, FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope,
} from "react-icons/fa";
import "../Styles/profile.css";
import { useAuth } from "../contexts/AuthContext";
import { updateMyProfile } from "../services/AuthService";
import { fetchOrders } from "../services/OrderService";

const Profile = () => {
  const navigate = useNavigate();
  const { user, initializing, logout, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({ name: "", street: "", city: "", phone: "" });

  const ordersFetchedRef = useRef(false);

  // Sync form with user data when user loads
  useEffect(() => {
    if (!user) return;
    const addressParts = (user.address || "").split(",").map((s) => s.trim());
    setForm({
      name:   user.name   || "",
      phone:  user.phone  || "",
      street: addressParts[0] || "",
      city:   addressParts[1] || "",
    });
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (initializing) return;
    if (!user) navigate("/login", { replace: true });
  }, [initializing, user, navigate]);

  // Load orders once
  useEffect(() => {
    if (initializing || !user || ordersFetchedRef.current) return;
    ordersFetchedRef.current = true;
    let cancelled = false;
    setOrdersLoading(true);
    fetchOrders()
      .then((payload) => {
        if (!cancelled && payload?.success && Array.isArray(payload.data))
          setOrders(payload.data);
      })
      .catch((err) => console.error("Orders fetch failed", err))
      .finally(() => { if (!cancelled) setOrdersLoading(false); });
    return () => { cancelled = true; };
  }, [initializing, user]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const address = [form.street, form.city].filter(Boolean).join(", ");
      const payload = {
        name: form.name || undefined,
        phone: form.phone || undefined,
        address: address || undefined,
      };
      const res = await updateMyProfile(payload);
      if (res?.success) {
        await refreshProfile();
        setEditing(false);
      } else {
        setSaveError(res?.message || "Could not save changes.");
      }
    } catch (err) {
      setSaveError(err?.response?.data?.message || err?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    const addressParts = (user.address || "").split(",").map((s) => s.trim());
    setForm({
      name:   user.name  || "",
      phone:  user.phone || "",
      street: addressParts[0] || "",
      city:   addressParts[1] || "",
    });
    setSaveError("");
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // ---- Guards ----
  if (initializing) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <p style={{ color: "#888", fontSize: "16px" }}>Loading...</p>
      </div>
    );
  }
  if (!user) return null;

  const displayName = user.name || "Welcome Back";

  // ---- Tabs ----
  const tabs = [
    { id: "profile",   icon: <FaUser />,        label: "Profile"   },
    { id: "orders",    icon: <FaShoppingBag />,  label: "Orders"    },
    { id: "favorites", icon: <FaHeart />,        label: "Favorites" },
    { id: "settings",  icon: <FaCog />,          label: "Settings"  },
  ];

  // ---- Render Profile Tab ----
  const renderProfile = () => (
    <div className="tab-content">
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ margin: 0 }}>Personal Information</h3>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="profile-edit-btn">
            <FaEdit style={{ marginRight: "6px" }} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleSave} disabled={saving} className="profile-save-btn">
              <FaCheck style={{ marginRight: "6px" }} /> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancel} className="profile-cancel-btn">
              <FaTimes style={{ marginRight: "6px" }} /> Cancel
            </button>
          </div>
        )}
      </div>

      {saveError && (
        <div style={{ background: "#fff0f0", border: "1px solid #f8a0a0", borderRadius: "8px", padding: "10px 14px", color: "#c0392b", marginBottom: "16px", fontSize: "14px" }}>
          {saveError}
        </div>
      )}

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

        {/* Full Name */}
        <ProfileField
          icon={<FaUser />}
          label="Full Name"
          value={user.name}
          editing={editing}
          inputValue={form.name}
          placeholder="Enter your full name"
          onChange={(v) => setForm((p) => ({ ...p, name: v }))}
        />

        {/* Email — read only */}
        <ProfileField
          icon={<FaEnvelope />}
          label="Email"
          value={user.email}
          editing={false}
        />

        {/* Phone */}
        <ProfileField
          icon={<FaPhone />}
          label="Phone"
          value={user.phone}
          editing={editing}
          inputValue={form.phone}
          placeholder="Enter your phone number"
          onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
        />

        {/* Street Address */}
        <ProfileField
          icon={<FaMapMarkerAlt />}
          label="Street Address"
          value={user.address?.split(",")[0]?.trim()}
          editing={editing}
          inputValue={form.street}
          placeholder="e.g. KG 12 Ave, Plot 5"
          onChange={(v) => setForm((p) => ({ ...p, street: v }))}
        />

        {/* City */}
        <ProfileField
          icon={<FaMapMarkerAlt />}
          label="City"
          value={user.address?.split(",")[1]?.trim()}
          editing={editing}
          inputValue={form.city}
          placeholder="e.g. Kigali"
          onChange={(v) => setForm((p) => ({ ...p, city: v }))}
        />

        {/* Status — read only */}
        <ProfileField
          label="Account Status"
          value={user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : "Active"}
          editing={false}
          badge={true}
        />

      </div>
    </div>
  );

  // ---- Render Orders Tab ----
  const renderOrders = () => (
    <div className="tab-content">
      <h3>Order History</h3>
      {ordersLoading && <p style={{ color: "#888", marginTop: "16px" }}>Loading orders...</p>}
      {!ordersLoading && orders.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
          <FaShoppingBag size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
          <p style={{ fontSize: "16px" }}>No orders yet.</p>
          <button
            onClick={() => navigate("/site")}
            style={{ marginTop: "16px", padding: "10px 24px", background: "#6B2C91", color: "#fff", border: "none", borderRadius: "22px", cursor: "pointer", fontWeight: "600" }}
          >
            Start Shopping
          </button>
        </div>
      )}
      {!ordersLoading && orders.length > 0 && (
        <div className="items-grid" style={{ marginTop: "16px" }}>
          {orders.flatMap((order) =>
            (order.items || []).map((item) => {
              const product = item.product || {};
              return (
                <div key={`${order.id}-${item.id}`} className="item-card">
                  <div className="item-image" style={{ position: "relative" }}>
                    {product.images?.[0]
                      ? <img src={product.images[0]} alt={product.name} />
                      : <div style={{ height: "160px", background: "#f0e6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: "13px" }}>No Image</div>
                    }
                    <div className="discount" style={{ background: order.status === "delivered" ? "#43A047" : "#6B2C91", textTransform: "capitalize" }}>
                      {order.status || "pending"}
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

  return (
    <div className="profile-container">

      {/* ===== SIDEBAR ===== */}
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            <FaUser size={36} color="#6B2C91" />
          </div>
          <h2>{displayName}</h2>
          <p>{user.email || user.phone}</p>
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
          <li className="logout-tab" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="profile-content">
        {activeTab === "profile"   && renderProfile()}
        {activeTab === "orders"    && renderOrders()}
        {activeTab === "favorites" && (
          <div className="tab-content">
            <h3>Favorites</h3>
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
              <FaHeart size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
              <p>Favourites coming soon. Keep shopping to build your wishlist!</p>
            </div>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="tab-content">
            <h3>Settings</h3>
            <p style={{ color: "#aaa", marginTop: "12px" }}>
              More settings coming soon. Use the Profile tab to edit your name and address.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Reusable field row (view + edit mode) ----
const ProfileField = ({ icon, label, value, editing, inputValue, placeholder, onChange, badge }) => (
  <div style={{
    display: "flex", alignItems: "center", padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0", gap: "14px", minHeight: "58px",
    background: "#fff", transition: "background 0.15s",
  }}>
    {icon && (
      <div style={{ color: "#6B2C91", fontSize: "15px", width: "20px", flexShrink: 0 }}>
        {icon}
      </div>
    )}
    <div style={{ width: "120px", flexShrink: 0, fontWeight: "700", fontSize: "14px", color: "#444" }}>
      {label}
    </div>
    <div style={{ flex: 1 }}>
      {editing && onChange ? (
        <input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: "8px 12px", border: "1.5px solid #d0b8ff",
            borderRadius: "8px", fontSize: "14px", outline: "none",
            background: "#faf7ff", color: "#333", boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#6B2C91"}
          onBlur={(e) => e.target.style.borderColor = "#d0b8ff"}
        />
      ) : badge ? (
        <span style={{
          display: "inline-block", padding: "3px 12px", borderRadius: "20px",
          background: value === "Approved" || value === "Active" ? "#e8f5e9" : "#f3e8ff",
          color: value === "Approved" || value === "Active" ? "#2e7d32" : "#6B2C91",
          fontWeight: "600", fontSize: "13px",
        }}>
          {value || "—"}
        </span>
      ) : (
        <span style={{ fontSize: "14px", color: value ? "#333" : "#ccc", fontStyle: value ? "normal" : "italic" }}>
          {value || "Not provided"}
        </span>
      )}
    </div>
  </div>
);

export default Profile;
