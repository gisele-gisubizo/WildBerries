import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShops } from './ShopContext';
import './dashboard.css';

export default function ShopsPage() {
    const { approvedShops } = useShops();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const filteredShops = approvedShops.filter(
        shop =>
            (shop.owner && shop.owner.toLowerCase().includes(search.toLowerCase())) ||
            (shop.name && shop.name.toLowerCase().includes(search.toLowerCase())) ||
            (shop.address && shop.address.toLowerCase().includes(search.toLowerCase())) ||
            (shop.email && shop.email.toLowerCase().includes(search.toLowerCase()))
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
                        <th>Email</th>
                        <th>Applied Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginate(filteredShops, currentPage).map(shop => (
                        <tr key={shop.id}>
                            <td>{shop.owner || 'N/A'}</td>
                            <td>{shop.name || 'N/A'}</td>
                            <td>{shop.address || 'N/A'}</td>
                            <td>{shop.email || 'N/A'}</td>
                            <td>{shop.appliedDate || 'N/A'}</td>
                            <td>
                                <button
                                    className="view-shop-btn"
                                    onClick={() => navigate(`/shops/${shop.id}`)}
                                >
                                    View Shop
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span>Page {currentPage} / {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
