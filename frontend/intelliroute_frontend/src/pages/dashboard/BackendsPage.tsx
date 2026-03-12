import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Server, Plus, Trash2, RefreshCw, CheckCircle, XCircle, AlertTriangle, X 
} from "lucide-react";

interface Backend {
  id: string;
  host: string;
  port: number;
  weight: number;
  healthy: boolean;
  circuitState: "CLOSED" | "OPEN" | "HALF_OPEN";
  latency: number;
  activeConnections: number;
  tags: string[];
}

const mockBackends: Backend[] = [
  { id: "1", host: "10.0.1.12", port: 8080, weight: 35, healthy: true, circuitState: "CLOSED", latency: 42, activeConnections: 12, tags: ["primary", "us-east"] },
  { id: "2", host: "10.0.1.13", port: 8080, weight: 28, healthy: true, circuitState: "CLOSED", latency: 67, activeConnections: 8, tags: ["us-east"] },
  { id: "3", host: "10.0.2.20", port: 8080, weight: 22, healthy: true, circuitState: "CLOSED", latency: 124, activeConnections: 15, tags: ["eu-west"] },
  { id: "4", host: "10.0.3.10", port: 8080, weight: 15, healthy: false, circuitState: "OPEN", latency: 198, activeConnections: 3, tags: ["ap-south"] },
];

const BackendsPage = () => {
  const [backends, setBackends] = useState(mockBackends);
  const [showAdd, setShowAdd] = useState(false);
  const [newHost, setNewHost] = useState("");
  const [newPort, setNewPort] = useState("8080");
  const [newWeight, setNewWeight] = useState("25");
  const [newTags, setNewTags] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newBackend: Backend = {
      id: Date.now().toString(),
      host: newHost,
      port: parseInt(newPort),
      weight: parseInt(newWeight),
      healthy: true,
      circuitState: "CLOSED",
      latency: Math.floor(Math.random() * 100 + 20),
      activeConnections: 0,
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setBackends([...backends, newBackend]);
    setShowAdd(false);
    setNewHost("");
    setNewPort("8080");
    setNewWeight("25");
    setNewTags("");
  };

  const handleDelete = (id: string) => {
    setBackends(backends.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Backends</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage your upstream servers</p>
        </div>
        <Button variant="hero" size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" />
          Add Backend
        </Button>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-xl border border-border/30 bg-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-mono font-bold text-foreground">Register Backend</h2>
                <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Host</Label>
                    <Input value={newHost} onChange={(e) => setNewHost(e.target.value)} placeholder="10.0.1.14" required className="bg-muted/30 border-border/50 font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Port</Label>
                    <Input type="number" value={newPort} onChange={(e) => setNewPort(e.target.value)} required className="bg-muted/30 border-border/50 font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Weight</Label>
                  <Input type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} min="1" max="100" required className="bg-muted/30 border-border/50 font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Tags <span className="text-muted-foreground/50">(comma-separated)</span></Label>
                  <Input value={newTags} onChange={(e) => setNewTags(e.target.value)} placeholder="us-east, primary" className="bg-muted/30 border-border/50 font-mono text-sm" />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  <Server className="w-4 h-4" />
                  Register
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backend cards */}
      <div className="grid gap-4">
        {backends.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl border bg-card/50 backdrop-blur-sm p-5 transition-all ${
              b.circuitState === "OPEN" ? "border-destructive/30" : "border-border/30 hover:border-primary/20"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  b.healthy ? "bg-secondary/10" : "bg-destructive/10"
                }`}>
                  <Server className={`w-5 h-5 ${b.healthy ? "text-secondary" : "text-destructive"}`} />
                </div>
                <div>
                  <div className="font-mono font-semibold text-foreground">
                    {b.host}:{b.port}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {b.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(b.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5 pt-4 border-t border-border/10">
              <div>
                <div className="text-xs font-mono text-muted-foreground">STATUS</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {b.healthy ? (
                    <><CheckCircle className="w-3.5 h-3.5 text-secondary" /><span className="text-sm font-mono text-secondary">Healthy</span></>
                  ) : (
                    <><XCircle className="w-3.5 h-3.5 text-destructive" /><span className="text-sm font-mono text-destructive">Unhealthy</span></>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">CIRCUIT</div>
                <div className={`text-sm font-mono mt-1 ${
                  b.circuitState === "CLOSED" ? "text-secondary" :
                  b.circuitState === "OPEN" ? "text-destructive" : "text-primary"
                }`}>
                  {b.circuitState}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">LATENCY</div>
                <div className={`text-sm font-mono mt-1 ${b.latency > 150 ? "text-destructive" : b.latency > 80 ? "text-primary" : "text-foreground"}`}>
                  {b.latency}ms
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">CONNECTIONS</div>
                <div className="text-sm font-mono mt-1 text-foreground">{b.activeConnections}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">WEIGHT</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${b.weight}%` }} />
                  </div>
                  <span className="text-sm font-mono text-primary">{b.weight}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BackendsPage;
