import React, { useState, useMemo } from 'react';
import { FiUsers, FiFileText } from 'react-icons/fi';
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
    const [applicationFilter, setApplicationFilter] = useState('');
    const [applicationSearch, setApplicationSearch] = useState('');

    const [kpis] = useState({
        totalVendors: '20',
        activeSellers: '45',
        totalsellers: '50',
        totalApplications: '15',
    });

    // 🔹 Combined seller + shop applications
    const [applications] = useState([
        {
            id: 1,
            sellerName: 'Alice Mutesi',
            phone: '+250788123456',
            shopName: 'Kigali Fresh',
            category: 'Groceries',
            address: 'Kigali, Nyarutarama',
            status: 'Active',
            appliedDate: '2025-08-25',
            idDoc: 'ID001.pdf',
            businessDoc: 'registration_kf.pdf',
        },
        {
            id: 2,
            sellerName: 'Brian Uwimana',
            phone: '+250788987654',
            shopName: 'Musanze Groceries',
            category: 'Electronics',
            address: 'Musanze Town',
            status: 'Pending',
            appliedDate: '2025-09-01',
            idDoc: 'ID002.pdf',
            businessDoc: 'registration_mg.pdf',
        },
        {
            id: 3,
            sellerName: 'Catherine Iradukunda',
            phone: '+250785112233',
            shopName: 'Rubavu Traders',
            category: 'Clothing',
            address: 'Rubavu City',
            status: 'Approved',
            appliedDate: '2025-08-28',
            idDoc: 'ID003.pdf',
            businessDoc: 'registration_rt.pdf',
        },
        {
            id: 4,
            sellerName: 'David Nshimiyimana',
            phone: '+250788556677',
            shopName: 'Huye Market',
            category: 'Furniture',
            address: 'Huye District',
            status: 'Declined',
            appliedDate: '2025-08-30',
            idDoc: 'ID004.pdf',
            businessDoc: 'registration_hm.pdf',
        },
        {
            id: 5,
            sellerName: 'Esther Mukamana',
            phone: '+250788667788',
            shopName: 'Nyagatare Shop',
            category: 'Pharmacy',
            address: 'Nyagatare Town',
            status: 'Active',
            appliedDate: '2025-08-20',
            idDoc: 'ID005.pdf',
            businessDoc: 'registration_ns.pdf',
        },
        {
            id: 6,
            sellerName: 'Fabrice Habimana',
            phone: '+250788445566',
            shopName: 'Kibuye Essentials',
            category: 'Cosmetics',
            address: 'Kibuye City',
            status: 'Pending',
            appliedDate: '2025-09-03',
            idDoc: 'ID006.pdf',
            businessDoc: 'registration_ke.pdf',
        },
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
    const [applicationPage, setApplicationPage] = useState(1);
    const [messagePage, setMessagePage] = useState(1);

    const filteredApplications = applications.filter(
        (a) =>
            a.sellerName.toLowerCase().includes(applicationSearch.toLowerCase()) ||
            a.shopName.toLowerCase().includes(applicationSearch.toLowerCase()) ||
            a.phone.includes(applicationSearch) ||
            a.address.toLowerCase().includes(applicationSearch.toLowerCase()) ||
            a.status.toLowerCase().includes(applicationSearch.toLowerCase())
    );

    const filteredMessages = messages.filter(
        (m) =>
            m.sender.toLowerCase().includes(applicationSearch.toLowerCase()) ||
            m.email.toLowerCase().includes(applicationSearch.toLowerCase()) ||
            m.message.toLowerCase().includes(applicationSearch.toLowerCase())
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
            { name: 'Active', value: applications.filter((a) => a.status === 'Active').length, color: '#007bff' },
            { name: 'Approved', value: applications.filter((a) => a.status === 'Approved').length, color: '#6c757d' },
            { name: 'Pending', value: applications.filter((a) => a.status === 'Pending').length, color: '#ffc107' },
            { name: 'Declined', value: applications.filter((a) => a.status === 'Declined').length, color: '#dc3545' },
        ],
        [applications]
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
                    <div>Total Applications</div>
                    <div>{kpis.totalApplications}</div>
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
                    <h3>Application Status Distribution</h3>
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
                            <th>Seller</th>
                            <th>Phone</th>
                            <th>Shop</th>
                            <th>Category</th>
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
                                <td>{app.sellerName}</td>
                                <td>{app.phone}</td>
                                <td>{app.shopName}</td>
                                <td>{app.category}</td>
                                <td>{app.address}</td>
                                <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                                <td>{app.appliedDate}</td>
                                <td><a href={`/docs/${app.idDoc}`} target="_blank" rel="noopener noreferrer">{app.idDoc}</a></td>
                                <td><a href={`/docs/${app.businessDoc}`} target="_blank" rel="noopener noreferrer">{app.businessDoc}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => setApplicationPage((prev) => Math.max(prev - 1, 1))} disabled={applicationPage === 1}>Prev</button>
                    <span>Page {applicationPage}</span>
                    <button onClick={() => setApplicationPage((prev) => (prev * itemsPerPage < filteredApplications.length ? prev + 1 : prev))} disabled={applicationPage * itemsPerPage >= filteredApplications.length}>Next</button>
                </div>

                <div className="dashboard-header-row">
                    <h2>Messages</h2>
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
