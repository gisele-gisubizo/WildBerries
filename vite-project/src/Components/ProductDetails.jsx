import React from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import '../Styles/productDetails.css';

// ✅ import all images
import item1 from '../assets/images/home/item1.jpg';
import item2 from '../assets/images/home/item2.jpg';
import item3 from '../assets/images/home/item3.jpg';
import item4 from '../assets/images/home/item4.jpg';
import item5 from '../assets/images/home/item5.jpg';
import item6 from '../assets/images/home/item6.jpg';
import item7 from '../assets/images/home/item7.jpg';
import item8 from '../assets/images/home/item8.jpg';
import item9 from '../assets/images/home/item9.jpg';
import item10 from '../assets/images/home/item10.jpg';
import item11 from '../assets/images/home/item11.jpg';
import item12 from '../assets/images/home/item12.jpg';

const images = {
  1: item1,
  2: item2,
  3: item3,
  4: item4,
  5: item5,
  6: item6,
  7: item7,
  8: item8,
  9: item9,
  10: item10,
  11: item11,
  12: item12,
};

const ProductDetails = () => {
  const { id } = useParams();

  const productId = Number(id);

  const product = {
    id: productId,
    name: `Item ${productId}`,
    image: images[productId] || item1, // fallback if not found
    price: 29.99 + productId, // demo price
    description: 'This is a detailed description of the product.',
    rating: 4.8,
    reviews: 1200,
    discount: 50,
  };

  return (
    <div className="product-details">
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <div className="price">
        ${product.price.toFixed(2)}
        <span className="old-price">${(product.price * 1.5).toFixed(2)}</span>
      </div>
      <div className="rating">
        <FaStar /> {product.rating} · {product.reviews} reviews
      </div>
      <p>{product.description}</p>
      <button className="buy-btn">
        <FaShoppingCart /> Buy Now
      </button>
    </div>
  );
};

export default ProductDetails;
