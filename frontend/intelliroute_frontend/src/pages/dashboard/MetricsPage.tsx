import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { backendsApi } from "@/lib/api";
import { MetricsSkeleton } from "@/components/dashboard/PageSkeleton";

const card: React.CSSProperties = {
  background: "#161616",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "20px 24px",
};

interface LatencyPoint { time: string; latency: number; errors: number; }

const MetricsPage = () => {
  const { user } = useAuth();
  const { metrics, connected } = useSocket(user?.tenantId);

  const [ready, setReady] = useState(false);
  const [backends, setBackends] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("all");
  const [history, setHistory] = useState<LatencyPoint[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    backendsApi.list().then(setBackends).catch(() => {});
  }, []);

  useEffect(() => {
    const relevantMetrics = selectedId === "all"
      ? Object.values(metrics)
      : metrics[selectedId] ? [metrics[selectedId]] : [];
    if (relevantMetrics.length === 0) return;
    const allLatencies = relevantMetrics.flatMap((m) => m.latency);
    const allErrors = relevantMetrics.flatMap((m) => m.errors);
    const avgLat = allLatencies.length
      ? Math.round(allLatencies.reduce((s, v) => s + v, 0) / allLatencies.length) : 0;
    if (avgLat === 0) return;
    setHistory((prev) => {
      const now = new Date().toLocaleTimeString();
      return [...prev.slice(-29), { time: now, latency: avgLat, errors: allErrors.length }];
    });
  }, [metrics, selectedId]);

  const maxLatency = Math.max(...history.map((p) => p.latency), 1);
  const avgLatency = history.length ? Math.round(history.reduce((s, p) => s + p.latency, 0) / history.length) : 0;
  const totalErrors = history.reduce((s, p) => s + p.errors, 0);

  const summaryCards = [
    { label: "Avg Latency", value: avgLatency ? `${avgLatency}ms` : "—", icon: <Clock size={16} />, color: "#00e5b4" },
    { label: "Data Points", value: history.length.toString(), icon: <BarChart3 size={16} />, color: "#00e5b4" },
    { label: "Error Count", value: totalErrors.toString(), icon: <AlertTriangle size={16} />, color: "#ef4444" },
    { label: "Socket", value: connected ? "LIVE" : "OFF", icon: <TrendingUp size={16} />, color: connected ? "#00e5b4" : "#6b7280" },
  ];

  if (!ready) return <MetricsSkeleton />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Header + filter */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", fontFamily: "monospace", margin: 0 }}>Metrics</h1>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", fontFamily: "monospace", marginTop: "6px" }}>Performance analytics & monitoring</p>
        </div>
        <div style={{
          display: "flex", gap: "4px", padding: "4px",
          background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", flexWrap: "wrap",
        }}>
          <button
            onClick={() => { setSelectedId("all"); setHistory([]); }}
            style={{
              padding: "6px 12px", borderRadius: "6px", fontSize: "0.72rem",
              fontFamily: "monospace", border: "none", cursor: "pointer",
              background: selectedId === "all" ? "rgba(0,229,180,0.15)" : "transparent",
              color: selectedId === "all" ? "#00e5b4" : "#6b7280",
              transition: "all 0.15s",
            }}
          >all</button>
          {backends.map((b) => (
            <button
              key={b._id}
              onClick={() => { setSelectedId(b._id); setHistory([]); }}
              style={{
                padding: "6px 12px", borderRadius: "6px", fontSize: "0.72rem",
                fontFamily: "monospace", border: "none", cursor: "pointer",
                background: selectedId === b._id ? "rgba(0,229,180,0.15)" : "transparent",
                color: selectedId === b._id ? "#00e5b4" : "#6b7280",
                transition: "all 0.15s",
              }}
            >{b.name}</button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {summaryCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={card}
          >
            <div style={{ color: s.color, marginBottom: "10px" }}>{s.icon}</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff", fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.72rem", color: "#6b7280", fontFamily: "monospace", marginTop: "6px" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Latency chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ ...card, padding: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", fontFamily: "monospace" }}>Latency (ms)</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <motion.div
              animate={connected ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: connected ? "#00e5b4" : "#4b5563" }}
            />
            <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#00e5b4" }}>{connected ? "LIVE" : "—"}</span>
          </div>
        </div>
        <div style={{ position: "relative", height: "180px" }}>
          {history.length < 2 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#4b5563", fontSize: "0.8rem", fontFamily: "monospace" }}>
              {connected ? "Waiting for traffic..." : "Connecting..."}
            </div>
          ) : (
            <svg width="100%" height="100%" preserveAspectRatio="none">
              {[0, 0.25, 0.5, 0.75, 1].map((y) => (
                <line key={y} x1="0" x2="100%" y1={`${y * 100}%`} y2={`${y * 100}%`} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              <path
                d={`M 0 180 ` + history.map((p, i) => `L ${(i / (history.length - 1)) * 100}% ${180 - (p.latency / maxLatency) * 165}`).join(" ") + ` L 100% 180 Z`}
                fill="rgba(0,229,180,0.08)"
              />
              <polyline
                points={history.map((p, i) => `${(i / (history.length - 1)) * 100}%,${180 - (p.latency / maxLatency) * 165}`).join(" ")}
                fill="none" stroke="#00e5b4" strokeWidth="2"
              />
              {history.map((p, i) => (
                <circle key={i} cx={`${(i / (history.length - 1)) * 100}%`} cy={180 - (p.latency / maxLatency) * 165} r="2.5" fill="#00e5b4" />
              ))}
            </svg>
          )}
        </div>
      </motion.div>

      {/* Error bars */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ ...card, padding: "24px" }}
      >
        <div style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", fontFamily: "monospace", marginBottom: "20px" }}>Errors / Interval</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "100px" }}>
          {history.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", fontSize: "0.8rem", fontFamily: "monospace" }}>
              No data yet
            </div>
          ) : history.map((p, i) => {
            const maxErr = Math.max(...history.map((h) => h.errors), 1);
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((p.errors / maxErr) * 100, 4)}%` }}
                transition={{ duration: 0.3 }}
                title={`${p.errors} errors`}
                style={{
                  flex: 1, borderRadius: "3px 3px 0 0", cursor: "pointer",
                  background: p.errors > 3 ? "rgba(239,68,68,0.6)" : "rgba(0,229,180,0.35)",
                  minHeight: "4px",
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default MetricsPage;
