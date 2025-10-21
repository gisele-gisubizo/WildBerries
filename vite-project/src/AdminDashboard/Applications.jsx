import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useShops } from './ShopContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css';

const API_BASE_URL = "http://localhost:4000"; // your backend URL

export default function ApplicationsPage() {
    const { addApprovedShop } = useShops();

    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalApp, setModalApp] = useState(null);
    const [loading, setLoading] = useState(false);
    const rowsPerPage = 5;

    // -----------------------
    // Fetch pending and rejected sellers from backend
    // -----------------------
    const fetchSellers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found. Please login.");

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const [pendingRes, rejectedRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/users/sellers/pending`, config),
                axios.get(`${API_BASE_URL}/users/sellers/rejected`, config)
            ]);

            const mapSellers = (data, status) =>
                data.map(s => ({
                    id: s.id,
                    type: 'Seller',
                    name: s.name || '',
                    shop: s.shop || '',
                    email: s.email,
                    phone: s.phone,
                    appliedDate: s.createdAt.split('T')[0],
                    status: status,
                    address: s.address || 'N/A',
                    idCopy: s.idCopy || 'N/A',
                    registrationDoc: s.licenseDoc || 'N/A',
                }));

            setApplications([
                ...mapSellers(pendingRes.data.data, 'Pending'),
                ...mapSellers(rejectedRes.data.data, 'Declined'),
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

    // -----------------------
    // Pagination & Filtering
    // -----------------------
    const filteredApplications = applications.filter(a =>
        ((a.name && a.name.toLowerCase().includes(search.toLowerCase())) ||
         (a.shop && a.shop.toLowerCase().includes(search.toLowerCase())) ||
         (a.address && a.address.toLowerCase().includes(search.toLowerCase())) ||
         a.phone.includes(search) ||
         (a.email && a.email.toLowerCase().includes(search.toLowerCase()))) &&
        (filterStatus === '' || a.status === filterStatus)
    );

    const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);
    const paginate = (data, page) => data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const openModal = (app) => setModalApp(app);
    const closeModal = () => setModalApp(null);

// -----------------------
// Approve / Reject API calls
// -----------------------
const changeStatus = async (appId, newStatus) => {
    if (!['Approved', 'Declined'].includes(newStatus)) return;

    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Choose endpoint based on status
        let endpoint = '';
        if (newStatus === 'Approved') {
            endpoint = `${API_BASE_URL}/users/sellers/${appId}/approve`;
        } else if (newStatus === 'Declined') {
            endpoint = `${API_BASE_URL}/users/sellers/${appId}/reject`;
        }

        await axios.put(endpoint, {}, config);

        setApplications(prev =>
            prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
        );

        toast.success(`Application ${newStatus} successfully!`);

        if (newStatus === 'Approved') {
            const approvedApp = applications.find(a => a.id === appId);
            addApprovedShop({
                id: approvedApp.id,
                owner: approvedApp.name || 'N/A',
                name: approvedApp.shop || approvedApp.name,
                address: approvedApp.address || 'N/A',
                email: approvedApp.email || 'N/A',
                appliedDate: approvedApp.appliedDate,
                status: 'Approved',
            });
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


    const statusColors = { active: '#1f7a5f', pending: '#b0881a', approved: '#217abf', declined: '#c62828' };
    const backgroundColor = { active: '#d9f0e8', pending: '#fff4d9', approved: '#d9edf7', declined: '#fbe2e2' };
    const borderColor = { active: '#b0d8c8', pending: '#ffe7a1', approved: '#a1d0f5', declined: '#f5c6c6' };

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
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="search-input"
                    />
                    <select
                        className="select-filter"
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
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
                                        {(app.name || app.shop) && <p><b>Name:</b> {app.name || app.shop}</p>}
                                        <p><b>Email:</b> {app.email}</p>
                                        <p><b>Phone:</b> {app.phone}</p>
                                        <p><b>Address:</b> {app.address}</p>
                                        <p><b>Applied Date:</b> {app.appliedDate}</p>
                                    </div>
                                    <div className="application-section lower">
                                        <strong>Documents</strong>
                                        <p><b>ID Doc:</b> <a href={`#`} target="_blank" rel="noopener noreferrer">{app.idCopy}</a></p>
                                        <p><b>Registration Doc:</b> <a href={`#`} target="_blank" rel="noopener noreferrer">{app.registrationDoc}</a></p>
                                    </div>
                                    <div className="application-actions">
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: backgroundColor[app.status.toLowerCase()],
                                                color: statusColors[app.status.toLowerCase()],
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                borderColor: borderColor[app.status.toLowerCase()],
                                                borderStyle: 'solid',
                                                borderWidth: '1px'
                                            }}
                                        >
                                            {app.status}
                                        </span>
                                        <button className="change-status-btn" onClick={() => openModal(app)}>Change Status</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Prev</button>
                <span>Page {currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))} disabled={currentPage === totalPages}>Next</button>
            </div>

            {modalApp && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Change Status for {modalApp.name || modalApp.shop}</h3>
                        <div className="modal-buttons">
                            {['Approved', 'Declined'].filter(s => s !== modalApp.status).map(statusOption => (
                                <button
                                    key={statusOption}
                                    onClick={() => changeStatus(modalApp.id, statusOption)}
                                    className={`status-option-btn ${statusOption.toLowerCase()}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : statusOption}
                                </button>
                            ))}
                        </div>
                        <button className="modal-close-btn" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
