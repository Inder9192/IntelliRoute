import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Save, Key, Globe, Bell } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const [apiUrl, setApiUrl] = useState("http://localhost:3000");
  const [healthInterval, setHealthInterval] = useState("10");
  const [circuitThreshold, setCircuitThreshold] = useState("5");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-mono font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Configure your control plane</p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border/30 bg-card/50 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">Account</h2>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-muted-foreground">Name</Label>
            <Input value={user?.name || ""} disabled className="bg-muted/20 border-border/30 font-mono text-sm opacity-60" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-muted-foreground">Email</Label>
            <Input value={user?.email || ""} disabled className="bg-muted/20 border-border/30 font-mono text-sm opacity-60" />
          </div>
        </div>
      </motion.div>

      {/* Proxy settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border/30 bg-card/50 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">Proxy Configuration</h2>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-muted-foreground">API Base URL</Label>
            <Input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className="bg-muted/30 border-border/50 font-mono text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground">Health Check Interval (s)</Label>
              <Input type="number" value={healthInterval} onChange={(e) => setHealthInterval(e.target.value)} className="bg-muted/30 border-border/50 font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground">Circuit Breaker Threshold</Label>
              <Input type="number" value={circuitThreshold} onChange={(e) => setCircuitThreshold(e.target.value)} className="bg-muted/30 border-border/50 font-mono text-sm" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/30 bg-card/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">Alerts</h2>
        </div>
        <div className="space-y-3">
          {["Circuit breaker opens", "Backend unhealthy", "AI arbitration override", "Error rate > 5%"].map((alert) => (
            <label key={alert} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border bg-muted accent-primary" />
              <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">{alert}</span>
            </label>
          ))}
        </div>
      </motion.div>

      <Button variant="hero" onClick={handleSave}>
        <Save className="w-4 h-4" />
        {saved ? "Saved ✓" : "Save Settings"}
      </Button>
    </div>
  );
};

export default SettingsPage;
