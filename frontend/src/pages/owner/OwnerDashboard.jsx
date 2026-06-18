import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/owner/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load"));
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #ccc", marginBottom: 20 }}>
        <strong>Owner Dashboard</strong>
        <Link to="/change-password">Change Password</Link>
        <span style={{ marginLeft: "auto" }}>{user?.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <>
          <h2>{data.store.name}</h2>
          <p style={{ fontSize: 20 }}>
            Average Rating: <strong>{data.averageRating}</strong>
          </p>

          <h3>Users Who Rated Your Store</h3>
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.raters.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No ratings yet</td>
                </tr>
              ) : (
                data.raters.map((r) => (
                  <tr key={r.userId}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.rating}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}