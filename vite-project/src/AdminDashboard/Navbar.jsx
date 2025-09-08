import { FaUserCircle } from 'react-icons/fa';
import './navbar.css';

const DashboardNavbar = () => {
  const user = {
    username: 'Admin',
    profile_picture_url: null, 
  };

  return (
    <header className="dashboard-navbar">
      <h1 className="dashboard-title">Dashboard</h1>

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
    </header>
  );
};

export default DashboardNavbar;
