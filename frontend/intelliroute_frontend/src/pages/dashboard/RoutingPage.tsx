import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [decisions, setDecisions] = useState<RoutingDecision[]>([]);
  const [aiActive, setAiActive] = useState(true);

  useEffect(() => {
    const backendPool = ["us-east-1a", "us-east-1b", "eu-west-1a", "ap-south-1a"];
    const reasons = [
      "Lowest latency + highest score",
      "AI overrode: predicted latency spike on primary",
      "Weighted random selection within top tier",
      "Circuit breaker isolated ap-south-1a, next best selected",
      "AI detected anomalous error pattern, rerouted",
    ];

    const seed: RoutingDecision[] = Array.from({ length: 8 }, (_, i) => {
      const scores = backendPool.map((b) => ({ backend: b, score: Math.floor(Math.random() * 60 + 40) }));
      scores.sort((a, b) => b.score - a.score);
      const aiOverride = Math.random() > 0.7;
      return {
        id: i,
        timestamp: new Date(Date.now() - i * 5000).toLocaleTimeString(),
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        selected: aiOverride ? scores[1].backend : scores[0].backend,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        aiOverride,
        scores,
      };
    });
    setDecisions(seed);

    const interval = setInterval(() => {
      const scores = backendPool.map((b) => ({ backend: b, score: Math.floor(Math.random() * 60 + 40) }));
      scores.sort((a, b) => b.score - a.score);
      const aiOverride = aiActive && Math.random() > 0.6;
      const newDecision: RoutingDecision = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        selected: aiOverride ? scores[1].backend : scores[0].backend,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        aiOverride,
        scores,
      };
      setDecisions((prev) => [newDecision, ...prev.slice(0, 14)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [aiActive]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Routing Decisions</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">AI arbitration & scoring engine</p>
        </div>
        <Button
          variant={aiActive ? "hero" : "heroOutline"}
          size="sm"
          onClick={() => setAiActive(!aiActive)}
        >
          <Brain className="w-4 h-4" />
          AI {aiActive ? "Active" : "Standby"}
        </Button>
      </div>

      {/* Scoring formula */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-primary/20 bg-primary/5 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono font-semibold text-primary">Scoring Formula</span>
        </div>
        <code className="text-sm font-mono text-foreground/80">
          score = 100 - (latency × 0.2) - (errors × 10) - (activeConn × 2)
        </code>
        <p className="text-xs text-muted-foreground mt-2 font-mono">
          Weight = (backend_score / Σ healthy_scores) × 100 → AWS Bedrock AI can override based on predicted patterns
        </p>
      </motion.div>

      {/* Decisions list */}
      <div className="space-y-3">
        {decisions.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`rounded-xl border bg-card/50 p-4 ${
              d.aiOverride ? "border-accent/30" : "border-border/30"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground">{d.timestamp}</span>
                <span className="text-xs font-mono text-muted-foreground/50">{d.source}</span>
                {d.aiOverride && (
                  <span className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                    <Brain className="w-3 h-3" />
                    AI Override
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-mono font-semibold text-primary">{d.selected}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              {d.scores.map((s) => (
                <div
                  key={s.backend}
                  className={`flex-1 rounded-lg p-2 text-center ${
                    s.backend === d.selected
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted/20"
                  }`}
                >
                  <div className="text-xs font-mono text-muted-foreground">{s.backend}</div>
                  <div className={`text-sm font-mono font-bold ${
                    s.backend === d.selected ? "text-primary" : "text-foreground/60"
                  }`}>
                    {s.score}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs font-mono text-muted-foreground">{d.reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoutingPage;
