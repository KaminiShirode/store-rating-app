import { useEffect, useState } from "react";
import client from "../../api/client";
import AdminNav from "../../components/AdminNav";
import { validateName, validateEmail, validatePassword, validateAddress } from "../../utils/validation";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "USER" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  function loadUsers() {
    const params = { ...filters, sortBy, order };
    client
      .get("/admin/users", { params })
      .then((res) => setUsers(res.data))
      .catch((err) => setMessage(err.response?.data?.message || "Failed to load"));
  }

  function viewUser(id) {
    client
      .get(`/admin/users/${id}`)
      .then((res) => setSelected(res.data))
      .catch((err) => setMessage(err.response?.data?.message || "Failed to load user"));
  }

  useEffect(() => {
    loadUsers();
  }, [sortBy, order]);

  function toggleSort(field) {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  }

  function validate() {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address),
    };
    setErrors(e);
    return Object.values(e).every((msg) => msg === "");
  }

  async function handleCreate(e) {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;
    try {
      await client.post("/admin/users", form);
      setMessage("User created");
      setForm({ name: "", email: "", password: "", address: "", role: "USER" });
      setErrors({});
      loadUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Create failed");
    }
  }

  function arrow(field) {
    if (sortBy !== field) return "";
    return order === "asc" ? " ▲" : " ▼";
  }

  return (
    <div>
      <AdminNav />
      <div className="page">
        <h2>Manage Users</h2>

        <div className="card" style={{ marginBottom: 24, maxWidth: 420 }}>
          <h3>Add User</h3>
          <form onSubmit={handleCreate} noValidate style={{ display: "grid", gap: 10 }}>
            <div>
              <input placeholder="Name (20-60 chars)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <small className="error">{errors.name}</small>}
            </div>
            <div>
              <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>
            <div>
              <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {errors.password && <small className="error">{errors.password}</small>}
            </div>
            <div>
              <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              {errors.address && <small className="error">{errors.address}</small>}
            </div>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
            <button type="submit">Create User</button>
          </form>
        </div>

        {message && <p style={{ marginBottom: 12 }}>{message}</p>}

        {selected && (
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>User Details</h3>
              <button onClick={() => setSelected(null)}>Close</button>
            </div>
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Address:</strong> {selected.address}</p>
            <p><strong>Role:</strong> {selected.role}</p>
            {selected.storeRating && (
              <p><strong>Store Rating:</strong> {selected.storeRating.storeName} — {selected.storeRating.rating}</p>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input style={{ flex: 1 }} placeholder="Filter name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <input style={{ flex: 1 }} placeholder="Filter email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
          <input style={{ flex: 1 }} placeholder="Filter address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          <select style={{ width: 140 }} value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
          </select>
          <button onClick={loadUsers}>Search</button>
        </div>

        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>Name{arrow("name")}</th>
              <th onClick={() => toggleSort("email")} style={{ cursor: "pointer" }}>Email{arrow("email")}</th>
              <th onClick={() => toggleSort("address")} style={{ cursor: "pointer" }}>Address{arrow("address")}</th>
              <th onClick={() => toggleSort("role")} style={{ cursor: "pointer" }}>Role{arrow("role")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} onClick={() => viewUser(u.id)} style={{ cursor: "pointer" }}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}