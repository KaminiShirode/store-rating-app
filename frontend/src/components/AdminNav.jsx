import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/users">Users</Link>
      <Link to="/admin/stores">Stores</Link>
      <span className="spacer">{user?.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}