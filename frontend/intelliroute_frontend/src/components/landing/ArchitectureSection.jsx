import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Your Request Arrives",
    desc: "When a user sends a request, it comes to our system where we identify who they are and what company they belong to.",
    code: "",
  },
  {
    num: "02",
    title: "We Check Your Servers",
    desc: "We measure how well each of your backup servers is performing - checking their speed, reliability, and current workload.",
    code: "",
  },
  {
    num: "03",
    title: "Smart Comparison",
    desc: "When multiple servers are equally good, our AI gets involved to spot any differences in their performance patterns.",
    code: "",
  },
  {
    num: "04",
    title: "Request Gets Routed",
    desc: "We send your request to the best-performing server based on all the checks we just did, ensuring the fastest response.",
    code: "",
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
                  {step.code && (
                    <div className="bg-muted/30 border border-border/40 rounded-lg px-4 py-2.5 font-mono text-xs text-primary/80 overflow-x-auto">
                      {step.code}
                    </div>
                  )}
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
