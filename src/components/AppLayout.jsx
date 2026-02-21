import React from "react";

export default function AppLayout({ title = "Dashboard", children, onLogout, user }) {
  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>Ridex</div>

        <nav style={styles.nav}>
          <div style={{ ...styles.navItem, ...styles.navItemActive }}>Dashboard</div>
          <div style={styles.navItem}>Riders</div>
          <div style={styles.navItem}>Rides</div>
          <div style={styles.navItem}>Payments</div>
          <div style={styles.navItem}>Settings</div>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>{(user?.displayName?.[0] || "R").toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <div style={styles.userName}>{user?.displayName || "User"}</div>
              <div style={styles.userEmail}>{user?.email || ""}</div>
            </div>
          </div>

          <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Top bar */}
        <div style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <div style={styles.pageTitle}>{title}</div>
            <div style={styles.pageSub}>Track rides & payments in one place</div>
          </div>

          <div style={styles.topbarRight}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>⌕</span>
              <input style={styles.search} placeholder="Search Rider..." />
            </div>

            <button style={styles.primaryBtn}>+ Add Ride</button>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background: "#F6F7FB",
  },

  sidebar: {
    background: "#FFFFFF",
    borderRight: "1px solid rgba(15, 23, 42, 0.08)",
    padding: 18,
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gap: 16,
  },
  brand: {
    fontWeight: 900,
    fontSize: 20,
    letterSpacing: 0.2,
    color: "#0F172A",
  },
  nav: { display: "grid", gap: 8 },
  navItem: {
    padding: "10px 12px",
    borderRadius: 12,
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
  },
  navItemActive: {
    background: "rgba(37, 99, 235, 0.10)",
    color: "#1D4ED8",
    border: "1px solid rgba(37, 99, 235, 0.15)",
  },

  sidebarFooter: {
    display: "grid",
    gap: 12,
    paddingTop: 12,
    borderTop: "1px solid rgba(15, 23, 42, 0.06)",
  },
  userRow: { display: "flex", gap: 10, alignItems: "center" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#1E40AF",
    background: "rgba(37, 99, 235, 0.12)",
    border: "1px solid rgba(37, 99, 235, 0.18)",
    flex: "0 0 auto",
  },
  userName: { fontWeight: 800, color: "#0F172A", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userEmail: { fontSize: 12, color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  logoutBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239, 68, 68, 0.25)",
    background: "rgba(239, 68, 68, 0.08)",
    color: "#B91C1C",
    fontWeight: 800,
    cursor: "pointer",
  },

  main: { padding: 18 },
  topbar: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: 18,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    boxShadow: "0 14px 30px rgba(2, 6, 23, 0.06)",
  },
  topbarLeft: { display: "grid", gap: 2 },
  pageTitle: { fontSize: 18, fontWeight: 900, color: "#0F172A" },
  pageSub: { fontSize: 12, color: "#64748B", fontWeight: 600 },

  topbarRight: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid rgba(15, 23, 42, 0.10)",
    borderRadius: 14,
    padding: "10px 12px",
    background: "#FFFFFF",
  },
  searchIcon: { color: "#94A3B8", fontWeight: 900 },
  search: {
    border: "none",
    outline: "none",
    width: 220,
    fontSize: 13,
  },

  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(15, 23, 42, 0.10)",
    background: "#0F172A",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
  },

  content: { marginTop: 14 },
};
