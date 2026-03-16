import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, LayoutDashboard, Server, BarChart3, Settings, LogOut, Activity, Shield } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/backends", icon: Server, label: "Backends" },
  { to: "/dashboard/metrics", icon: BarChart3, label: "Metrics" },
  { to: "/dashboard/routing", icon: Activity, label: "Routing" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [logoutHover, setLogoutHover] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside style={{
      width: "256px",
      minWidth: "256px",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#111111",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        textDecoration: "none",
        flexShrink: 0,
      }}>
        <Zap size={18} color="#00e5b4" />
        <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.95rem", color: "#fff", letterSpacing: "-0.01em" }}>
          Intelli<span style={{ color: "#00e5b4" }}>Route</span>
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            onMouseEnter={() => setHoveredItem(to)}
            onMouseLeave={() => setHoveredItem(null)}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#00e5b4" : hoveredItem === to ? "#fff" : "#6b7280",
              background: isActive
                ? "rgba(0,229,180,0.08)"
                : hoveredItem === to
                ? "rgba(255,255,255,0.04)"
                : "transparent",
              border: isActive ? "1px solid rgba(0,229,180,0.15)" : "1px solid transparent",
              transition: "all 0.15s ease",
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{
        padding: "12px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", marginBottom: "4px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(0,229,180,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Shield size={14} color="#00e5b4" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "#fff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || "Operator"}
            </div>
            <div style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            width: "100%", padding: "10px 12px", borderRadius: "8px",
            border: "none", cursor: "pointer", fontFamily: "monospace",
            fontSize: "0.875rem",
            background: logoutHover ? "rgba(239,68,68,0.08)" : "transparent",
            color: logoutHover ? "#ef4444" : "#6b7280",
            transition: "all 0.15s ease",
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
