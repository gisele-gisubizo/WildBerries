import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <Navbar />
      <main style={{ flex: 1, width: "100%", overflowX: "hidden" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
