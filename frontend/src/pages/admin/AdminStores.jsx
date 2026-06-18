import { useEffect, useState } from "react";
import client from "../../api/client";
import AdminNav from "../../components/AdminNav";
import { validateName, validateEmail, validateAddress } from "../../utils/validation";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerEmail: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function loadStores() {
    const params = { ...filters, sortBy, order };
    client
      .get("/admin/stores", { params })
      .then((res) => setStores(res.data))
      .catch((err) => setMessage(err.response?.data?.message || "Failed to load"));
  }

  useEffect(() => {
    loadStores();
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
      address: validateAddress(form.address),
      ownerEmail: validateEmail(form.ownerEmail),
    };
    setErrors(e);
    return Object.values(e).every((msg) => msg === "");
  }

  async function handleCreate(e) {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;
    try {
      await client.post("/admin/stores", form);
      setMessage("Store created");
      setForm({ name: "", email: "", address: "", ownerEmail: "" });
      setErrors({});
      loadStores();
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
        <h2>Manage Stores</h2>

        <div className="card" style={{ marginBottom: 24, maxWidth: 420 }}>
          <h3>Add Store</h3>
          <form onSubmit={handleCreate} noValidate style={{ display: "grid", gap: 10 }}>
            <div>
              <input placeholder="Store Name (20-60 chars)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <small className="error">{errors.name}</small>}
            </div>
            <div>
              <input placeholder="Store Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>
            <div>
              <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              {errors.address && <small className="error">{errors.address}</small>}
            </div>
            <div>
              <input placeholder="Owner Email (existing user)" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} />
              {errors.ownerEmail && <small className="error">{errors.ownerEmail}</small>}
            </div>
            <button type="submit">Create Store</button>
          </form>
        </div>

        {message && <p style={{ marginBottom: 12 }}>{message}</p>}

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input style={{ flex: 1 }} placeholder="Filter name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <input style={{ flex: 1 }} placeholder="Filter email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
          <input style={{ flex: 1 }} placeholder="Filter address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          <button onClick={loadStores}>Search</button>
        </div>

        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>Name{arrow("name")}</th>
              <th onClick={() => toggleSort("email")} style={{ cursor: "pointer" }}>Email{arrow("email")}</th>
              <th onClick={() => toggleSort("address")} style={{ cursor: "pointer" }}>Address{arrow("address")}</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}