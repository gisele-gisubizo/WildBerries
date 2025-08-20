import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../Styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Learn more about wildBerries and our mission to bring you the best shopping experience.</p>
        </div>
        <div className="footer-section">
          <h3>Contacts</h3>
          <p>Email: support@wildberries.com</p>
          <p>Phone: +1-800-555-1234</p>
        </div>
        <div className="footer-section">
          <h3>Delivery</h3>
          <p>Fast and reliable shipping worldwide.</p>
        </div>
        <div className="footer-section">
          <h3>Returns</h3>
          <p>Easy returns within 30 days of purchase.</p>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 wildBerries. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;