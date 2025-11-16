import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
import "../AdminDashboard/dashboard.css";
import { FaBoxOpen, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { fetchProducts } from "../services/ProductService";
import { useAuth } from "../contexts/AuthContext";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [kpis, setKpis] = useState({
    totalProducts: "0",
    totalOrders: "0",
    totalPayments: "0",
  });
const [isExporting, setIsExporting] = useState(false);

const handleExportPDF = () => {
  setIsExporting(true);
  // TODO: implement export logic
  setTimeout(() => {
    setIsExporting(false);
    alert("PDF Export not implemented yet.");
  }, 1000);
};

  useEffect(() => {
    const loadProducts = async () => {
      if (!user?.id) return;
      setLoadingProducts(true);
      try {
        const response = await fetchProducts({ limit: 200 });
        const sellerProducts = (response.products || []).filter(
          (product) => product.seller?.id === user.id,
        );
        setProducts(sellerProducts);
        setKpis((prev) => ({
          ...prev,
          totalProducts: String(sellerProducts.length),
        }));
      } catch (err) {
        console.error("Failed to load seller products", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [user?.id]);

  const productsData = useMemo(() => {
    return products.map((product) => {
      const stock = Number(product.stock) || 0;
      const status = stock > 0 ? "Active" : "Out of Stock";
      return {
        id: product.id,
        name: product.name,
        category: product.category?.name || "N/A",
        subcategory: Object.keys(product.attributes || {})
          .slice(0, 1)
          .join(", "),
        price: Number(product.price) || 0,
        status,
        stock,
        brand: product.attributes?.Brand || product.attributes?.brand || "",
      };
    });
  }, [products]);


  const ordersData = [
    { id: 1, product: "Product A", quantity: 2, total: 100, status: "Delivered" },
    { id: 2, product: "Product B", quantity: 1, total: 100, status: "Pending" },
    { id: 3, product: "Product C", quantity: 3, total: 225, status: "Shipped" },
  ];

  const paymentsData = [
    { id: 1, orderId: "#001", amount: 100, method: "MTN MoMo", status: "Paid" },
    { id: 2, orderId: "#002", amount: 200, method: "Airtel Money", status: "Pending" },
  ];

  const messagesData = [
    { id: 1, sender: "Admin", subject: "Approval Status", content: "Your account is under review", status: "Unread" },
    { id: 2, sender: "Customer", subject: "Order issue", content: "Order #001 arrived late", status: "Read" },
  ];

  // States for Products
  const [productSearch, setProductSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [productPage, setProductPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = productsData
    .filter((p) => {
      const query = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query))
      );
    })
    .filter(p => (productFilter ? p.status === productFilter : true));

  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * itemsPerPage,
    productPage * itemsPerPage
  );

  // States for Orders
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 5;

  const filteredOrders = ordersData
    .filter(o => o.product.toLowerCase().includes(orderSearch.toLowerCase()))
    .filter(o => (orderFilter ? o.status === orderFilter : true));

  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ordersPerPage,
    orderPage * ordersPerPage
  );

  // States for Payments
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [paymentPage, setPaymentPage] = useState(1);
  const paymentsPerPage = 5;

  const filteredPayments = paymentsData
    .filter(p => p.orderId.toLowerCase().includes(paymentSearch.toLowerCase()))
    .filter(p => (paymentFilter ? p.status === paymentFilter : true));

  const totalPaymentPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (paymentPage - 1) * paymentsPerPage,
    paymentPage * paymentsPerPage
  );

  // States for Messages
  const [messageSearch, setMessageSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState("");
  const [messagePage, setMessagePage] = useState(1);
  const messagesPerPage = 5;

  const filteredMessages = messagesData
    .filter(
      m =>
        m.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
        m.sender.toLowerCase().includes(messageSearch.toLowerCase())
    )
    .filter(m => (messageFilter ? m.status === messageFilter : true));

  const totalMessagePages = Math.ceil(filteredMessages.length / messagesPerPage);
  const paginatedMessages = filteredMessages.slice(
    (messagePage - 1) * messagesPerPage,
    messagePage * messagesPerPage
  );

  // Chart Data
  const salesChart = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 300 },
    { month: "Mar", sales: 500 },
    { month: "Apr", sales: 700 },
    { month: "May", sales: 600 },
  ];

  const ordersChart = [
    { name: "Delivered", value: 10 },
    { name: "Pending", value: 5 },
    { name: "Shipped", value: 3 },
  ];

  const paymentsChart = [
    { name: "MTN MoMo", amount: 400 },
    { name: "Airtel Money", amount: 300 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const isApproved = user?.status === "approved";

  if (!isApproved) {
    return (
      <div className="approval-message">
        <h2>⏳ Waiting for Admin Approval</h2>
        <p>Your account is under review. Once approved, you will access your dashboard features.</p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
                <div className="dashboard-header-top">
                    <h1>Welcome to your e-commerce dashboard!</h1>
                    <button onClick={handleExportPDF} disabled={isExporting} className="export-btn">
                        <FiFileText />
                        {isExporting ? 'Generating...' : 'Export PDF Report'}
                    </button>
                </div>
            </div>
      {/* KPI Cards */}
      <div className="dashboard-kpi-wrapper">
        <div className="kpi-card">
          <FaBoxOpen className="kpi-icon" />
          <div>Total Products</div>
          <div>{kpis.totalProducts}</div>
        </div>
        <div className="kpi-card">
          <FaShoppingCart className="kpi-icon" />
          <div>Total Orders</div>
          <div>{kpis.totalOrders}</div>
        </div>
        <div className="kpi-card">
          <FaMoneyBillWave className="kpi-icon" />
          <div>Total Sales</div>
          <div>{kpis.totalPayments}</div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="dashboard-analytics-row">
        <div className="dashboard-chart-box">
          <h2>Sales Trend</h2>
          <ResponsiveContainer width="95%" height={230}>
            <LineChart data={salesChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#007BFF" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-chart-box">
          <h2>Orders Distribution</h2>
          <ResponsiveContainer width="90%" height={300}>
            <PieChart>
              <Pie data={ordersChart} dataKey="value" nameKey="name" outerRadius={100} label>
                {ordersChart.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-chart-box">
          <h2>Payments Summary</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentsChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#28A745" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Table */}
      <div className="dashboard-section">
        <div className="dashboard-header-row">
          <h2>Products</h2>
          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setProductPage(1);
              }}
              className="search-input"
            />
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setProductPage(1);
              }}
              className="select-filter"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price (RWF)</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.price.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span
                        className={`status-badge ${p.status
                          .replace(" ", "-")
                          .toLowerCase()}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() =>
                  setProductPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={productPage === 1}
              >
                Prev
              </button>
              <span>
                Page {productPage} of {totalProductPages}
              </span>
              <button
                onClick={() =>
                  setProductPage((prev) =>
                    prev < totalProductPages ? prev + 1 : prev,
                  )
                }
                disabled={productPage === totalProductPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Orders Table */}
      <div className="dashboard-section">
        <div className="dashboard-header-row">
          <h2>Orders</h2>
          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Search orders..."
              value={orderSearch}
              onChange={(e) => {
                setOrderSearch(e.target.value);
                setOrderPage(1);
              }}
              className="search-input"
            />
            <select
              value={orderFilter}
              onChange={(e) => {
                setOrderFilter(e.target.value);
                setOrderPage(1);
              }}
              className="select-filter"
            >
              <option value="">All</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total ($)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((o) => (
              <tr key={o.id}>
                <td>{o.product}</td>
                <td>{o.quantity}</td>
                <td>{o.total}</td>
                <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => setOrderPage((prev) => Math.max(prev - 1, 1))} disabled={orderPage === 1}>Prev</button>
          <span>Page {orderPage} of {totalOrderPages}</span>
          <button onClick={() => setOrderPage((prev) => (prev < totalOrderPages ? prev + 1 : prev))} disabled={orderPage === totalOrderPages}>Next</button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="dashboard-section">
        <div className="dashboard-header-row">
          <h2>Payments</h2>
          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Search payments..."
              value={paymentSearch}
              onChange={(e) => {
                setPaymentSearch(e.target.value);
                setPaymentPage(1);
              }}
              className="search-input"
            />
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPaymentPage(1);
              }}
              className="select-filter"
            >
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount (RWF)</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((p) => (
              <tr key={p.id}>
                <td>{p.orderId}</td>
                <td>{p.amount}</td>
                <td>{p.method}</td>
                <td><span className={`status-badge ${p.status.toLowerCase()}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => setPaymentPage((prev) => Math.max(prev - 1, 1))} disabled={paymentPage === 1}>Prev</button>
          <span>Page {paymentPage} of {totalPaymentPages}</span>
          <button onClick={() => setPaymentPage((prev) => (prev < totalPaymentPages ? prev + 1 : prev))} disabled={paymentPage === totalPaymentPages}>Next</button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="dashboard-section">
        <div className="dashboard-header-row">
          <h2>Messages</h2>
          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Search messages..."
              value={messageSearch}
              onChange={(e) => {
                setMessageSearch(e.target.value);
                setMessagePage(1);
              }}
              className="search-input"
            />
            <select
              value={messageFilter}
              onChange={(e) => {
                setMessageFilter(e.target.value);
                setMessagePage(1);
              }}
              className="select-filter"
            >
              <option value="">All</option>
              <option value="Read">Read</option>
              <option value="Unread">Unread</option>
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Subject</th>
              <th>Content</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.map((m) => (
              <tr key={m.id}>
                <td>{m.sender}</td>
                <td>{m.subject}</td>
                <td>{m.content}</td>
                <td><span className={`status-badge ${m.status.toLowerCase()}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => setMessagePage((prev) => Math.max(prev - 1, 1))} disabled={messagePage === 1}>Prev</button>
          <span>Page {messagePage} of {totalMessagePages}</span>
          <button onClick={() => setMessagePage((prev) => (prev < totalMessagePages ? prev + 1 : prev))} disabled={messagePage === totalMessagePages}>Next</button>
        </div>
      </div>
    </div>
  );
}
