import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import AdminNav from "../../components/AdminNav";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load"));
  }, []);

  return (
    <div>
      <AdminNav />
      <div className="page">
        <h2>Admin Dashboard</h2>
        <p style={{ marginBottom: 20, color: "var(--text-muted)" }}>Welcome, {user?.name}</p>
        {error && <p className="error">{error}</p>}
        {stats && (
          <div style={{ display: "flex", gap: 20 }}>
            <div className="stat-card">
              <div className="num">{stats.totalUsers}</div>
              <div className="label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="num">{stats.totalStores}</div>
              <div className="label">Total Stores</div>
            </div>
            <div className="stat-card">
              <div className="num">{stats.totalRatings}</div>
              <div className="label">Total Ratings</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}