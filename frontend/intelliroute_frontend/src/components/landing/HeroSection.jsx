import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";
import NetworkVisualization from "./NetworkVisualization";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(170, 100%, 50%, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-xs font-mono text-primary tracking-wider uppercase">
                  AI-Powered Load Balancing
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground">Route </span>
                <span className="text-gradient-primary">smarter,</span>
                <br />
                <span className="text-foreground">not harder.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              IntelliRoute is an intelligent traffic router that automatically directs your requests
              to the best-performing server in real-time.
              Designed for teams managing multiple servers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Button variant="hero" size="lg" className="gap-2 !text-black">
                Start Routing <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="heroOutline" size="lg" className="gap-2">
                <Terminal className="w-4 h-4" /> View Docs
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex items-center gap-6 pt-4 text-xs font-mono text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Real-time metrics
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Circuit breaker
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                AI arbitration
              </span>
            </motion.div>
          </div>

          {/* Right: Network Viz */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[400px] lg:h-[500px]"
          >
            <div className="absolute inset-0 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden">
              <NetworkVisualization />
            </div>
            {/* Overlay label */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-glass rounded-md">
              <span className="text-[10px] font-mono text-primary tracking-widest uppercase">
                Live routing topology
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
