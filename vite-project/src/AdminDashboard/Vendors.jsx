import React, { useState } from 'react';
import './dashboard.css';

export default function VendorsPage() {
    const [vendors, setVendors] = useState([
        { id: 1, name: 'Alice Mutesi', shop: 'Kigali Fresh', phone: '+250788123456', appliedDate: '2025-08-25', status: 'Active' },
        { id: 2, name: 'Brian Uwimana', shop: 'Musanze Groceries', phone: '+250788987654', appliedDate: '2025-09-01', status: 'Pending' },
        { id: 3, name: 'Catherine Iradukunda', shop: 'Rubavu Traders', phone: '+250785112233', appliedDate: '2025-08-28', status: 'Approved' },
        { id: 4, name: 'David Nshimiyimana', shop: 'Huye Market', phone: '+250788556677', appliedDate: '2025-08-30', status: 'Declined' },
        { id: 5, name: 'Esther Mukamana', shop: 'Nyagatare Shop', phone: '+250788667788', appliedDate: '2025-08-20', status: 'Active' },
        { id: 6, name: 'Fabrice Habimana', shop: 'Kibuye Essentials', phone: '+250788445566', appliedDate: '2025-09-03', status: 'Pending' },
        { id: 7, name: 'Grace Uwase', shop: 'Kigali Fresh', phone: '+250788998877', appliedDate: '2025-09-05', status: 'Active' },
        { id: 8, name: 'Hassan Kabera', shop: 'Rubavu Traders', phone: '+250788112244', appliedDate: '2025-09-02', status: 'Pending' },
        { id: 9, name: 'Irene Uwimana', shop: 'Musanze Groceries', phone: '+250788223344', appliedDate: '2025-09-06', status: 'Declined' },
        { id: 10, name: 'Jean Bosco', shop: 'Huye Market', phone: '+250788334455', appliedDate: '2025-09-07', status: 'Approved' },
        { id: 11, name: 'Khadija Uwera', shop: 'Nyagatare Shop', phone: '+250788445577', appliedDate: '2025-09-08', status: 'Active' },
    ]);

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVendor, setModalVendor] = useState(null);
    const rowsPerPage = 10;

    const filteredVendors = vendors.filter(
        v =>
            (v.name.toLowerCase().includes(search.toLowerCase()) ||
             v.shop.toLowerCase().includes(search.toLowerCase()) ||
             v.phone.includes(search)) &&
            (filterStatus === '' || v.status === filterStatus)
    );

    const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);
    const paginate = (data, page) => data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const openModal = (vendor) => setModalVendor(vendor);
    const closeModal = () => setModalVendor(null);

    const changeStatus = (vendorId, newStatus) => {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: newStatus } : v));
        closeModal();
    };

    const statusColors = {
        active: '#1f7a5f',
        pending: '#b0881a',
        approved: '#217abf',
        declined: '#c62828',
    };
    const backgroundColor = {
               active: '#d9f0e8',
        pending: '#fff4d9',
        approved: '#d9edf7',
        declined: '#fbe2e2',
    }
    const borderColor={
       active: '#b0d8c8',
        pending: '#ffe7a1',
        approved: '#a1d0f5',
        declined: '#f5c6c6',
    }
    return (
        <div className="dashboard-container">
            <div className="dashboard-header-row">
                <h2>Vendors</h2>
                <div className="dashboard-controls">
                    <input
                        type="text"
                        placeholder="Search vendors..."
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
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                    </select>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Vendor Name</th>
                        <th>Shop Name</th>
                        <th>Phone</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginate(filteredVendors, currentPage).map((vendor) => (
                        <tr key={vendor.id}>
                            <td>{vendor.name}</td>
                            <td>{vendor.shop}</td>
                            <td>{vendor.phone}</td>
                            <td>{vendor.appliedDate}</td>
                            <td>
                                <span
                                    className="status-badge"
                                    style={{ backgroundColor:backgroundColor[vendor.status.toLowerCase()], color:  statusColors[vendor.status.toLowerCase()], padding: '5px 10px', borderRadius: '20px', borderColor: borderColor[vendor.status.toLowerCase()], borderStyle: 'solid', borderWidth: '1px' }}
                                >
                                    {vendor.status}
                                </span>
                            </td>
                            <td>
                                {vendor.status !== 'Active' && (
                                    <button className="change-status-btn" onClick={() => openModal(vendor)}>
                                        Change Status
                                    </button>
                                )}
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

            {modalVendor && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Change Status for {modalVendor.name}</h3>
                        <div className="modal-buttons">
                            {['Pending', 'Approved', 'Declined'].filter(s => s !== modalVendor.status).map(statusOption => (
                                <button
                                    key={statusOption}
                                    onClick={() => changeStatus(modalVendor.id, statusOption)}
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
