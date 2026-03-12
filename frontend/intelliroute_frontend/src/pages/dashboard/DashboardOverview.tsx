import { motion } from "framer-motion";
import { Activity, Server, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useEffect } from "react";

interface StatCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ReactNode;
}

const mockStats: StatCard[] = [
  { label: "Total Requests", value: "1.2M", change: "+12.5%", up: true, icon: <Activity className="w-5 h-5" /> },
  { label: "Active Backends", value: "4", change: "0", up: true, icon: <Server className="w-5 h-5" /> },
  { label: "Avg Latency", value: "47ms", change: "-8.2%", up: true, icon: <Zap className="w-5 h-5" /> },
  { label: "Error Rate", value: "0.03%", change: "+0.01%", up: false, icon: <AlertTriangle className="w-5 h-5" /> },
];

const DashboardOverview = () => {
  const [liveRequests, setLiveRequests] = useState<{ time: string; count: number }[]>([]);

  useEffect(() => {
    // Simulate live data
    const interval = setInterval(() => {
      setLiveRequests((prev) => {
        const now = new Date().toLocaleTimeString();
        const newEntry = { time: now, count: Math.floor(Math.random() * 500 + 800) };
        return [...prev.slice(-19), newEntry];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxCount = Math.max(...liveRequests.map((r) => r.count), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-mono font-bold text-foreground">Control Plane</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Real-time cluster overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground">{stat.icon}</span>
              <span className={`flex items-center gap-1 text-xs font-mono ${stat.up ? "text-secondary" : "text-destructive"}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-mono font-bold text-foreground">{stat.value}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Live throughput chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-mono font-semibold text-foreground">Live Throughput</h2>
            <p className="text-xs text-muted-foreground font-mono">Requests per interval</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary">LIVE</span>
          </div>
        </div>

        <div className="flex items-end gap-1 h-40">
          {liveRequests.map((r, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-primary/20 rounded-t-sm relative group cursor-pointer"
              style={{ height: `${(r.count / maxCount) * 100}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${(r.count / maxCount) * 100}%` }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-x-0 bottom-0 bg-primary/60 rounded-t-sm" style={{ height: "30%" }} />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border/30 px-2 py-1 rounded text-xs font-mono text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {r.count} req
              </div>
            </motion.div>
          ))}
          {liveRequests.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm font-mono">
              Collecting data...
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border/20">
          <h2 className="text-lg font-mono font-semibold text-foreground">Recent Events</h2>
        </div>
        <div className="divide-y divide-border/10">
          {[
            { time: "2s ago", event: "AI arbitration triggered", detail: "Rebalanced us-east-1a weight: 35% → 38%", type: "info" },
            { time: "15s ago", event: "Health check passed", detail: "eu-west-1a responded in 124ms", type: "success" },
            { time: "1m ago", event: "Circuit breaker reset", detail: "ap-south-1a back to CLOSED state", type: "warning" },
            { time: "3m ago", event: "New backend registered", detail: "us-west-2a added to rotation", type: "info" },
            { time: "5m ago", event: "Error threshold exceeded", detail: "ap-south-1a errors: 4 → 5, circuit OPEN", type: "error" },
          ].map((e, i) => (
            <div key={i} className="px-6 py-3 flex items-center gap-4 hover:bg-muted/10 transition-colors">
              <div className={`w-2 h-2 rounded-full ${
                e.type === "success" ? "bg-secondary" :
                e.type === "warning" ? "bg-primary" :
                e.type === "error" ? "bg-destructive" : "bg-accent"
              }`} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-mono text-foreground">{e.event}</span>
                <p className="text-xs text-muted-foreground truncate">{e.detail}</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{e.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
