import React, { useState } from "react";

const ProductsPage = () => {
    const [products] = useState([
        { id: 1, name: "Nike Air Force 1 Sneakers", category: "Fashion & Clothing", subcategory: "Shoes", price: 156000, quantity: 2, status: "Active", stock: 45, brand: "Nike" },
        { id: 2, name: "Zara Summer Dress", category: "Fashion & Clothing", subcategory: "Dresses", price: 97500, quantity: 1, status: "Out of Stock", stock: 0, brand: "Zara" },
        { id: 3, name: "Levi’s Slim Fit Jeans", category: "Fashion & Clothing", subcategory: "Jeans", price: 78000, quantity: 3, status: "Active", stock: 30, brand: "Levi’s" },
        { id: 4, name: "iPhone 14 Pro", category: "Electronics", subcategory: "Smartphones", price: 1690000, quantity: 1, status: "Active", stock: 15, brand: "Apple" },
        { id: 5, name: "Samsung 4K Smart TV", category: "Electronics", subcategory: "Televisions", price: 1040000, quantity: 2, status: "Draft", stock: 10, brand: "Samsung" },
        { id: 6, name: "Sony WH-1000XM5 Headphones", category: "Electronics", subcategory: "Headphones", price: 455000, quantity: 1, status: "Delivered", stock: 5, brand: "Sony" },
        { id: 7, name: "LG Washing Machine", category: "Home Appliances", subcategory: "Washing Machines", price: 715000, quantity: 1, status: "Ordered", stock: 12, brand: "LG" },
        { id: 8, name: "Philips Air Fryer", category: "Home Appliances", subcategory: "Kitchen", price: 195000, quantity: 2, status: "Cancelled", stock: 20, brand: "Philips" },
        { id: 9, name: "Dyson Vacuum Cleaner", category: "Home Appliances", subcategory: "Cleaning", price: 520000, quantity: 1, status: "Shipped", stock: 8, brand: "Dyson" },
        { id: 10, name: "Maybelline Lipstick", category: "Beauty", subcategory: "Makeup", price: 26000, quantity: 5, status: "Active", stock: 100, brand: "Maybelline" },
        { id: 11, name: "L’Oreal Shampoo", category: "Beauty", subcategory: "Haircare", price: 19500, quantity: 3, status: "Returned", stock: 50, brand: "L’Oreal" },
        { id: 12, name: "Atomic Habits", category: "Books", subcategory: "Self-Help", price: 32500, quantity: 2, status: "Active", stock: 70, brand: "Penguin" },
        { id: 13, name: "Harry Potter Box Set", category: "Books", subcategory: "Fantasy", price: 156000, quantity: 1, status: "Delivered", stock: 25, brand: "Bloomsbury" },
        { id: 14, name: "Adidas Football", category: "Sports", subcategory: "Balls", price: 65000, quantity: 4, status: "Active", stock: 40, brand: "Adidas" },
        { id: 15, name: "Wilson Tennis Racket", category: "Sports", subcategory: "Rackets", price: 260000, quantity: 1, status: "Draft", stock: 18, brand: "Wilson" },
    ]);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Filter + search
    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? p.status === filter : true;
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="dashboard-section">
<button className="export-btn">+ Add Product</button>
            <div className="dashboard-header-row">
                <h2>My Products</h2>
                <div className="dashboard-controls">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="select-filter"
                    >
                        <option value="">All</option>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Ordered">Ordered</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Returned">Returned</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Price (RWF)</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.length > 0 ? (
                        currentProducts.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.category}</td>
                                <td>{p.subcategory}</td>
                                <td>{p.price.toLocaleString()} RWF</td>
                                <td>{p.quantity}</td>
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                No products found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductsPage;
