import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Layout from './Components/Layout';
import PageDetails from './Components/ProductDetails';
import './App.css';
import DashboardLayout from './AdminDashboard/Layout';
import DashboardHome from './AdminDashboard/DashboardHome';
import ShopsPage from './AdminDashboard/Shops';
import ShopDetailsPage from './AdminDashboard/ShopDetailsPage';
import ApplicationsPage from './AdminDashboard/Applications';
import { ShopProvider } from './AdminDashboard/ShopContext';
import MessagesPage from './AdminDashboard/Messages';
import SettingsPage from './AdminDashboard/Settings';
import SellerDashboardLayout from './SellersDashboard/SellerDashboardLayout';
import SellerDashboard from './SellersDashboard/SellerDashboard';
import ProductsPage from './SellersDashboard/Products';
import AddProductPage from './SellersDashboard/Addproduct';
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

        <Route path='/Dashboard' element={
          <ShopProvider>
            <DashboardLayout />
          </ShopProvider>
        }>
          <Route index element={<DashboardHome />} />
          <Route path='applications' element={<ApplicationsPage />} />
          <Route path='shops' element={<ShopsPage />} />
          <Route path='shops/:id' element={<ShopDetailsPage />} />
          <Route path='settings' element={<SettingsPage />} />

          <Route path='messages' element={<MessagesPage />} />
        </Route>
        <Route path='/SellerDashboard' element={<SellerDashboardLayout />}>
                  <Route index element={<SellerDashboard />} />
                  <Route path='products' element={<ProductsPage />} />
                  <Route path='add-product' element={<AddProductPage />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
