import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const initialBackends = [
  { name: "us-east-1a", latency: 42, weight: 35, errors: 0, active: 12, isolated: false },
  { name: "us-east-1b", latency: 67, weight: 28, errors: 1, active: 8, isolated: false },
  { name: "eu-west-1a", latency: 124, weight: 22, errors: 0, active: 15, isolated: false },
  { name: "ap-south-1a", latency: 198, weight: 15, errors: 4, active: 3, isolated: false },
];

const MetricsPreview = () => {
  const [backends, setBackends] = useState(initialBackends);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setBackends((prev) =>
        prev.map((b) => ({
          ...b,
          latency: Math.max(10, b.latency + Math.floor(Math.random() * 30 - 15)),
          active: Math.max(0, b.active + Math.floor(Math.random() * 6 - 3)),
          errors: Math.random() > 0.92 ? b.errors + 1 : b.errors,
          isolated: b.errors >= 5,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Recalculate weights
  const totalScore = backends
    .filter((b) => !b.isolated)
    .reduce((sum, b) => sum + Math.max(0, 100 - b.latency * 0.2 - b.errors * 10 - b.active * 2), 0);

  return (
    <section id="metrics" className="py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Dashboard</span>
          <h2 className="text-3xl md:text-5xl font-mono font-bold mt-4 text-foreground">
            Live <span className="text-gradient-primary">metrics</span> preview
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
            Real-time backend health scores, latency tracking, and routing weights — updated via Socket.IO.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border/30 bg-muted/20">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-primary/40" />
            <div className="w-3 h-3 rounded-full bg-secondary/40" />
            <span className="ml-3 text-xs font-mono text-muted-foreground">
              intelliroute://metrics — tick #{tick}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-border/20 text-muted-foreground text-xs">
                  <th className="text-left py-3 px-5 font-medium">BACKEND</th>
                  <th className="text-right py-3 px-5 font-medium">LATENCY</th>
                  <th className="text-right py-3 px-5 font-medium">ACTIVE</th>
                  <th className="text-right py-3 px-5 font-medium">ERRORS</th>
                  <th className="text-right py-3 px-5 font-medium">WEIGHT</th>
                  <th className="text-right py-3 px-5 font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {backends.map((b) => {
                  const score = Math.max(0, 100 - b.latency * 0.2 - b.errors * 10 - b.active * 2);
                  const weight = b.isolated ? 0 : totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;

                  return (
                    <tr
                      key={b.name}
                      className={`border-b border-border/10 transition-colors ${b.isolated ? "opacity-40" : "hover:bg-muted/10"}`}
                    >
                      <td className="py-3 px-5 text-foreground">{b.name}</td>
                      <td className={`py-3 px-5 text-right ${b.latency > 150 ? "text-destructive" : b.latency > 80 ? "text-primary" : "text-secondary"}`}>
                        {b.latency}ms
                      </td>
                      <td className="py-3 px-5 text-right text-muted-foreground">{b.active}</td>
                      <td className={`py-3 px-5 text-right ${b.errors > 3 ? "text-destructive" : "text-muted-foreground"}`}>
                        {b.errors}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-700"
                              style={{ width: `${weight}%` }}
                            />
                          </div>
                          <span className="text-primary w-8 text-right">{weight}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-right">
                        {b.isolated ? (
                          <span className="text-destructive text-xs">🔴 ISOLATED</span>
                        ) : (
                          <span className="text-secondary text-xs">● HEALTHY</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-border/20 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Socket.IO broadcast: 5s interval</span>
            <span className="text-primary">AI arbitration: {tick % 3 === 0 ? "active" : "standby"}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsPreview;
