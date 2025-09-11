import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Layout from "./Components/Layout";
import PageDetails from "./Components/ProductDetails";
import Stores from "./Components/Stores";
import Profile from "./Components/Profile";
import Cart from "./Components/Cart";
import EntryPage from "./Components/EntryPage";  // ✅ new
import Login from "./Components/Login";          // ✅ new
import Register from "./Components/Register";    // ✅ new

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
          <Route path="/site/product/:id" element={<PageDetails setCartCount={setCartCount} />} />
          <Route path="/site/stores" element={<Stores />} />
          <Route path="/site/profile" element={<Profile />} />
          <Route path="/site/cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
