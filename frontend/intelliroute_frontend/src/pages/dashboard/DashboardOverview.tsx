import { motion } from "framer-motion";
import { Activity, Server, Zap, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { backendsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { OverviewSkeleton } from "@/components/dashboard/PageSkeleton";

const card: React.CSSProperties = {
  background: "#161616",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "20px 24px",
};

const DashboardOverview = () => {
  const { user } = useAuth();
  const { metrics, connected } = useSocket(user?.tenantId);

  const [ready, setReady] = useState(false);
  const [backends, setBackends] = useState<any[]>([]);
  const [liveLatency, setLiveLatency] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    backendsApi.list().then(setBackends).catch(() => {});
  }, []);

  const backendMetricsList = Object.values(metrics);

  const avgLatency = (() => {
    const all: number[] = backendMetricsList.flatMap((m) => m.latency);
    return all.length ? Math.round(all.reduce((s, v) => s + v, 0) / all.length) : 0;
  })();

  const totalErrors = backendMetricsList.reduce((s, m) => s + m.errors.length, 0);
  const totalActive = backendMetricsList.reduce((s, m) => s + m.active, 0);
  const isolatedCount = backendMetricsList.filter((m) => m.isIsolated).length;

  useEffect(() => {
    if (avgLatency === 0) return;
    setLiveLatency((prev) => {
      const now = new Date().toLocaleTimeString();
      return [...prev.slice(-19), { time: now, value: avgLatency }];
    });
  }, [avgLatency]);

  const maxLatency = Math.max(...liveLatency.map((r) => r.value), 1);

  const stats = [
    {
      label: "Active Backends",
      value: backends.length.toString(),
      sub: `${isolatedCount} isolated`,
      good: isolatedCount === 0,
      icon: <Server size={18} />,
    },
    {
      label: "Avg Latency",
      value: avgLatency ? `${avgLatency}ms` : "—",
      sub: connected ? "live" : "connecting...",
      good: avgLatency < 100,
      icon: <Zap size={18} />,
    },
    {
      label: "Active Connections",
      value: totalActive.toString(),
      sub: "across all backends",
      good: true,
      icon: <Activity size={18} />,
    },
    {
      label: "Error Count",
      value: totalErrors.toString(),
      sub: "in current window",
      good: totalErrors === 0,
      icon: <AlertTriangle size={18} />,
    },
  ];

  if (!ready) return <OverviewSkeleton />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", fontFamily: "monospace", margin: 0 }}>
            Control Panel
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", fontFamily: "monospace", marginTop: "4px" }}>
            Real-time cluster overview
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <motion.div
            animate={connected ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: connected ? "#00e5b4" : "#4b5563",
            }}
          />
          <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: connected ? "#00e5b4" : "#4b5563" }}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={card}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ color: "#6b7280" }}>{stat.icon}</span>
              <span style={{
                fontSize: "0.7rem", fontFamily: "monospace",
                color: stat.good ? "#00e5b4" : "#ef4444",
              }}>
                {stat.sub}
              </span>
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", fontFamily: "monospace", lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#6b7280", fontFamily: "monospace", marginTop: "6px" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live latency chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ ...card, padding: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", fontFamily: "monospace" }}>
              Live Avg Latency
            </div>
            <div style={{ fontSize: "0.72rem", color: "#6b7280", fontFamily: "monospace", marginTop: "2px" }}>
              ms across all backends
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <motion.div
              animate={connected ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: connected ? "#00e5b4" : "#4b5563" }}
            />
            <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#00e5b4" }}>
              {connected ? "LIVE" : "—"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "140px" }}>
          {liveLatency.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", fontSize: "0.8rem", fontFamily: "monospace" }}>
              {connected ? "Waiting for traffic..." : "Connecting to live feed..."}
            </div>
          ) : liveLatency.map((r, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(r.value / maxLatency) * 100}%` }}
              transition={{ duration: 0.4 }}
              style={{
                flex: 1,
                background: "rgba(0,229,180,0.15)",
                borderRadius: "3px 3px 0 0",
                position: "relative",
                cursor: "pointer",
                minHeight: "4px",
              }}
              title={`${r.value}ms at ${r.time}`}
            >
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "35%", background: "rgba(0,229,180,0.4)",
                borderRadius: "3px 3px 0 0",
              }} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Backend status table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{ ...card, padding: 0, overflow: "hidden" }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", fontFamily: "monospace" }}>
            Backend Status
          </span>
        </div>

        {backends.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center", color: "#4b5563", fontSize: "0.8rem", fontFamily: "monospace" }}>
            No backends registered yet
          </div>
        ) : (
          backends.map((b, i) => {
            const m = metrics[b._id] || { latency: [], errors: [], active: 0, isIsolated: false };
            const lat = m.latency.length
              ? Math.round(m.latency.reduce((s: number, v: number) => s + v, 0) / m.latency.length)
              : null;
            return (
              <div
                key={b._id}
                style={{
                  padding: "14px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  borderBottom: i < backends.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  backgroundColor: m.isIsolated ? "#ef4444" : "#00e5b4",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "#fff", fontWeight: 500 }}>{b.name}</div>
                  <div style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#6b7280", marginTop: "1px" }}>{b.url}</div>
                </div>
                <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#9ca3af" }}>
                  {lat !== null ? `${lat}ms` : "no traffic"}
                </span>
                <span style={{
                  fontSize: "0.7rem", fontFamily: "monospace", fontWeight: 600,
                  color: m.isIsolated ? "#ef4444" : "#00e5b4",
                  background: m.isIsolated ? "rgba(239,68,68,0.1)" : "rgba(0,229,180,0.1)",
                  padding: "2px 8px", borderRadius: "9999px",
                }}>
                  {m.isIsolated ? "ISOLATED" : "OK"}
                </span>
              </div>
            );
          })
        )}
      </motion.div>

    </div>
  );
};

export default DashboardOverview;
