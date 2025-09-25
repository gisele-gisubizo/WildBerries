import React from 'react'
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from 'react-icons/fa';
import '../AdminDashboard/navbar.css';
const SellerNavbar = () => {
const user = {
    username: 'Alice',
    profile_picture_url: null,                                                                                                                                                                                                                                       
  };

  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="dashboard-navbar">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="navbar-right">
        <select
          className="language-switcher"
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="rw">Kinyarwanda</option>
        </select>

        {user && (
          <div className="dashboard-user">
            {user.profile_picture_url ? (
              <img
                src={user.profile_picture_url}
                alt="User profile"
                width={36}
                height={36}
                className="user-avatar"
              />
            ) : (
              <FaUserCircle className="user-icon" />
            )}
            <span className="username">{user.username}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default SellerNavbar