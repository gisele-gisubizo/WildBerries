import React, { useEffect, useState } from "react";
import { useShops } from "./ShopContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import {
  approveSeller,
  getPendingSellers,
  getRejectedSellers,
  rejectSeller,
} from "../services/AuthService";

export default function ApplicationsPage() {
  const { addApprovedShop, refreshApprovedShops } = useShops();

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalApp, setModalApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;

  const fetchSellers = async () => {
    try {
      const [pendingRes, rejectedRes] = await Promise.all([
        getPendingSellers(),
        getRejectedSellers(),
      ]);

      const mapSellers = (data, status) =>
        (data || []).map((s) => ({
          id: s.id,
          type: "Seller",
          name: s.name || "",
          shop: s.shop || "",
          email: s.email,
          phone: s.phone,
          appliedDate: s.createdAt
            ? new Date(s.createdAt).toLocaleDateString()
            : "N/A",
          status,
          address: s.address || "N/A",
          idCopy: s.idCopy || "N/A",
          registrationDoc: s.licenseDoc || "N/A",
        }));

      setApplications([
        ...mapSellers(pendingRes?.data, "Pending"),
        ...mapSellers(rejectedRes?.data, "Declined"),
      ]);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      const message = err.response?.data?.message || err.message;
      toast.error(`Error fetching sellers: ${message}`);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filteredApplications = applications.filter(
    (a) =>
      ((a.name && a.name.toLowerCase().includes(search.toLowerCase())) ||
        (a.shop && a.shop.toLowerCase().includes(search.toLowerCase())) ||
        (a.address && a.address.toLowerCase().includes(search.toLowerCase())) ||
        (a.phone && a.phone.includes(search)) ||
        (a.email && a.email.toLowerCase().includes(search.toLowerCase()))) &&
      (filterStatus === "" || a.status === filterStatus),
  );

  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);
  const paginate = (data, page) =>
    data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const openModal = (app) => setModalApp(app);
  const closeModal = () => setModalApp(null);

  const changeStatus = async (appId, newStatus) => {
    if (!["Approved", "Declined"].includes(newStatus)) return;

    setLoading(true);
    try {
      if (newStatus === "Approved") {
        await approveSeller(appId);
      } else {
        await rejectSeller(appId);
      }

      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
      );
      toast.success(`Application ${newStatus} successfully!`);

      if (newStatus === "Approved") {
        const approvedApp = applications.find((a) => a.id === appId);
        addApprovedShop({
          id: approvedApp.id,
          owner: approvedApp.name || "N/A",
          name: approvedApp.shop || approvedApp.name,
          address: approvedApp.address || "N/A",
          email: approvedApp.email || "N/A",
          appliedDate: approvedApp.appliedDate,
          status: "Approved",
        });
        await refreshApprovedShops();
      }

      closeModal();
    } catch (err) {
      console.error(`Error updating status: ${err}`);
      const message = err.response?.data?.message || err.message;
      toast.error(`Error updating status: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: "#b0881a",
    Approved: "#217abf",
    Declined: "#c62828",
  };
  const backgroundColor = {
    pending: "#fff4d9",
    Approved: "#d9edf7",
    Declined: "#fbe2e2",
  };
  const borderColor = {
    pending: "#ffe7a1",
    Approved: "#a1d0f5",
    Declined: "#f5c6c6",
  };

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="dashboard-header-row">
        <h2>Applications</h2>
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          <select
            className="select-filter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      <table className="table">
        <tbody>
          {paginate(filteredApplications, currentPage).map((app) => (
            <tr key={app.id} className="application-row">
              <td colSpan={8}>
                <div className="application-card">
                  <div className="application-section upper">
                    <strong>{app.type} Info</strong>
                    {(app.name || app.shop) && (
                      <p>
                        <b>Name:</b> {app.name || app.shop}
                      </p>
                    )}
                    <p>
                      <b>Email:</b> {app.email}
                    </p>
                    <p>
                      <b>Phone:</b> {app.phone}
                    </p>
                    <p>
                      <b>Address:</b> {app.address}
                    </p>
                    <p>
                      <b>Applied Date:</b> {app.appliedDate}
                    </p>
                  </div>
                  <div className="application-section lower">
                    <strong>Documents</strong>
                    <p>
                      <b>ID Doc:</b>{" "}
                      {app.idCopy !== "N/A" ? (
                        <a
                          href={app.idCopy}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View ID
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p>
                      <b>Registration Doc:</b>{" "}
                      {app.registrationDoc !== "N/A" ? (
                        <a
                          href={app.registrationDoc}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View License
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div className="application-actions">
                    <span
                      className="status-badge"
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
                      {app.status}
                    </span>
                    <button
                      className="change-status-btn"
                      onClick={() => openModal(app)}
                    >
                      Change Status
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < totalPages ? prev + 1 : prev,
            )
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {modalApp && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change Status for {modalApp.name || modalApp.shop}</h3>
            <div className="modal-buttons">
              {["Approved", "Declined"]
                .filter((s) => s !== modalApp.status)
                .map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => changeStatus(modalApp.id, statusOption)}
                    className={`status-option-btn ${statusOption.toLowerCase()}`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : statusOption}
                  </button>
                ))}
            </div>
            <button className="modal-close-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
