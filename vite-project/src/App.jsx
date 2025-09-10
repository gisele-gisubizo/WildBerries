import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Layout from "./Components/Layout";
import PageDetails from "./Components/ProductDetails";
import Stores from "./Components/Stores";
import StoreDetails from "./Components/StoreDetails"; // ✅ New store details page
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          
          {/* Home page */}
          <Route index element={<Home />} />

          {/* Product details page */}
          <Route path="/product/:id" element={<PageDetails />} />

          {/* Stores listing page */}
          <Route path="/stores" element={<Stores />} />

          {/* ✅ Dynamic store details page */}
          <Route path="/stores/:id" element={<StoreDetails />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
