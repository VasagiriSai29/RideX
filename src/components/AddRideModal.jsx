import React, { useMemo, useState } from "react";
import { addRide } from "../services/rides";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AddRideModal({ open, onClose, riders }) {
  const [rideDate, setRideDate] = useState(todayISO());
  const [riderId, setRiderId] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");

  // payment
  const [payType, setPayType] = useState("cash"); // cash | zelle | both
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending | partial | paid
  const [cashAmount, setCashAmount] = useState("");
  const [zelleAmount, setZelleAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const [saving, setSaving] = useState(false);

  const selectedRider = useMemo(
    () => (riders || []).find((r) => r.id === riderId),
    [riders, riderId]
  );

  if (!open) return null;

  const resetForm = () => {
    setRideDate(todayISO());
    setRiderId("");
    setPickupLocation("");
    setDropLocation("");
    setPickupTime("");
    setDropTime("");
    setPayType("cash");
    setPaymentStatus("pending");
    setCashAmount("");
    setZelleAmount("");
    setTotalAmount("");
  };

  const close = () => {
    onClose?.();
  };

  const submit = async () => {
    if (!riderId) return alert("Please select a rider");
    if (!rideDate) return alert("Please select date");
    if (!pickupLocation.trim()) return alert("Enter pickup location");
    if (!dropLocation.trim()) return alert("Enter drop location");
    if (!pickupTime) return alert("Enter pickup time");

    const cash = Number(cashAmount || 0);
    const zelle = Number(zelleAmount || 0);
    const total = Number(totalAmount || cash + zelle);

    setSaving(true);
    try {
      await addRide({
        riderId,
        riderName: selectedRider?.name || "",
        rideDate, // YYYY-MM-DD
        pickupLocation: pickupLocation.trim(),
        dropLocation: dropLocation.trim(),
        pickupTime,
        dropTime,
        payType, // cash|zelle|both
        paymentStatus, // pending|partial|paid
        cashAmount: cash,
        zelleAmount: zelle,
        totalAmount: total,
      });

      alert("Ride saved ✅");
      resetForm();
      close();
    } catch (e) {
      console.error(e);
      alert("Failed to save ride: " + (e?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={M.backdrop} onMouseDown={close}>
      <div style={M.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={M.header}>
          <div style={M.title}>Add Ride</div>
          <button style={M.closeBtn} onClick={close}>
            ✕
          </button>
        </div>

        <div style={M.body}>
          <div style={M.grid}>
            <Field label="Date">
              <input
                type="date"
                value={rideDate}
                onChange={(e) => setRideDate(e.target.value)}
                style={M.input}
              />
            </Field>

            <Field label="Rider">
              <select
                value={riderId}
                onChange={(e) => setRiderId(e.target.value)}
                style={M.input}
              >
                <option value="">Select rider</option>
                {(riders || []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.phone ? `(${r.phone})` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Pickup Location">
              <input
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                style={M.input}
                placeholder="Eg: 282 Yates St"
              />
            </Field>

            <Field label="Drop Location">
              <input
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                style={M.input}
                placeholder="Eg: Albany Airport"
              />
            </Field>

            <Field label="Pickup Time">
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                style={M.input}
              />
            </Field>

            <Field label="Drop Time (optional)">
              <input
                type="time"
                value={dropTime}
                onChange={(e) => setDropTime(e.target.value)}
                style={M.input}
              />
            </Field>

            <Field label="Pay Type">
              <select
                value={payType}
                onChange={(e) => setPayType(e.target.value)}
                style={M.input}
              >
                <option value="cash">Cash</option>
                <option value="zelle">Zelle</option>
                <option value="both">Both</option>
              </select>
            </Field>

            <Field label="Payment Status">
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                style={M.input}
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </Field>

            <Field label="Cash Amount">
              <input
                inputMode="decimal"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                style={M.input}
                placeholder="0"
              />
            </Field>

            <Field label="Zelle Amount">
              <input
                inputMode="decimal"
                value={zelleAmount}
                onChange={(e) => setZelleAmount(e.target.value)}
                style={M.input}
                placeholder="0"
              />
            </Field>

            <Field label="Total Amount">
              <input
                inputMode="decimal"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                style={M.input}
                placeholder="auto = cash + zelle"
              />
            </Field>
          </div>
        </div>

        <div style={M.footer}>
          <button style={M.secondary} onClick={close}>
            Cancel
          </button>
          <button style={M.primary} onClick={submit} disabled={saving}>
            {saving ? "Saving..." : "Save Ride"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#334155" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const M = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: 780,
    background: "white",
    borderRadius: 18,
    border: "1px solid rgba(15, 23, 42, 0.10)",
    boxShadow: "0 30px 80px rgba(2, 6, 23, 0.25)",
    overflow: "hidden",
  },
  header: {
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(15,23,42,0.08)",
  },
  title: { fontWeight: 900, fontSize: 16 },
  closeBtn: {
    border: "none",
    background: "rgba(15,23,42,0.06)",
    borderRadius: 10,
    cursor: "pointer",
    padding: "6px 10px",
    fontWeight: 900,
  },
  body: { padding: 14 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  input: {
    width: "100%",
    border: "1px solid rgba(148,163,184,0.35)",
    borderRadius: 14,
    padding: "11px 12px",
    outline: "none",
    fontSize: 13,
    background: "rgba(255,255,255,0.98)",
  },
  footer: {
    padding: 14,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    borderTop: "1px solid rgba(15,23,42,0.08)",
  },
  secondary: {
    border: "1px solid rgba(148,163,184,0.5)",
    background: "white",
    borderRadius: 14,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 800,
  },
  primary: {
    border: "none",
    background: "#0F172A",
    color: "white",
    borderRadius: 14,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 900,
  },
};