import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/Authprovider";
import AppLayout from "../components/AppLayout";
import PassengerForm from "../components/PassengerForm";
import { listenPassengers } from "../services/passengers";
import AddRideModal from "../components/AddRideModal";
import { listenRidesByDate } from "../services/rides";

export default function Dashboard() {
  const { user, logout } = useAuth();

  // riders data (still stored in passengers collection/services for now)
  const [riders, setRiders] = useState([]);

  // search box in top bar
  const [search, setSearch] = useState("");

  const onAddRide = () => setIsRideOpen(true);
  const [isRideOpen, setIsRideOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
});

const [dayRides, setDayRides] = useState([]);
  
useEffect(() => {
  const unsub = listenRidesByDate(selectedDate, setDayRides);
  return () => unsub && unsub();
}, [selectedDate]);

  

  useEffect(() => {
    const unsub = listenPassengers(setRiders);
    return () => unsub && unsub();
  }, []);

  const filteredRiders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return riders;
    return riders.filter((r) => {
      const name = (r.name || "").toLowerCase();
      const phone = (r.phone || "").toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [riders, search]);

  const stats = useMemo(() => {
    return {
      totalRiders: riders.length,
      totalPending: 0, // later
      todayRides: 0, // later
    };
  }, [riders]);

    return (
    <AppLayout
      title="Dashboard"
      user={user}
      onLogout={logout}
      searchValue={search}
      onSearchChange={setSearch}
      onAddRide={onAddRide}
    >
      {/* Stats row */}
      <div style={styles.statsRow}>
        <Stat label="Riders" value={stats.totalRiders} sub="Total added" />
        <Stat label="Pending" value={`$${stats.totalPending}`} sub="Total due (next)" />
        <Stat label="Today" value={stats.todayRides} sub="Rides today (next)" />
      </div>

      {/* Two-column main */}
      <div style={styles.grid}>
        <div style={styles.card}>
  <div style={styles.cardHeader}>
    <div style={styles.cardTitle}>Rides</div>

    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      style={{
        border: "1px solid rgba(148,163,184,0.35)",
        borderRadius: 12,
        padding: "8px 10px",
        fontSize: 12,
        fontWeight: 800,
        outline: "none",
        background: "white",
      }}
    />
  </div>

  <DaySummary rides={dayRides} />

  {dayRides.length === 0 ? (
    <div style={styles.empty}>No rides for this date.</div>
  ) : (
    <div style={{ display: "grid", gap: 10 }}>
      {dayRides.map((r) => (
        <div key={r.id} style={styles.row}>
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontWeight: 900, color: "#0F172A" }}>
              {r.riderName || "Unknown"}
            </div>

            <div style={styles.muted}>
              {r.pickupTime || "--:--"} → {r.dropTime || "--:--"}
            </div>

            <div style={styles.muted}>
              {r.pickupLocation} → {r.dropLocation}
            </div>

            <div style={styles.muted}>
              {r.payType} • {r.paymentStatus}
            </div>
          </div>

          <div style={{ display: "grid", gap: 6, textAlign: "right" }}>
            <div style={styles.money}>
              ${Math.round(Number(r.totalAmount || 0))}
            </div>
            <div style={styles.muted}>
              paid: ${Math.round(Number(r.cashAmount || 0) + Number(r.zelleAmount || 0))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Add Rider</div>
          <PassengerForm />
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Riders</div>
            <div style={styles.smallMuted}>Balances start Day 3</div>
          </div>

          {filteredRiders.length === 0 ? (
            <div style={styles.empty}>
              {search.trim()
                ? "No riders match your search."
                : "No riders yet. Add your first rider."}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {filteredRiders.map((p) => (
  <div key={p.id} style={styles.row}>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={styles.badge}>
        {(p.name?.[0] || "R").toUpperCase()}
      </div>

      <div style={{ display: "grid", gap: 2 }}>
        <div style={{ fontWeight: 900, color: "#0F172A" }}>
          {p.name}
        </div>
        <div style={styles.muted}>{p.phone || "—"}</div>
      </div>
    </div>

    <div style={styles.money}>$0</div>
  </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Add Ride Modal goes here */}
      <AddRideModal
        open={isRideOpen}
        onClose={() => setIsRideOpen(false)}
        riders={riders}
      />
    </AppLayout>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.muted}>{sub}</div>
    </div>
  );
}

function DaySummary({ rides }) {
  const totals = useMemo(() => {
    const total = rides.reduce((s, r) => s + Number(r.totalAmount || 0), 0);

    // paid logic:
    // - if paymentStatus is "paid" => count full total
    // - else count whatever cash+zelle entered (partial)
    const paid = rides.reduce((s, r) => {
      const t = Number(r.totalAmount || 0);
      const c = Number(r.cashAmount || 0);
      const z = Number(r.zelleAmount || 0);
      if (r.paymentStatus === "paid") return s + t;
      return s + c + z;
    }, 0);

    const due = Math.max(0, total - paid);
    return { total, paid, due, count: rides.length };
  }, [rides]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
      <Mini label="Rides" value={totals.count} />
      <Mini label="Total" value={`$${Math.round(totals.total)}`} />
      <Mini label="Paid" value={`$${Math.round(totals.paid)}`} />
      <Mini label="Due" value={`$${Math.round(totals.due)}`} />
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div style={{
      background: "rgba(248,250,252,0.9)",
      border: "1px solid rgba(15, 23, 42, 0.06)",
      borderRadius: 14,
      padding: 10,
    }}>
      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 900 }}>{label}</div>
      <div style={{ fontSize: 14, color: "#0F172A", fontWeight: 900, marginTop: 4 }}>{value}</div>
    </div>
  );
}

const styles = {
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 14px 30px rgba(2, 6, 23, 0.06)",
  },
  statLabel: { fontSize: 12, color: "#64748B", fontWeight: 800 },
  statValue: { fontSize: 26, fontWeight: 900, color: "#0F172A", marginTop: 6 },

  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 420px) 1fr",
    gap: 12,
    alignItems: "start",
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 14px 30px rgba(2, 6, 23, 0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
    flexWrap: "wrap",
  },
  cardTitle: { fontWeight: 900, color: "#0F172A", marginBottom: 10 },

  row: {
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.25)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#1E40AF",
    background: "rgba(37, 99, 235, 0.12)",
    border: "1px solid rgba(37, 99, 235, 0.18)",
  },
  money: { fontWeight: 900, color: "#2563EB" },
  muted: { fontSize: 12, color: "#64748B" },
  smallMuted: { fontSize: 12, color: "#94A3B8", fontWeight: 700 },
  empty: {
    padding: 16,
    borderRadius: 16,
    border: "1px dashed rgba(148,163,184,0.6)",
    color: "#64748B",
    background: "rgba(248,250,252,0.7)",
  },
};  