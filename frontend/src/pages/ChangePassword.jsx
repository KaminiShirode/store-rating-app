import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      await client.put("/auth/change-password", { currentPassword, newPassword });
      setMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Change failed");
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "sans-serif" }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password (8-16, 1 uppercase, 1 special)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}