import React, { useEffect, useMemo, useState } from "react";
import { FiUsers, FiFileText } from "react-icons/fi";
import { FaStore, FaUserTie } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import {
  getApprovedSellers,
  getPendingSellers,
  getRejectedSellers,
} from "../services/AuthService";
import { fetchProducts } from "../services/ProductService";

export default function DashboardHome() {
  const [isExporting, setIsExporting] = useState(false);
  const [applicationFilter, setApplicationFilter] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");

  const [kpis, setKpis] = useState({
    totalSellers: 0,
    activeSellers: 0,
    totalApplications: 0,
  });

  const [applications, setApplications] = useState([]);
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alice Mutesi",
      type: "Seller",
      subject: "Issue with shop approval",
      content:
        "Hello admin, my shop approval seems delayed. Could you check?",
      date: "2025-09-05",
      status: "Unread",
      reply: "",
    },
    {
      id: 2,
      sender: "John Doe",
      type: "Customer",
      subject: "Problem with order",
      content: "I placed an order but it hasn’t arrived yet.",
      date: "2025-09-07",
      status: "Read",
      reply: "",
    },
    {
      id: 3,
      sender: "Brian Uwimana",
      type: "Seller",
      subject: "Payment issue",
      content: "I have not received payment for my last sales.",
      date: "2025-09-08",
      status: "Replied",
      reply: "Hello Brian, we checked and your payment is being processed.",
    },
  ]);

  const itemsPerPage = 5;
  const [applicationPage, setApplicationPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [approvedRes, pendingRes, rejectedRes, productRes] =
        await Promise.all([
          getApprovedSellers(),
          getPendingSellers(),
          getRejectedSellers(),
          fetchProducts({ limit: 100 }),
        ]);

      const approvedList = approvedRes?.data || [];
      setApprovedSellers(approvedList);

      const pendingList = pendingRes?.data || [];
      const rejectedList = rejectedRes?.data || [];

      const normalizedApplications = [
        ...approvedList.map((seller) => ({
          ...seller,
          status: "approved",
        })),
        ...pendingList.map((seller) => ({
          ...seller,
          status: "pending",
        })),
        ...rejectedList.map((seller) => ({
          ...seller,
          status: "rejected",
        })),
      ];

      setApplications(normalizedApplications);

      setKpis({
        totalSellers: approvedList.length,
        activeSellers: approvedList.filter(
          (seller) => seller.status === "approved",
        ).length,
        totalApplications: normalizedApplications.length,
      });

      setProducts(productRes.products || []);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error loading dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stockStatusData = useMemo(() => {
    const stockCounts = { "in-stock": 0, "low-stock": 0, "out-of-stock": 0 };
    products.forEach((product) => {
      const stock = Number(product.stock) || 0;
      if (stock <= 0) stockCounts["out-of-stock"] += 1;
      else if (stock <= 10) stockCounts["low-stock"] += 1;
      else stockCounts["in-stock"] += 1;
    });
    return [
      { name: "In Stock", value: stockCounts["in-stock"], color: "#28a745" },
      { name: "Low Stock", value: stockCounts["low-stock"], color: "#ffc107" },
      {
        name: "Out of Stock",
        value: stockCounts["out-of-stock"],
        color: "#dc3545",
      },
    ];
  }, [products]);

  const sellerStatusData = useMemo(() => {
    const statusCounts = { approved: 0, pending: 0, rejected: 0 };
    applications.forEach((a) => {
      if (statusCounts[a.status] !== undefined) statusCounts[a.status] += 1;
    });
    return [
      { name: "Approved", value: statusCounts.approved, color: "#6c757d" },
      { name: "Pending", value: statusCounts.pending, color: "#ffc107" },
      { name: "Declined", value: statusCounts.rejected, color: "#dc3545" },
    ];
  }, [applications]);

  const statusLabels = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Declined",
  };

  const statusColors = {
    approved: "#217abf",
    pending: "#b0881a",
    rejected: "#c62828",
  };
  const backgroundColor = {
    approved: "#d9edf7",
    pending: "#fff4d9",
    rejected: "#fbe2e2",
  };
  const borderColor = {
    approved: "#a1d0f5",
    pending: "#ffe7a1",
    rejected: "#f5c6c6",
  };

  const filteredApplications = applications.filter(
    (a) =>
      (!applicationFilter || a.status === applicationFilter) &&
      ((a.name && a.name.toLowerCase().includes(applicationSearch.toLowerCase())) ||
        (a.phone && a.phone.includes(applicationSearch)) ||
        (a.address &&
          a.address.toLowerCase().includes(applicationSearch.toLowerCase())) ||
        (a.status &&
          statusLabels[a.status]
            ?.toLowerCase()
            .includes(applicationSearch.toLowerCase()))),
  );

  const filteredMessages = messages.filter(
    (m) =>
      m.sender.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      m.content.toLowerCase().includes(applicationSearch.toLowerCase()),
  );

  const paginate = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleExportPDF = () => {
    setIsExporting(true);
    toast.success("This is a demo. PDF export not implemented.");
    setTimeout(() => setIsExporting(false), 1000);
  };

  const handleReply = (message) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id && msg.status === "Unread"
          ? { ...msg, status: "Read" }
          : msg,
      ),
    );
    setSelectedMessage(message);
    setReplyText("");
    setShowModal(true);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedMessage.id
          ? { ...msg, reply: replyText, status: "Replied" }
          : msg,
      ),
    );
    toast.success("Reply sent successfully ✅");
    setShowModal(false);
    setReplyText("");
    setSelectedMessage(null);
  };

  const viewReply = (message) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id && msg.status === "Unread"
          ? { ...msg, status: "Read" }
          : msg,
      ),
    );

    toast.info(`Reply: ${message.reply}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-top">
          <h1>Welcome to your e-commerce dashboard!</h1>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="export-btn"
          >
            <FiFileText />
            {isExporting ? "Generating..." : "Export PDF Report"}
          </button>
        </div>
      </div>

      <div className="dashboard-kpi-wrapper">
        <div className="kpi-card">
          <FaUserTie className="kpi-icon" />
          <div>Total Sellers</div>
          <div>{kpis.totalSellers}</div>
        </div>
        <div className="kpi-card">
          <FiUsers className="kpi-icon" />
          <div>Active Vendors</div>
          <div>{kpis.activeSellers}</div>
        </div>
        <div className="kpi-card">
          <FiUsers className="kpi-icon" />
          <div>Total Active Shops</div>
          <div>{approvedSellers.length}</div>
        </div>
        <div className="kpi-card">
          <FaStore className="kpi-icon" />
          <div>Total Applications</div>
          <div>{kpis.totalApplications}</div>
        </div>
      </div>

      <div className="dashboard-analytics-row">
        <div className="dashboard-chart-box">
          <h3>Product Stock Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stockStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-chart-box">
          <h3>Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sellerStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" style={{ fontSize: "0.75rem" }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#007bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-header-row">
          <h2>Seller & Shop Applications</h2>
          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Search applications..."
              value={applicationSearch}
              onChange={(e) => setApplicationSearch(e.target.value)}
              className="search-input"
            />
            <select
              className="select-filter"
              value={applicationFilter}
              onChange={(e) => setApplicationFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Declined</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>ID Doc</th>
                <th>Business Doc</th>
              </tr>
            </thead>
            <tbody>
              {paginate(filteredApplications, applicationPage).map((app) => (
                <tr key={app.id}>
                  <td>{app.name || "N/A"}</td>
                  <td>{app.phone || "N/A"}</td>
                  <td>{app.email || "N/A"}</td>
                  <td>{app.address || "N/A"}</td>
                  <td>
                    <span
                      className={`status-badge ${app.status}`}
                      style={{
                        backgroundColor:
                          backgroundColor[app.status] || "#eee",
                        color: statusColors[app.status] || "#333",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        borderColor: borderColor[app.status] || "#ddd",
                        borderStyle: "solid",
                        borderWidth: "1px",
                      }}
                    >
                      {statusLabels[app.status] || app.status}
                    </span>
                  </td>
                  <td>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {app.idCopy ? (
                      <a
                        href={app.idCopy}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        National Identity
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {app.licenseDoc ? (
                      <a
                        href={app.licenseDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        License Document
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button
            onClick={() => setApplicationPage((prev) => Math.max(prev - 1, 1))}
            disabled={applicationPage === 1}
          >
            Prev
          </button>
          <span>Page {applicationPage}</span>
          <button
            onClick={() =>
              setApplicationPage((prev) =>
                prev * itemsPerPage < filteredApplications.length
                  ? prev + 1
                  : prev,
              )
            }
            disabled={
              applicationPage * itemsPerPage >= filteredApplications.length
            }
          >
            Next
          </button>
        </div>

        <div className="dashboard-header-row">
          <h2>Messages</h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Content</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginate(filteredMessages, messagePage).map((msg) => (
              <tr key={msg.id}>
                <td>{msg.sender}</td>
                <td>{msg.type}</td>
                <td>{msg.subject}</td>
                <td>{msg.content}</td>
                <td>{msg.date}</td>
                <td>
                  <span className={`status-badge ${msg.status.toLowerCase()}`}>
                    {msg.status}
                  </span>
                </td>
                <td>
                  {msg.status === "Replied" ? (
                    <button
                      onClick={() => viewReply(msg)}
                      className="view-reply-btn"
                    >
                      View Reply
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReply(msg)}
                      className="reply-btn"
                    >
                      Reply
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => setMessagePage((prev) => Math.max(prev - 1, 1))}
            disabled={messagePage === 1}
          >
            Prev
          </button>
          <span>Page {messagePage}</span>
          <button
            onClick={() =>
              setMessagePage((prev) =>
                prev * itemsPerPage < filteredMessages.length
                  ? prev + 1
                  : prev,
              )
            }
            disabled={messagePage * itemsPerPage >= filteredMessages.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
