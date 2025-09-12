import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShops } from './ShopContext';
import './dashboard.css';

export default function ShopDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { approvedShops } = useShops();

    const shop = approvedShops.find(s => s.id === parseInt(id));

    const products = [
        { id: 1, shopId: 1, name: 'Fresh Apples', price: 700, image: 'https://source.unsplash.com/300x200/?apples' },
        { id: 2, shopId: 1, name: 'Bananas', price: 1200, image: 'https://source.unsplash.com/300x200/?bananas' },
        { id: 3, shopId: 2, name: 'Rice 5kg', price: 8000, image: 'https://source.unsplash.com/300x200/?rice' },
        { id: 4, shopId: 2, name: 'Cooking Oil 1L', price: 3500, image: 'https://source.unsplash.com/300x200/?cooking-oil' },
        { id: 5, shopId: 3, name: 'Sugar 2kg', price: 2500, image: 'https://source.unsplash.com/300x200/?sugar' },
    ];

    const shopProducts = products.filter(p => p.shopId === shop?.id);

    if (!shop) {
        return (
            <div className="dashboard-container">
                <h3>Shop not found!</h3>
                <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
            </div>
        );
    }

    return (
        <div className="dashboard-container shop-details-page">
            <div className="shop-info-card">
                <h2>{shop.name}</h2>
                <p><strong>Owner:</strong> {shop.owner || 'N/A'}</p>
                <p><strong>Email:</strong> {shop.email || 'N/A'}</p>
                <p><strong>Address:</strong> {shop.address || 'N/A'}</p>
                <p><strong>Applied Date:</strong> {shop.appliedDate || 'N/A'}</p>
                <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-badge ${shop.status?.toLowerCase()}`}>
                        {shop.status}
                    </span>
                </p>
                <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back to Shops</button>
            </div>

            <div className="shop-products-section">
                <h3>Products</h3>
                {shopProducts.length > 0 ? (
                    <div className="products-grid">
                        {shopProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} />
                                <h4>{product.name}</h4>
                                <p className="product-price">RWF {product.price.toLocaleString()}</p>
                                <button className="view-product-btn">View Product</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No products added by this shop yet.</p>
                )}
            </div>
        </div>
    );
}
