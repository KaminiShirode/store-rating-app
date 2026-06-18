import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import { validateName, validateEmail, validatePassword, validateAddress } from "../utils/validation";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  function validate() {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };
    setErrors(e);
    return Object.values(e).every((msg) => msg === "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validate()) return;
    try {
      await client.post("/auth/signup", form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 14 }}>
          <div>
            <input placeholder="Name (20-60 characters)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>
          <div>
            <input type="text" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>
          <div>
            <input placeholder="Address (max 400 characters)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            {errors.address && <small className="error">{errors.address}</small>}
          </div>
          <div>
            <input type="password" placeholder="Password (8-16, 1 uppercase, 1 special)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {errors.password && <small className="error">{errors.password}</small>}
          </div>
          <button type="submit">Sign Up</button>
        </form>
        {serverError && <p className="error" style={{ marginTop: 12 }}>{serverError}</p>}
        {success && <p className="success" style={{ marginTop: 12 }}>{success}</p>}
        <p style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}