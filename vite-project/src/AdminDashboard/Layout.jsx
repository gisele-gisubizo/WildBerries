import Sidebar from './Sidebar';
import DashboardNavbar from './Navbar';
import { Outlet } from 'react-router-dom';
import './dashboardLayout.css'; 

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardNavbar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
