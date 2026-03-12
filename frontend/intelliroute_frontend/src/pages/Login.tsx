import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-mono font-bold text-xl text-foreground tracking-tight">
              inteli<span className="text-primary">route</span>
            </span>
          </Link>

          <h1 className="text-3xl font-mono font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in to your control plane
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.com"
                required
                className="bg-card border-border/50 font-mono text-sm h-12 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-card border-border/50 font-mono text-sm h-12 pr-10 focus:border-primary/50"
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
              className="w-full h-12 text-sm"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Access Control Plane
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8 font-mono">
            No account?{" "}
            <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors">
              Deploy now →
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right panel decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-card/30 border-l border-border/20 relative">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 p-12 max-w-lg"
        >
          <div className="space-y-6 font-mono text-sm">
            <div className="p-4 rounded-xl border border-border/30 bg-card/50">
              <div className="text-xs text-muted-foreground mb-2">$ inteliroute status</div>
              <div className="text-secondary">✓ 4 backends healthy</div>
              <div className="text-primary">✓ AI arbitration active</div>
              <div className="text-foreground/60">✓ 12,847 req/min routed</div>
            </div>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
              <div className="text-xs text-muted-foreground mb-2">$ scoring --realtime</div>
              <div className="text-foreground/80">us-east-1a: <span className="text-secondary">score 94</span> → weight 38%</div>
              <div className="text-foreground/80">eu-west-1a: <span className="text-primary">score 78</span> → weight 28%</div>
              <div className="text-foreground/80">ap-south-1a: <span className="text-destructive">score 42</span> → weight 12%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
