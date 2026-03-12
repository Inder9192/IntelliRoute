import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Request Ingress",
    desc: "JWT-authenticated requests hit the proxy with tenant context extracted from the token.",
    code: "const tenantId = req.user.tenantId;",
  },
  {
    num: "02",
    title: "Score Calculation",
    desc: "Each backend gets a health score based on latency, errors, and active connections.",
    code: "score = 100 - (avgLatency × 0.2) - (errors × 10) - (active × 2)",
  },
  {
    num: "03",
    title: "AI Arbitration",
    desc: "When scores are within 5% of each other, Bedrock analyzes metrics and adjusts weights.",
    code: 'if (weightsAreClose(plan)) → askBedrock(context)',
  },
  {
    num: "04",
    title: "Weighted Selection",
    desc: "Backend is selected probabilistically based on final normalized weights summing to 100.",
    code: "cumulative += entry.weight; if (rand <= cumulative) → route",
  },
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase">How it works</span>
          <h2 className="text-3xl md:text-5xl font-mono font-bold mt-4 text-foreground">
            Request <span className="text-gradient-accent">lifecycle</span>
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-transparent" />

          <div className="space-y-12">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex gap-6 items-start"
              >
                <div className="relative z-10 w-14 h-14 rounded-xl border border-primary/30 bg-card flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-sm font-bold text-primary">{step.num}</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-mono font-semibold text-foreground text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">{step.desc}</p>
                  <div className="bg-muted/30 border border-border/40 rounded-lg px-4 py-2.5 font-mono text-xs text-primary/80 overflow-x-auto">
                    {step.code}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
