import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Layout from './Components/Layout';
import PageDetails from './Components/ProductDetails';
import './App.css';
import DashboardLayout from './AdminDashboard/Layout';
import VendorsPage from './AdminDashboard/Vendors';
import DashboardHome from './AdminDashboard/DashboardHome';
import ShopsPage from './AdminDashboard/Shops';
import ShopDetailsPage from './AdminDashboard/ShopDetailsPage';
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='Home' element={<Home />} />
          <Route path='Product/:id' element={<PageDetails />} />
        </Route>

        <Route path='/Dashboard' element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path='vendors' element={<VendorsPage />} />
          <Route path='shops' element={<ShopsPage />} />
          <Route path='shops/:id' element={<ShopDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
