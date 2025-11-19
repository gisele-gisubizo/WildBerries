import React from "react";
import ReactDOM from "react-dom/client"; 
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { CatalogProvider } from "./contexts/CatalogContext";
import { CartProvider } from "./contexts/CartContext";
import "./i18n"; 
import "./index.css"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  </React.StrictMode>
);
