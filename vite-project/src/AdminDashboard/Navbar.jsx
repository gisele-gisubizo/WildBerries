'use client'

import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { FaUserCircle } from 'react-icons/fa'
import './navbar.css'

const DashboardNavbar = () => {

  const { user, loading } = useAuth();


  if (loading) {
    return (
      <header className="dashboard-navbar">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-user loading-user">
          <div className="skeleton skeleton-icon"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </header>
    );
  }
  if (!user) {
    return (
        <header className="dashboard-navbar">
            <h1 className="dashboard-title">Dashboard</h1>
        </header>
    );
  }

  return (
    <header className="dashboard-navbar">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-user">

        {user.profile_picture_url ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture_url}`}
            alt="User profile picture"
            width={36}
            height={36}
            className="user-avatar" 
          />
        ) : (

          <FaUserCircle className="user-icon" />
        )}


        <span className="username">{user.username} </span>
      </div>
    </header>
  )
}

export default DashboardNavbar