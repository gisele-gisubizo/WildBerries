import { BrowserRouter, Route, Routes } from "react-router-dom";

// Main site components
import Home from "./Components/Home";
import Layout from "./Components/Layout";
import PageDetails from "./Components/ProductDetails";
import Stores from "./Components/Stores";
import Profile from "./Components/Profile";
import Cart from "./Components/Cart";
import EntryPage from "./Components/EntryPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Checkout from "./Components/Checkout";
import OrderSuccess from "./Components/OrderSuccess";
import MomoPayment from "./Components/MomoPayment";
import OtpVerification from "./Components/OtpVerification";
import Location from "./Components/Location"; // Added import for Location component
// import ProtectedRoute from "./ProtectedRoute";

// Admin dashboard components
import DashboardLayout from "./AdminDashboard/Layout";
import DashboardHome from "./AdminDashboard/DashboardHome";
import ShopsPage from "./AdminDashboard/Shops";
import ShopDetailsPage from "./AdminDashboard/ShopDetailsPage";
import ApplicationsPage from "./AdminDashboard/Applications";
import MessagesPage from "./AdminDashboard/Messages";
import SettingsPage from "./AdminDashboard/Settings";
import { ShopProvider } from "./AdminDashboard/ShopContext";

// Seller dashboard components
import SellerDashboardLayout from "./SellersDashboard/SellerDashboardLayout";
import SellerDashboard from "./SellersDashboard/SellerDashboard";
import ProductsPage from "./SellersDashboard/Products";
import AddProductPage from "./SellersDashboard/Addproduct";


import "./App.css";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Entry and Auth Pages */}
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/otp" element={<OtpVerification />} />

        {/* Main Site Layout */}
        <Route path="/site" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:category" element={<Home />} />
          <Route path="category/:category/:subcategory" element={<Home />} />
          <Route path="product/:id" element={<PageDetails />} />
          <Route path="stores" element={<Stores />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="momo-payment" element={<MomoPayment />} />
          <Route path="location" element={<Location />} /> {/* Added Location route */}
        </Route>

        {/* Admin Dashboard */}
        <Route path="/dashboard" element={
          <ShopProvider>
            <DashboardLayout />
          </ShopProvider>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="shops" element={<ShopsPage />} />
          <Route path="shops/:id" element={<ShopDetailsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>

        {/* Seller Dashboard */}
        <Route path="/seller-dashboard" element={<SellerDashboardLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="add-product" element={<AddProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;