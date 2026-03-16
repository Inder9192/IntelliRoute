import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Save, Key, Globe, Bell } from "lucide-react";
import { SettingsSkeleton } from "@/components/dashboard/PageSkeleton";

const card: React.CSSProperties = {
  background: "#161616",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "24px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "40px",
  padding: "0 12px",
  background: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "monospace",
  fontSize: "0.85rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontFamily: "monospace",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: "6px",
};

const SettingsPage = () => {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [apiUrl, setApiUrl] = useState("http://localhost:3000");
  const [healthInterval, setHealthInterval] = useState("10");
  const [circuitThreshold, setCircuitThreshold] = useState("5");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return <SettingsSkeleton />;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "640px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", fontFamily: "monospace", margin: 0 }}>Settings</h1>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", fontFamily: "monospace", marginTop: "6px" }}>Configure your control panel</p>
      </div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <Key size={14} color="#00e5b4" />
          <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 600, color: "#00e5b4", textTransform: "uppercase", letterSpacing: "0.1em" }}>Account</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input value={user?.name || ""} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={user?.email || ""} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
          </div>
        </div>
      </motion.div>

      {/* Proxy config */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <Globe size={14} color="#00e5b4" />
          <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 600, color: "#00e5b4", textTransform: "uppercase", letterSpacing: "0.1em" }}>Proxy Configuration</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>API Base URL</label>
            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#00e5b4")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Health Check Interval (s)</label>
              <input
                type="number"
                value={healthInterval}
                onChange={(e) => setHealthInterval(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#00e5b4")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <div>
              <label style={labelStyle}>Circuit Breaker Threshold</label>
              <input
                type="number"
                value={circuitThreshold}
                onChange={(e) => setCircuitThreshold(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#00e5b4")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <Bell size={14} color="#00e5b4" />
          <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 600, color: "#00e5b4", textTransform: "uppercase", letterSpacing: "0.1em" }}>Alerts</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {["Circuit breaker opens", "Backend unhealthy", "AI arbitration override", "Error rate > 5%"].map((alert) => (
            <label key={alert} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "#00e5b4", width: "14px", height: "14px" }} />
              <span style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "#9ca3af" }}>{alert}</span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Save button */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,229,180,0.3)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          height: "44px", width: "160px", borderRadius: "9999px", border: "none",
          cursor: "pointer", fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 600,
          background: saved ? "rgba(0,229,180,0.2)" : "#00e5b4",
          color: saved ? "#00e5b4" : "#0d0d0d",
          outline: saved ? "1px solid rgba(0,229,180,0.4)" : "none",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <Save size={14} />
        {saved ? "Saved ✓" : "Save Settings"}
      </motion.button>
    </div>
  );
};

export default SettingsPage;
