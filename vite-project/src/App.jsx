import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Layout from "./Components/Layout";
import PageDetails from "./Components/ProductDetails";
import Stores from "./Components/Stores";
import Profile from "./Components/Profile";
import Cart from "./Components/Cart"; // Import Cart component

import "./App.css";

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    const items = savedCart ? JSON.parse(savedCart) : [];
    setCartCount(items.reduce((sum, item) => sum + (item.quantity || 1), 0));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route
          path="/"
          element={<Layout cartCount={cartCount} />}
        >
          {/* Home page */}
          <Route index element={<Home />} />

          {/* Product details page */}
          <Route path="/product/:id" element={<PageDetails setCartCount={setCartCount} />} />

          {/* Stores listing page */}
          <Route path="/stores" element={<Stores />} />

          {/* Profile page */}
          <Route path="/profile" element={<Profile />} />

          {/* Cart page */}
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;