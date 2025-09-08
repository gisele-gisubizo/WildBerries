import React, { useState, useMemo } from 'react';
import { FiUsers, FiPackage, FiFileText } from 'react-icons/fi';
import { FaStore, FaUserTie } from 'react-icons/fa';
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
} from 'recharts';
import toast from 'react-hot-toast';
import './dashboard.css';

export default function DashboardHome() {
    const [isExporting, setIsExporting] = useState(false);
    const [shopFilter, setShopFilter] = useState('');
    const [sellerFilter, setSellerFilter] = useState('');

    const [kpis] = useState({
        totalVendors: '20',
        activeSellers: '45',
        totalsellers: '50',
        totalShopsApplications: '15',
    });

    const [sellers] = useState([
        { id: 1, name: 'Alice Mutesi', status: 'Active', appliedDate: '2025-08-25' },
        { id: 2, name: 'Brian Uwimana', status: 'Pending', appliedDate: '2025-09-01' },
        { id: 3, name: 'Catherine Iradukunda', status: 'Approved', appliedDate: '2025-08-28' },
        { id: 4, name: 'David Nshimiyimana', status: 'Declined', appliedDate: '2025-08-30' },
        { id: 5, name: 'Esther Mukamana', status: 'Active', appliedDate: '2025-08-20' },
        { id: 6, name: 'Fabrice Habimana', status: 'Pending', appliedDate: '2025-09-03' },
    ]);

    const [shopApplications] = useState([
        { id: 1, name: 'Kigali Fresh', phone: '+250788123456', address: 'Kigali, Nyarutarama', idNo: 'ID001', doc: 'registration_kf.pdf' },
        { id: 2, name: 'Musanze Groceries', phone: '+250788987654', address: 'Musanze Town', idNo: 'ID002', doc: 'registration_mg.pdf' },
        { id: 3, name: 'Rubavu Traders', phone: '+250785112233', address: 'Rubavu City', idNo: 'ID003', doc: 'registration_rt.pdf' },
        { id: 4, name: 'Huye Market', phone: '+250788556677', address: 'Huye District', idNo: 'ID004', doc: 'registration_hm.pdf' },
        { id: 5, name: 'Nyagatare Shop', phone: '+250788667788', address: 'Nyagatare Town', idNo: 'ID005', doc: 'registration_ns.pdf' },
        { id: 6, name: 'Kibuye Essentials', phone: '+250788445566', address: 'Kibuye City', idNo: 'ID006', doc: 'registration_ke.pdf' },
    ]);

    const [messages] = useState([
        { id: 1, sender: 'Afua Hamissi', email: 'afua.hamissi@mail.com', message: 'Hello, I need help with my order.' },
        { id: 2, sender: 'Brian Uwimana', email: 'brian.uwimana@mail.com', message: 'I want to apply as a seller.' },
        { id: 3, sender: 'Catherine Iradukunda', email: 'catherine.iradukunda@mail.com', message: 'Payment not received yet.' },
        { id: 4, sender: 'David Nshimiyimana', email: 'david.nshimiyimana@mail.com', message: 'How do I update my profile?' },
        { id: 5, sender: 'Esther Mukamana', email: 'esther.mukamana@mail.com', message: 'Inquiry about product availability.' },
        { id: 6, sender: 'Fabrice Habimana', email: 'fabrice.habimana@mail.com', message: 'Requesting a refund for my last order.' },
    ]);

    const itemsPerPage = 5;
    const [sellerPage, setSellerPage] = useState(1);
    const [shopPage, setShopPage] = useState(1);
    const [messagePage, setMessagePage] = useState(1);

    const [sellerSearch, setSellerSearch] = useState('');
    const [shopSearch, setShopSearch] = useState('');
    const [messageSearch, setMessageSearch] = useState('');

    const filteredSellers = sellers.filter(
        s =>
            (s.name.toLowerCase().includes(sellerSearch.toLowerCase()) ||
            s.status.toLowerCase().includes(sellerSearch.toLowerCase())) &&
            (sellerFilter === '' || s.status === sellerFilter)
    );

    const filteredShops = shopApplications.filter(
        s =>
            (s.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
            s.phone.includes(shopSearch) ||
            s.address.toLowerCase().includes(shopSearch)) &&
            (shopFilter === '' || s.address.toLowerCase().includes(shopFilter.toLowerCase()))
    );

    const filteredMessages = messages.filter(
        m =>
            m.sender.toLowerCase().includes(messageSearch.toLowerCase()) ||
            m.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
            m.message.toLowerCase().includes(messageSearch.toLowerCase())
    );

    const paginate = (data, page) =>
        data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleExportPDF = () => {
        setIsExporting(true);
        toast.success('This is a demo. PDF export not implemented.');
        setTimeout(() => setIsExporting(false), 1000);
    };

    const [products] = useState([
        { id: 1, title: 'Product A', stockStatus: 'in-stock' },
        { id: 2, title: 'Product B', stockStatus: 'low-stock' },
        { id: 3, title: 'Product C', stockStatus: 'out-of-stock' },
        { id: 4, title: 'Product D', stockStatus: 'in-stock' },
        { id: 5, title: 'Product E', stockStatus: 'low-stock' },
    ]);

    const stockStatusData = useMemo(
        () => [
            { name: 'In Stock', value: products.filter((p) => p.stockStatus === 'in-stock').length, color: '#28a745' },
            { name: 'Low Stock', value: products.filter((p) => p.stockStatus === 'low-stock').length, color: '#ffc107' },
            { name: 'Out of Stock', value: products.filter((p) => p.stockStatus === 'out-of-stock').length, color: '#dc3545' },
        ],
        [products]
    );

    const sellerStatusData = useMemo(
        () => [
            { name: 'Active', value: sellers.filter((s) => s.status === 'Active').length, color: '#007bff' },
            { name: 'Inactive', value: sellers.filter((s) => s.status === 'Inactive').length, color: '#6c757d' },
            { name: 'Pending', value: sellers.filter((s) => s.status === 'Pending').length, color: '#ffc107' },
            { name: 'Declined', value: sellers.filter((s) => s.status === 'Declined').length, color: '#dc3545' },
        ],
        [sellers]
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-header-top">
                    <h1>Welcome to your e-commerce dashboard!</h1>
                    <button onClick={handleExportPDF} disabled={isExporting} className="export-btn">
                        <FiFileText />
                        {isExporting ? 'Generating...' : 'Export PDF Report'}
                    </button>
                </div>
            </div>

            <div className="dashboard-kpi-wrapper">
                <div className="kpi-card">
                    <FaUserTie className="kpi-icon" />
                    <div>Total Sellers</div>
                    <div>{kpis.totalVendors}</div>
                </div>
                <div className="kpi-card">
                    <FiUsers className="kpi-icon" />
                    <div>Active Vendors</div>
                    <div>{kpis.activeSellers}</div>
                </div>
                <div className="kpi-card">
                    <FiUsers className="kpi-icon" />
                    <div>Total Active Shops</div>
                    <div>{kpis.totalsellers}</div>
                </div>
                <div className="kpi-card">
                    <FaStore className="kpi-icon" />
                    <div>Total Shops Applied</div>
                    <div>{kpis.totalShopsApplications}</div>
                </div>
            </div>

            <div className="dashboard-analytics-row">
                <div className="dashboard-chart-box">
                    <h3>Product Stock Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={stockStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {stockStatusData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="dashboard-chart-box">
                    <h3>Seller Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sellerStatusData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" style={{ fontSize: '0.75rem' }} />
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
                    <h2>Sellers List</h2>
                    <div className="dashboard-controls">
                        <input
                            type="text"
                            placeholder="Search sellers..."
                            value={sellerSearch}
                            onChange={(e) => setSellerSearch(e.target.value)}
                            className="search-input"
                        />
                        <select
                            className="select-filter"
                            value={sellerFilter}
                            onChange={(e) => setSellerFilter(e.target.value)}
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
                            <th>Name</th>
                            <th>Status</th>
                            <th>Applied Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginate(filteredSellers, sellerPage).map((seller) => (
                            <tr key={seller.id}>
                                <td>{seller.name}</td>
                                <td><span className={`status-badge ${seller.status}`}>{seller.status}</span></td>
                                <td>{seller.appliedDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => setSellerPage((prev) => Math.max(prev - 1, 1))} disabled={sellerPage === 1}>Prev</button>
                    <span>Page {sellerPage}</span>
                    <button onClick={() => setSellerPage((prev) => (prev * itemsPerPage < filteredSellers.length ? prev + 1 : prev))} disabled={sellerPage * itemsPerPage >= filteredSellers.length}>Next</button>
                </div>

                <div className="dashboard-header-row">
                    <h2>Shop Applications</h2>
                    <div className="dashboard-controls">
                        <input
                            type="text"
                            placeholder="Search shops..."
                            value={shopSearch}
                            onChange={(e) => setShopSearch(e.target.value)}
                            className="search-input"
                        />
                        <select
                            className="select-filter"
                            value={shopFilter}
                            onChange={(e) => setShopFilter(e.target.value)}
                        >
                            <option value="">All Places</option>
                            <option value="Kigali">Kigali</option>
                            <option value="Musanze">Musanze</option>
                            <option value="Rubavu">Rubavu</option>
                            <option value="Huye">Huye</option>
                            <option value="Nyagatare">Nyagatare</option>
                            <option value="Kibuye">Kibuye</option>
                        </select>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>ID No</th>
                            <th>Document</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginate(filteredShops, shopPage).map((shop) => (
                            <tr key={shop.id}>
                                <td>{shop.name}</td>
                                <td>{shop.phone}</td>
                                <td>{shop.address}</td>
                                <td>{shop.idNo}</td>
                                <td>{shop.doc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => setShopPage((prev) => Math.max(prev - 1, 1))} disabled={shopPage === 1}>Prev</button>
                    <span>Page {shopPage}</span>
                    <button onClick={() => setShopPage((prev) => (prev * itemsPerPage < filteredShops.length ? prev + 1 : prev))} disabled={shopPage * itemsPerPage >= filteredShops.length}>Next</button>
                </div>

                <div className="dashboard-header-row">
                    <h2>Messages</h2>
                    <div className="dashboard-controls">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={messageSearch}
                            onChange={(e) => setMessageSearch(e.target.value)}
                            className="search-input"
                        />
                        <select className="select-filter">
                            <option value="">All Messages</option>
                        </select>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sender</th>
                            <th>Email</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginate(filteredMessages, messagePage).map((msg) => (
                            <tr key={msg.id}>
                                <td>{msg.sender}</td>
                                <td>{msg.email}</td>
                                <td>{msg.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => setMessagePage((prev) => Math.max(prev - 1, 1))} disabled={messagePage === 1}>Prev</button>
                    <span>Page {messagePage}</span>
                    <button onClick={() => setMessagePage((prev) => (prev * itemsPerPage < filteredMessages.length ? prev + 1 : prev))} disabled={messagePage * itemsPerPage >= filteredMessages.length}>Next</button>
                </div>
            </div>
        </div>
    );
}
