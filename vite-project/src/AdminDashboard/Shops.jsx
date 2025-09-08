import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

export default function ShopsPage() {
    const navigate = useNavigate();

    const [shops] = useState([
        { id: 1, owner: 'Alice Mutesi', name: 'Kigali Fresh', address: 'Kigali, KG 123 St', appliedDate: '2025-08-25', status: 'Approved' },
        { id: 2, owner: 'Brian Uwimana', name: 'Musanze Groceries', address: 'Musanze, MS 45 Ave', appliedDate: '2025-09-01', status: 'Approved' },
        { id: 3, owner: 'David Nshimiyimana', name: 'Huye Market', address: 'Huye, HY 56 Blvd', appliedDate: '2025-08-30', status: 'Approved' },
    ]);

    const [search, setSearch] = useState('');
    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Only approved shops
    const approvedShops = shops.filter(shop => shop.status === 'Approved');

    const filteredShops = approvedShops.filter(
        shop =>
            shop.owner.toLowerCase().includes(search.toLowerCase()) ||
            shop.name.toLowerCase().includes(search.toLowerCase()) ||
            shop.address.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredShops.length / rowsPerPage);
    const paginate = (data, page) => data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-row">
                <h2>Approved Shops</h2>
                <div className="dashboard-controls">
                    <input
                        type="text"
                        placeholder="Search shops..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="search-input"
                    />
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Owner Name</th>
                        <th>Shop Name</th>
                        <th>Address</th>
                        <th>Applied Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginate(filteredShops, currentPage).map(shop => (
                        <tr key={shop.id}>
                            <td>{shop.owner}</td>
                            <td>{shop.name}</td>
                            <td>{shop.address}</td>
                            <td>{shop.appliedDate}</td>
                            <td>
                                <button
                                    className="view-shop-btn"
                                    onClick={() => navigate(`/Dashboard/shops/${shop.id}`)}                                >
                                    View Shop
                                </button>
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
        </div>
    );
}
