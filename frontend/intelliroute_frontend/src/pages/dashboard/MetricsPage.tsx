import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react";

interface MetricPoint {
  time: string;
  latency: number;
  requests: number;
  errors: number;
}

const MetricsPage = () => {
  const [points, setPoints] = useState<MetricPoint[]>([]);
  const [selectedBackend, setSelectedBackend] = useState("all");

  const backends = ["all", "us-east-1a", "us-east-1b", "eu-west-1a", "ap-south-1a"];

  useEffect(() => {
    // Seed
    const seed: MetricPoint[] = Array.from({ length: 30 }, (_, i) => ({
      time: `${i}s`,
      latency: Math.floor(Math.random() * 80 + 30),
      requests: Math.floor(Math.random() * 400 + 600),
      errors: Math.floor(Math.random() * 5),
    }));
    setPoints(seed);

    const interval = setInterval(() => {
      setPoints((prev) => {
        const newPoint: MetricPoint = {
          time: `${prev.length}s`,
          latency: Math.floor(Math.random() * 80 + 30),
          requests: Math.floor(Math.random() * 400 + 600),
          errors: Math.floor(Math.random() * 5),
        };
        return [...prev.slice(-29), newPoint];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedBackend]);

  const maxLatency = Math.max(...points.map((p) => p.latency), 1);
  const maxRequests = Math.max(...points.map((p) => p.requests), 1);
  const avgLatency = points.length ? Math.round(points.reduce((s, p) => s + p.latency, 0) / points.length) : 0;
  const totalErrors = points.reduce((s, p) => s + p.errors, 0);
  const totalRequests = points.reduce((s, p) => s + p.requests, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Metrics</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Performance analytics & monitoring</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-muted/30 border border-border/20">
          {backends.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBackend(b)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                selectedBackend === b
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Latency", value: `${avgLatency}ms`, icon: <Clock className="w-4 h-4" />, color: "text-primary" },
          { label: "Total Requests", value: totalRequests.toLocaleString(), icon: <BarChart3 className="w-4 h-4" />, color: "text-secondary" },
          { label: "Error Count", value: totalErrors.toString(), icon: <AlertTriangle className="w-4 h-4" />, color: "text-destructive" },
          { label: "Throughput", value: `${Math.round(totalRequests / 30)}/s`, icon: <TrendingUp className="w-4 h-4" />, color: "text-accent" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl border border-border/30 bg-card/50"
          >
            <div className={`mb-2 ${s.color}`}>{s.icon}</div>
            <div className="text-xl font-mono font-bold text-foreground">{s.value}</div>
            <div className="text-xs font-mono text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Latency chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border/30 bg-card/50 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono font-semibold text-foreground">Latency (ms)</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary">LIVE</span>
          </div>
        </div>
        <div className="relative h-48">
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((y) => (
              <line key={y} x1="0" x2="100%" y1={`${y * 100}%`} y2={`${y * 100}%`} stroke="hsl(var(--border))" strokeWidth="0.5" strokeOpacity="0.3" />
            ))}
            {/* Area */}
            <path
              d={
                `M 0 ${192} ` +
                points.map((p, i) => `L ${(i / (points.length - 1)) * 100}% ${192 - (p.latency / maxLatency) * 180}`).join(" ") +
                ` L 100% ${192} Z`
              }
              fill="hsl(var(--primary) / 0.1)"
            />
            {/* Line */}
            <polyline
              points={points.map((p, i) => `${(i / (points.length - 1)) * 100}%,${192 - (p.latency / maxLatency) * 180}`).join(" ")}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            {/* Dots */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={`${(i / (points.length - 1)) * 100}%`}
                cy={192 - (p.latency / maxLatency) * 180}
                r="2"
                fill="hsl(var(--primary))"
              />
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Requests chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border/30 bg-card/50 p-6"
      >
        <h2 className="text-lg font-mono font-semibold text-foreground mb-4">Requests / Interval</h2>
        <div className="flex items-end gap-1 h-32">
          {points.map((p, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm relative group cursor-pointer"
              style={{
                height: `${(p.requests / maxRequests) * 100}%`,
                background: p.errors > 3
                  ? "hsl(var(--destructive) / 0.6)"
                  : "hsl(var(--secondary) / 0.4)",
              }}
              initial={{ height: 0 }}
              animate={{ height: `${(p.requests / maxRequests) * 100}%` }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border/30 px-2 py-1 rounded text-xs font-mono text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {p.requests} req / {p.errors} err
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MetricsPage;
