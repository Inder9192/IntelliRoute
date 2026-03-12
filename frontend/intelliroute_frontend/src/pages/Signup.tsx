import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signup({ name, email, password, company: company || undefined });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Left panel decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-card/30 border-r border-border/20 relative">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 p-12 max-w-lg space-y-8"
        >
          <div>
            <h2 className="text-2xl font-mono font-bold text-foreground mb-3">
              Intelligent <span className="text-gradient-primary">routing</span> at scale
            </h2>
            <p className="text-muted-foreground text-sm">
              Deploy AI-powered load balancing in minutes. No infrastructure overhead.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "⚡", title: "Sub-50ms routing", desc: "Weighted scoring + AI arbitration" },
              { icon: "🛡️", title: "Circuit breakers", desc: "Auto-isolate failing backends" },
              { icon: "📊", title: "Real-time metrics", desc: "Socket.IO live dashboard" },
              { icon: "🤖", title: "AWS Bedrock AI", desc: "ML-powered routing decisions" },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-3 items-start p-3 rounded-lg border border-border/20 bg-card/30">
                <span className="text-lg">{feature.icon}</span>
                <div>
                  <div className="text-sm font-mono text-foreground">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-mono font-bold text-xl text-foreground tracking-tight">
              inteli<span className="text-primary">route</span>
            </span>
          </Link>

          <h1 className="text-3xl font-mono font-bold text-foreground mb-2">Create account</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Deploy your first routing cluster in 60 seconds
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm font-mono"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="bg-card border-border/50 font-mono text-sm h-11 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.com"
                required
                className="bg-card border-border/50 font-mono text-sm h-11 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Company <span className="text-muted-foreground/50">(optional)</span></Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className="bg-card border-border/50 font-mono text-sm h-11 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className="bg-card border-border/50 font-mono text-sm h-11 pr-10 focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full h-12 text-sm mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Deploy Control Plane
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8 font-mono">
            Already deployed?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors">
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
