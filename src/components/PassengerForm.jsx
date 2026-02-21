import React, { useState } from "react";
import { addPassenger } from "../services/passengers"; // keep as-is for now (safe)

export default function PassengerForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter rider name");

    setLoading(true);
    try {
      await addPassenger({
        name: name.trim(),
        phone: phone.trim(),
        createdAt: Date.now(),
      });
      setName("");
      setPhone("");
    } catch (err) {
      console.error(err);
      alert("Failed to add rider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label}>Rider Name</label>
        <input
          style={styles.input}
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Phone (optional)</label>
        <input
          style={styles.input}
          placeholder="Mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button type="submit" style={styles.btn} disabled={loading}>
        {loading ? "Adding..." : "Add Rider"}
      </button>
    </form>
  );
}

const styles = {
  form: { display: "grid", gap: 12 },
  field: { display: "grid", gap: 6 },
  label: { fontSize: 12, fontWeight: 800, color: "#334155" },
  input: {
    width: "100%",
    border: "1px solid rgba(148,163,184,0.35)",
    borderRadius: 14,
    padding: "12px 12px",
    outline: "none",
    fontSize: 13,
    background: "rgba(255,255,255,0.95)",
  },
  btn: {
    marginTop: 6,
    border: "none",
    borderRadius: 14,
    padding: "12px 14px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#0F766E",
    color: "white",
  },
};