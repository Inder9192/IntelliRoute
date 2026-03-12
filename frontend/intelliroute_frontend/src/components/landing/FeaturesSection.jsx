import { motion } from "framer-motion";
import { Brain, Shield, Activity, Users, BarChart3, Workflow } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Arbitration",
    description: "When backend scores are too close to call, AWS Bedrock steps in to make intelligent routing decisions with bounded weight adjustments.",
    accent: "primary",
  },
  {
    icon: Shield,
    title: "Circuit Breaker",
    description: "Automatic isolation of failing backends after error threshold. Self-healing pattern protects your traffic from cascading failures.",
    accent: "destructive",
  },
  {
    icon: Activity,
    title: "Real-time Scoring",
    description: "Sliding window latency tracking, active connection counts, and error rates feed into a dynamic scoring engine per backend.",
    accent: "secondary",
  },
  {
    icon: Users,
    title: "Multi-Tenant",
    description: "Full tenant isolation with per-company backend pools, independent metrics, and scoped authentication via JWT.",
    accent: "accent",
  },
  {
    icon: BarChart3,
    title: "Live Metrics",
    description: "Socket.IO powered real-time dashboard broadcasting latency, error rates, and routing decisions every 5 seconds.",
    accent: "primary",
  },
  {
    icon: Workflow,
    title: "Weighted Routing",
    description: "Probabilistic backend selection based on normalized health scores. Traffic naturally flows to your healthiest servers.",
    accent: "secondary",
  },
];

const accentClasses = {
  primary: "text-primary border-primary/20 bg-primary/5",
  secondary: "text-secondary border-secondary/20 bg-secondary/5",
  accent: "text-accent border-accent/20 bg-accent/5",
  destructive: "text-destructive border-destructive/20 bg-destructive/5",
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Capabilities</span>
          <h2 className="text-3xl md:text-5xl font-mono font-bold mt-4 text-foreground">
            Engineered for <span className="text-gradient-primary">resilience</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every component designed to keep your traffic flowing, even when things go wrong.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group p-6 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:bg-card/60"
            >
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${accentClasses[feature.accent]}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
