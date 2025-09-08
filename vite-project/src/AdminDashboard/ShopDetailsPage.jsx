import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './dashboard.css';

export default function ShopDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const shops = [
        { id: 1, owner: 'Alice Mutesi', name: 'Kigali Fresh', address: 'Kigali, KG 123 St', appliedDate: '2025-08-25', status: 'Approved' },
        { id: 2, owner: 'Brian Uwimana', name: 'Musanze Groceries', address: 'Musanze, MS 45 Ave', appliedDate: '2025-09-01', status: 'Approved' },
        { id: 3, owner: 'David Nshimiyimana', name: 'Huye Market', address: 'Huye, HY 56 Blvd', appliedDate: '2025-08-30', status: 'Approved' },
    ];
const products = [
    {
        id: 1,
        shopId: 1,
        name: 'Fresh Apples',
        price: 700,
        image: 'https://source.unsplash.com/300x200/?apples',
    },
    {
        id: 2,
        shopId: 1,
        name: 'Bananas',
        price: 1200,
        image: 'https://source.unsplash.com/300x200/?bananas',
    },
    {
        id: 3,
        shopId: 2,
        name: 'Rice 5kg',
        price: 8000,
        image: 'https://source.unsplash.com/300x200/?rice',
    },
    {
        id: 4,
        shopId: 2,
        name: 'Cooking Oil 1L',
        price: 3500,
        image: 'https://source.unsplash.com/300x200/?cooking-oil',
    },
    {
        id: 5,
        shopId: 3,
        name: 'Sugar 2kg',
        price: 2500,
        image: 'https://source.unsplash.com/300x200/?sugar',
    },
];



    const shop = shops.find(s => s.id === parseInt(id));
    const shopProducts = products.filter(p => p.shopId === shop?.id);

    if (!shop) {
        return <div className="dashboard-container"><h3>Shop not found!</h3></div>;
    }

    return (
        <div className="dashboard-container">

            {/* Products first */}
            <div className="shop-products-section">
                <h3>Products</h3>
                {shopProducts.length > 0 ? (
                    <div className="products-grid">
                        {shopProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} />
                                <h4>{product.name}</h4>
                                <p className="product-price">RWF {product.price}</p>
                                <button className="view-product-btn">View Product</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No products added by this shop yet.</p>
                )}
            </div>

            {/* Shop info at the bottom */}
            <div className="shop-info">
                <h2>{shop.name}</h2>
                <p><strong>Owner:</strong> {shop.owner}</p>
                <p><strong>Address:</strong> {shop.address}</p>
                <p><strong>Applied Date:</strong> {shop.appliedDate}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${shop.status.toLowerCase()}`}>{shop.status}</span></p>
                <button className="back-btn" onClick={() => navigate(-1)}>Back to Shops</button>
            </div>
        </div>
    );
}
