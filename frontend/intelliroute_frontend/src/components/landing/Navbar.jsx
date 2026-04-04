import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-glass"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-mono font-bold text-lg text-foreground tracking-tight">
            Intelli<span className="text-primary">Route</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-mono text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#architecture" className="hover:text-primary transition-colors">Architecture</a>
          <a href="#metrics" className="hover:text-primary transition-colors">Metrics</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="font-mono text-muted-foreground hover:text-foreground" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="hero" size="sm" className="gap-2 !text-black" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>  
    </motion.nav>
  );
};

export default Navbar;
