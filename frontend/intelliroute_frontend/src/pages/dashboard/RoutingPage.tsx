import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowRight, GitBranch } from "lucide-react";
import { backendsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { RoutingSkeleton } from "@/components/dashboard/PageSkeleton";

const card: React.CSSProperties = {
  background: "#161616",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "20px 24px",
};

const RoutingPage = () => {
  const { user } = useAuth();
  const { metrics, connected, routingLog } = useSocket(user?.tenantId);

  const [ready, setReady] = useState(false);
  const [backends, setBackends] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    backendsApi.list().then(setBackends).catch(() => {});
  }, []);

  if (!ready) return <RoutingSkeleton />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", fontFamily: "monospace", margin: 0 }}>Routing Decisions</h1>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", fontFamily: "monospace", marginTop: "6px" }}>Real-time routing from scoring & AI engine</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <motion.div
            animate={connected ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: connected ? "#00e5b4" : "#4b5563" }}
          />
          <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: connected ? "#00e5b4" : "#4b5563" }}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Backend score snapshot */}
      {backends.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={card}>
          <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#6b7280", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Current Backend Scores
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {backends.map((b) => {
              const m = metrics[b._id] || { latency: [], consecutiveErrors: 0, active: 0, isIsolated: false };
              const avgLat = m.latency.length
                ? m.latency.reduce((s: number, v: number) => s + v, 0) / m.latency.length : 0;
              const score = Math.max(0, Math.round(100 - avgLat * 0.2 - m.active * 2));
              return (
                <div key={b._id} style={{
                  flex: 1, minWidth: "120px", borderRadius: "10px", padding: "14px", textAlign: "center",
                  background: m.isIsolated ? "rgba(239,68,68,0.05)" : "rgba(0,229,180,0.05)",
                  border: m.isIsolated ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(0,229,180,0.15)",
                }}>
                  <div style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#6b7280", marginBottom: "6px" }}>{b.name}</div>
                  <div style={{ fontSize: "1.4rem", fontFamily: "monospace", fontWeight: 700, color: m.isIsolated ? "#ef4444" : "#00e5b4" }}>
                    {m.isIsolated ? "—" : score}
                  </div>
                  <div style={{ fontSize: "0.65rem", fontFamily: "monospace", color: m.isIsolated ? "#ef4444" : "#4b5563", marginTop: "4px" }}>
                    {m.isIsolated ? "ISOLATED" : `${m.active} active`}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Routing log */}
      {backends.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "64px 24px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", gap: "12px",
          }}
        >
          <GitBranch size={36} color="#374151" />
          <p style={{ fontSize: "0.9rem", fontFamily: "monospace", color: "#4b5563", margin: 0 }}>No backends registered yet</p>
          <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#374151", margin: 0, textAlign: "center" }}>
            Add backends and send traffic through the proxy to see routing decisions here
          </p>
        </motion.div>
      ) : routingLog.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "64px 24px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", gap: "12px",
          }}
        >
          <Brain size={36} color="#374151" />
          <p style={{ fontSize: "0.9rem", fontFamily: "monospace", color: "#4b5563", margin: 0 }}>
            {connected ? "Waiting for traffic..." : "Connecting..."}
          </p>
          <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#374151", margin: 0 }}>
            Send requests through the proxy to see live routing decisions
          </p>
        </motion.div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {routingLog.map((entry, i) => (
            <motion.div
              key={entry.requestId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                ...card,
                border: entry.status === "error"
                  ? "1px solid rgba(239,68,68,0.2)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                {/* Left: status + method + path */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                    backgroundColor: entry.status === "success" ? "#00e5b4" : entry.status === "error" ? "#ef4444" : "#f59e0b",
                  }} />
                  <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#6b7280" }}>
                    {entry.method}
                  </span>
                  <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#9ca3af" }}>
                    {entry.path}
                  </span>
                </div>

                {/* Right: arrow + backend + latency + time */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <ArrowRight size={12} color="#4b5563" />
                  <span style={{ fontSize: "0.85rem", fontFamily: "monospace", fontWeight: 700, color: "#00e5b4" }}>
                    {entry.backendName}
                  </span>
                  {entry.latency !== undefined && (
                    <span style={{
                      fontSize: "0.72rem", fontFamily: "monospace",
                      color: entry.latency < 100 ? "#00e5b4" : entry.latency < 300 ? "#f59e0b" : "#ef4444",
                      background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "9999px",
                    }}>
                      {entry.latency}ms
                    </span>
                  )}
                  <span style={{ fontSize: "0.68rem", fontFamily: "monospace", color: "#4b5563" }}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Backend URL */}
              <div style={{ marginTop: "8px", fontSize: "0.7rem", fontFamily: "monospace", color: "#4b5563" }}>
                → {entry.backendUrl}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutingPage;
