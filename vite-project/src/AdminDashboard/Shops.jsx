import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEye , FaEdit, FaRegTrashAlt  } from "react-icons/fa";
import { MdEdit } from "react-icons/md";


const API_BASE_URL = "http://localhost:4000";

export default function ShopsPage() {
    const navigate = useNavigate();

    const [approvedShops, setApprovedShops] = useState([]);
    const [search, setSearch] = useState('');
    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // -----------------------
    // Fetch approved shops from backend
    // -----------------------
    const fetchApprovedShops = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found. Please login.");

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const res = await axios.get(`${API_BASE_URL}/users/sellers/approved`, config);
            setApprovedShops(res.data.data);
        } catch (err) {
            console.error("Error fetching approved shops:", err);
            const message = err.response?.data?.message || err.message;
            toast.error(`Error fetching approved shops: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedShops();
    }, []);

    // -----------------------
    // Filtering & Pagination
    // -----------------------
    const filteredShops = approvedShops.filter(
        shop =>
            (shop.owner && shop.owner.toLowerCase().includes(search.toLowerCase())) ||
            (shop.name && shop.name.toLowerCase().includes(search.toLowerCase())) ||
            (shop.address && shop.address.toLowerCase().includes(search.toLowerCase())) ||
            (shop.email && shop.email.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredShops.length / rowsPerPage);
    const paginate = (data, page) => data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="dashboard-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <div className="dashboard-header-row">
                <h2>Approved Shops</h2>
                <div className="dashboard-controls">
                    <input
                        type="text"
                        placeholder="Search shops..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="search-input"
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading approved shops...</p>
            ) : (
                <>

<table className="table">
  <thead>
    <tr>
      <th>Shop Name</th>
      <th>Address</th>
      <th>Email</th>
      <th>Applied Date</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {paginate(filteredShops, currentPage).map((shop) => (
      <tr key={shop.id}>
        <td>{shop.name || "N/A"}</td>
        <td>{shop.address || "N/A"}</td>
        <td>{shop.email || "N/A"}</td>
        <td>{shop.createdAt || "N/A"}</td>
        <td
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <FaRegEye 
            title="View Shop"
            onClick={() => navigate(`/shops/${shop.id}`)}
            style={{
              color: "#007bff",
              cursor: "pointer",
              fontSize: "1.2rem",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          <MdEdit   
            title="Edit Shop"
            onClick={() => handleEdit(shop.id)}
            style={{
              color: "#007bff",
              cursor: "pointer",
              fontSize: "1.2rem",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          <FaRegTrashAlt 
            title="Delete Shop"
            onClick={() => handleDelete(shop.id)}
            style={{
              color: "#c6131b",
              cursor: "pointer",
              fontSize: "1.2rem",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>


                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span>Page {currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
