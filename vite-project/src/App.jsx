import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import OrderSuccess from "./Components/OrderSuccess"; // ⬅️ added
import MomoPayment from "./Components/MomoPayment"; // ⬅️ added

import "./App.css";

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    const items = savedCart ? JSON.parse(savedCart) : [];
    setCartCount(items.reduce((sum, item) => sum + (item.quantity || 1), 0));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem("cartItems");
      const items = savedCart ? JSON.parse(savedCart) : [];
      setCartCount(items.reduce((sum, item) => sum + (item.quantity || 1), 0));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Entry Page (first screen) */}
        <Route path="/" element={<EntryPage />} />

        {/* ✅ Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Main site inside Layout */}
        <Route path="/site" element={<Layout cartCount={cartCount} />}>
          <Route index element={<Home />} />
          <Route path="category/:category" element={<Home />} />
          <Route path="category/:category/:subcategory" element={<Home />} />
          <Route path="product/:id" element={<PageDetails setCartCount={setCartCount} />} />
          <Route path="stores" element={<Stores />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} /> {/* ⬅️ added */}
          <Route path="momo-payment" element={<MomoPayment />} />   {/* ⬅️ added */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
