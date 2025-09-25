// src/Components/EntryPage.jsx
import { Link } from "react-router-dom";
import "../Styles/entrypage.css";

const EntryPage = () => {
  return (
    <div className="entry-container">
      <div className="entry-box">
        <h2>Welcome</h2>
        <p className="entry-subtitle">Choose how you want to start</p>
        
        <div className="entry-buttons">
          <Link to="/site" className="btn-outline">Shop Now</Link>
          <Link to="/login" className="btn-dark">Sign In</Link>
          <Link to="/register" className="btn-dark">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
