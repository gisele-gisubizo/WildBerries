import { FaUserCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './navbar.css';

const DashboardNavbar = () => {
  const user = {
    username: 'Admin',
    profile_picture_url: null,
  };

  const { i18n } = useTranslation();

  // Function to change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="dashboard-navbar">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="navbar-right">
        {/* Language Switcher */}
        <select
          className="language-switcher"
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="rw">Kinyarwanda</option>
        </select>

        {/* User Info */}
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

export default DashboardNavbar;
