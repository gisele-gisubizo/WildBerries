import React from 'react'
import SellerSidebar from './SellerSidebar'
import SellerNavbar from './SellerNavbar'
import { Outlet } from 'react-router-dom'
import '../AdminDashboard/dashboardLayout.css';
const SellerDashboardLayout = () => {
  return (
  <div className="dashboard-layout">
      <SellerSidebar />
      <div className="dashboard-main">
        <SellerNavbar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SellerDashboardLayout
