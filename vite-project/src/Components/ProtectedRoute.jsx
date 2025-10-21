import React from "react";
import { Navigate } from "react-router-dom";
import * as jwt_decode from "jwt-decode"; // fixed import

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  let userRole;
  try {
    const decoded = jwt_decode.default(token); // use .default if using * import
    userRole = decoded.role;
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
