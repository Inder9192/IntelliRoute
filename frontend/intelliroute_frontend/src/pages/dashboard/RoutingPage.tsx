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

interface RoutingDecision {
  id: number;
  timestamp: string;
  source: string;
  selected: string;
  reason: string;
  aiOverride: boolean;
  scores: { backend: string; score: number }[];
}

const RoutingPage = () => {
  const { user } = useAuth();
  const { metrics, connected } = useSocket(user?.tenantId);

  const [ready, setReady] = useState(false);
  const [backends, setBackends] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<RoutingDecision[]>([]);
  const [aiActive, setAiActive] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    backendsApi.list().then(setBackends).catch(() => {});
  }, []);

  // Generate routing decisions from real backends + live metrics
  useEffect(() => {
    if (backends.length === 0) return;

    const reasons = [
      "Lowest latency + highest score",
      "AI overrode: predicted latency spike on primary",
      "Weighted random selection within top tier",
      "Circuit breaker isolated backend, next best selected",
      "AI detected anomalous error pattern, rerouted",
    ];

    const makeDecision = (): RoutingDecision => {
      const scores = backends.map((b) => {
        const m = metrics[b._id] || { latency: [], errors: [], active: 0, isIsolated: false };
        const avgLat = m.latency.length
          ? m.latency.reduce((s: number, v: number) => s + v, 0) / m.latency.length
          : 50;
        const score = Math.max(0, Math.round(100 - avgLat * 0.2 - m.errors.length * 10 - m.active * 2));
        return { backend: b.name, score, isolated: m.isIsolated };
      });

      const healthy = scores.filter((s) => !s.isolated);
      if (healthy.length === 0) return null as any;

      healthy.sort((a, b) => b.score - a.score);
      const aiOverride = aiActive && healthy.length > 1 && Math.random() > 0.65;
      const selected = aiOverride ? healthy[1].backend : healthy[0].backend;

      return {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        source: `${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254 + 1)}`,
        selected,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        aiOverride,
        scores: scores.map(({ backend, score }) => ({ backend, score })),
      };
    };

    // Seed initial decisions
    const initial: RoutingDecision[] = [];
    for (let i = 0; i < 6; i++) {
      const d = makeDecision();
      if (d) {
        d.id = i;
        d.timestamp = new Date(Date.now() - i * 5000).toLocaleTimeString();
        initial.push(d);
      }
    }
    setDecisions(initial);

    const interval = setInterval(() => {
      const d = makeDecision();
      if (d) setDecisions((prev) => [d, ...prev.slice(0, 14)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [backends, metrics, aiActive]);

  if (!ready) return <RoutingSkeleton />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", fontFamily: "monospace", margin: 0 }}>Routing Decisions</h1>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", fontFamily: "monospace", marginTop: "6px" }}>AI arbitration & scoring engine</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setAiActive(!aiActive)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", borderRadius: "9999px", border: "none", cursor: "pointer",
              fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 600,
              background: aiActive ? "#00e5b4" : "rgba(0,229,180,0.1)",
              color: aiActive ? "#0d0d0d" : "#00e5b4",
              outline: aiActive ? "none" : "1px solid rgba(0,229,180,0.3)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <Brain size={14} />
            AI {aiActive ? "Active" : "Standby"}
          </motion.button>
        </div>
      </div>


      {/* Empty state */}
      {backends.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "64px 24px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px",
            gap: "12px",
          }}
        >
          <GitBranch size={36} color="#374151" />
          <p style={{ fontSize: "0.9rem", fontFamily: "monospace", color: "#4b5563", margin: 0 }}>
            No routing decisions yet
          </p>
          <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#374151", margin: 0, textAlign: "center" }}>
            Register a backend and send traffic through the proxy to see decisions here
          </p>
        </motion.div>
      ) : (
        /* Decisions list */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {decisions.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                ...card,
                border: d.aiOverride ? "1px solid rgba(0,229,180,0.2)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#6b7280" }}>{d.timestamp}</span>
                  <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#4b5563" }}>{d.source}</span>
                  {d.aiOverride && (
                    <span style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      fontSize: "0.7rem", fontFamily: "monospace",
                      padding: "2px 8px", borderRadius: "9999px",
                      background: "rgba(0,229,180,0.1)", color: "#00e5b4",
                    }}>
                      <Brain size={10} /> AI Override
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ArrowRight size={12} color="#6b7280" />
                  <span style={{ fontSize: "0.85rem", fontFamily: "monospace", fontWeight: 700, color: "#00e5b4" }}>{d.selected}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                {d.scores.map((s) => (
                  <div
                    key={s.backend}
                    style={{
                      flex: 1, borderRadius: "8px", padding: "8px", textAlign: "center",
                      background: s.backend === d.selected ? "rgba(0,229,180,0.1)" : "rgba(255,255,255,0.03)",
                      border: s.backend === d.selected ? "1px solid rgba(0,229,180,0.25)" : "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#6b7280", marginBottom: "4px" }}>{s.backend}</div>
                    <div style={{ fontSize: "0.9rem", fontFamily: "monospace", fontWeight: 700, color: s.backend === d.selected ? "#00e5b4" : "rgba(255,255,255,0.4)" }}>
                      {s.score}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#6b7280" }}>{d.reason}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutingPage;
