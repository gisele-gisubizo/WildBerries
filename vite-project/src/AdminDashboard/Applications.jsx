import React, { useState } from 'react';
import { useShops } from './ShopContext';
import './dashboard.css';

export default function ApplicationsPage() {
    const { addApprovedShop } = useShops();

    const [applications, setApplications] = useState([
        { id: 1, type: 'Seller', name: 'Alice Mutesi', email: 'alice@example.com', shop: '', phone: '+250788123456', appliedDate: '2025-08-25', status: 'Pending', category: 'Groceries', address: 'Kigali City', idDoc: 'ID001.pdf', registrationDoc: 'reg_kf.pdf' },
        { id: 2, type: 'Seller', name: '', email: 'brian@example.com', shop: 'Musanze Groceries', phone: '+250788987654', appliedDate: '2025-09-01', status: 'Pending', category: 'Electronics', address: 'Musanze Town', idDoc: 'ID002.pdf', registrationDoc: 'reg_mg.pdf' },
        { id: 3, type: 'Seller', name: 'Catherine Iradukunda', email: 'catherine@example.com', shop: '', phone: '+250785112233', appliedDate: '2025-08-28', status: 'Pending', category: 'Clothing', address: 'Ruhango', idDoc: 'ID003.pdf', registrationDoc: 'reg_rt.pdf' },
        { id: 4, type: 'Shop', name: 'Huye Market', email: 'huye@example.com', phone: '+250788556677', appliedDate: '2025-08-30', status: 'Pending', address: 'Huye District', idDoc: 'ID004.pdf', registrationDoc: 'registration_hm.pdf' },
        { id: 5, type: 'Shop', name: 'Nyagatare Shop', email: 'nyagatare@example.com', phone: '+250788667788', appliedDate: '2025-08-20', status: 'Pending', address: 'Nyagatare Town', idDoc: 'ID005.pdf', registrationDoc: 'registration_ns.pdf' },
        { id: 6, type: 'Seller', name: '', email: 'david@example.com', shop: 'Huye Market', phone: '+250788556678', appliedDate: '2025-08-31', status: 'Pending', category: 'Hardware', address: 'Huye', idDoc: 'ID006.pdf', registrationDoc: 'reg_hm.pdf' },
        { id: 7, type: 'Seller', name: 'Esther Mukamana', email: 'esther@example.com', shop: '', phone: '+250788667789', appliedDate: '2025-08-22', status: 'Pending', category: 'Stationery', address: 'Kigali', idDoc: 'ID007.pdf', registrationDoc: 'reg_ns.pdf' },
        { id: 8, type: 'Shop', name: 'Kigali Central', email: 'kigali@example.com', phone: '+250788334455', appliedDate: '2025-09-02', status: 'Pending', address: 'Kigali City', idDoc: 'ID008.pdf', registrationDoc: 'registration_kc.pdf' },
        { id: 9, type: 'Seller', name: '', email: 'fabrice@example.com', shop: 'Kibuye Essentials', phone: '+250788445566', appliedDate: '2025-09-03', status: 'Pending', category: 'Groceries', address: 'Kibuye', idDoc: 'ID009.pdf', registrationDoc: 'reg_ke.pdf' },
        { id: 10, type: 'Shop', name: 'Rubavu Traders', email: 'rubavu@example.com', phone: '+250788112244', appliedDate: '2025-09-04', status: 'Pending', address: 'Rubavu District', idDoc: 'ID010.pdf', registrationDoc: 'registration_rt.pdf' },
    ]);


    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalApp, setModalApp] = useState(null);
    const rowsPerPage = 5;

    const filteredApplications = applications
        .filter(a => a.status !== 'Approved') 
        .filter(a =>
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

    const changeStatus = (appId, newStatus) => {
        setApplications(prev => {
            return prev.map(a => {
                if (a.id === appId) {
                    const updatedApp = { ...a, status: newStatus };

                    // Only add to approvedShops if approving
                    if (newStatus === 'Approved') {
                        addApprovedShop({
                            id: a.id,
                            owner: a.type === 'Seller' ? a.name || 'N/A' : a.name,
                            name: a.type === 'Seller' ? a.shop || a.name : a.name,
                            address: a.address || 'N/A',
                            email: a.email || 'N/A',
                            appliedDate: a.appliedDate,
                            status: 'Approved',
                        });
                    }

                    return updatedApp;
                }
                return a;
            });
        });
        closeModal();
    };


    const statusColors = { active: '#1f7a5f', pending: '#b0881a', approved: '#217abf', declined: '#c62828' };
    const backgroundColor = { active: '#d9f0e8', pending: '#fff4d9', approved: '#d9edf7', declined: '#fbe2e2' };
    const borderColor = { active: '#b0d8c8', pending: '#ffe7a1', approved: '#a1d0f5', declined: '#f5c6c6' };

    return (
        <div className="dashboard-container">
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
                                        {app.type === 'Shop' && <p><b>Address:</b> {app.address}</p>}
                                        {app.email && <p><b>Email:</b> {app.email}</p>}
                                        <p><b>Phone:</b> {app.phone}</p>
                                        <p><b>Address:</b> {app.address}</p>
                                        {app.type === 'Seller' && <p><b>Category:</b> {app.category}</p>}
                                        <p><b>Applied Date:</b> {app.appliedDate}</p>
                                    </div>
                                    <div className="application-section lower">
                                        <strong>Documents</strong>
                                        <p><b>ID Doc:</b> <a href={`#`} target="_blank" rel="noopener noreferrer">{app.idDoc}</a></p>
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
                            {['Pending', 'Approved', 'Declined'].filter(s => s !== modalApp.status).map(statusOption => (
                                <button
                                    key={statusOption}
                                    onClick={() => changeStatus(modalApp.id, statusOption)}
                                    className={`status-option-btn ${statusOption.toLowerCase()}`}
                                >
                                    {statusOption}
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
