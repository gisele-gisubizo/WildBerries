import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useShops } from "./ShopContext";

export default function ShopsPage() {
  const navigate = useNavigate();
  const { approvedShops, loading, error, refreshApprovedShops } = useShops();

  const [search, setSearch] = useState("");
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredShops = useMemo(() => {
    return approvedShops.filter(
      (shop) =>
        (shop.owner &&
          shop.owner.toLowerCase().includes(search.toLowerCase())) ||
        (shop.name && shop.name.toLowerCase().includes(search.toLowerCase())) ||
        (shop.address &&
          shop.address.toLowerCase().includes(search.toLowerCase())) ||
        (shop.email && shop.email.toLowerCase().includes(search.toLowerCase())),
    );
  }, [approvedShops, search]);

  const totalPages = Math.ceil(filteredShops.length / rowsPerPage);
  const paginate = (data, page) =>
    data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleEdit = () => {
    toast.info("Shop editing is coming soon.");
  };

  const handleDelete = () => {
    toast.info("Shop deletion is coming soon.");
  };

  const handleView = (shop) => {
    navigate(`/dashboard/shops/${shop.id}`, { state: { shop } });
  };

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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          <button className="refresh-btn" onClick={refreshApprovedShops}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading approved shops...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
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
                  <td>
                    {shop.appliedDate
                      ? new Date(shop.appliedDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    <FaRegEye
                      title="View Shop"
                      onClick={() => handleView(shop)}
                      style={{
                        color: "#007bff",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        transition: "transform 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />

                    <MdEdit
                      title="Edit Shop"
                      onClick={handleEdit}
                      style={{
                        color: "#007bff",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        transition: "transform 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />

                    <FaRegTrashAlt
                      title="Delete Shop"
                      onClick={handleDelete}
                      style={{
                        color: "#c6131b",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        transition: "transform 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages ? prev + 1 : prev,
                )
              }
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
