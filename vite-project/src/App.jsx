import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Layout from "./Components/Layout";
import PageDetails from "./Components/ProductDetails";
import Stores from "./Components/Stores";
import Suppliers from "./Components/Suppliers"; // ✅ Import Suppliers page
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          
          {/* Home page */}
          <Route index element={<Home />} />

          {/* Product details page */}
          <Route path="/product/:id" element={<PageDetails />} />

          {/* Stores page */}
          <Route path="/stores" element={<Stores />} />

          {/* Suppliers page */}
          <Route path="/suppliers" element={<Suppliers />} />  {/* ✅ Added */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
