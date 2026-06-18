import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";

export default function UserStores() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [message, setMessage] = useState("");

  function loadStores() {
    client
      .get("/user/stores", { params: filters })
      .then((res) => setStores(res.data))
      .catch((err) => setMessage(err.response?.data?.message || "Failed to load"));
  }

  useEffect(() => {
    loadStores();
  }, []);

  async function rate(storeId, rating) {
    setMessage("");
    try {
      await client.post(`/user/stores/${storeId}/rating`, { rating });
      setMessage("Rating saved");
      loadStores();
    } catch (err) {
      setMessage(err.response?.data?.message || "Rating failed");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #ccc", marginBottom: 20 }}>
        <strong>Stores</strong>
        <Link to="/change-password">Change Password</Link>
        <span style={{ marginLeft: "auto" }}>{user?.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Search by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Search by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <button onClick={loadStores}>Search</button>
      </div>

      {message && <p>{message}</p>}

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.overallRating}</td>
              <td>{s.myRating ?? "—"}</td>
              <td>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => rate(s.id, n)}
                    style={{
                      marginRight: 4,
                      fontWeight: s.myRating === n ? "bold" : "normal",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}