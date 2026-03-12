import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FooterSection = () => {
  return (
    <>
      {/* CTA */}
      <section className="py-32 relative">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, hsla(170, 100%, 50%, 0.04) 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-mono font-bold text-foreground mb-6">
              Ready to route <span className="text-gradient-primary">intelligently</span>?
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Deploy InteliRoute and let AI optimize your traffic in real-time.
            </p>
            <Button variant="hero" size="lg" className="text-base px-10">
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm text-muted-foreground">
              inteli<span className="text-primary">route</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            AI-powered reverse proxy load balancer
          </p>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;
