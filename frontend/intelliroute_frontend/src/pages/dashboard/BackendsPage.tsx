import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server, Plus, Trash2, RefreshCw, CheckCircle, XCircle, X } from "lucide-react";
import { backendsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { BackendsSkeleton } from "@/components/dashboard/PageSkeleton";

interface Backend {
  _id: string;
  name: string;
  url: string;
  isActive: boolean;
}

const BackendsPage = () => {
  const { user } = useAuth();
  const { metrics } = useSocket(user?.tenantId);

  const [ready, setReady] = useState(false);
  const [backends, setBackends] = useState<Backend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchBackends = async () => {
    try {
      setLoading(true);
      const data = await backendsApi.list();
      setBackends(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackends();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      const backend = await backendsApi.create({ name: newName, url: newUrl });
      setBackends((prev) => [...prev, backend]);
      setShowAdd(false);
      setNewName("");
      setNewUrl("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await backendsApi.delete(id);
      setBackends((prev) => prev.filter((b) => b._id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (!ready) return <BackendsSkeleton />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", fontFamily: "monospace", margin: 0 }}>Backends</h1>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", fontFamily: "monospace", marginTop: "6px" }}>Manage your upstream servers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchBackends}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="hero" size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" />
            Add Backend
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm font-mono">
          {error}
        </div>
      )}

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
                <div className="space-y-2">
                  <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Name</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="my-server"
                    required
                    className="bg-muted/30 border-border/50 font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">URL</Label>
                  <Input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="http://10.0.1.12:8080"
                    required
                    className="bg-muted/30 border-border/50 font-mono text-sm"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={adding}>
                  <Server className="w-4 h-4" />
                  {adding ? "Registering..." : "Register"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backend cards */}
      {loading ? (
        <div className="text-muted-foreground text-sm font-mono text-center py-12">Loading backends...</div>
      ) : backends.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/30 rounded-xl">
          <Server className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-mono text-sm">No backends registered yet.</p>
          <Button variant="hero" size="sm" className="mt-4" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> Add your first backend
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {backends.map((b, i) => {
            const m = metrics[b._id] || { latency: [], errors: [], active: 0, isIsolated: false };
            const avgLatency = m.latency.length
              ? Math.round(m.latency.reduce((s, v) => s + v, 0) / m.latency.length)
              : null;
            const isIsolated = m.isIsolated;

            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border bg-card/50 backdrop-blur-sm p-5 transition-all ${
                  isIsolated ? "border-destructive/30" : "border-border/30 hover:border-primary/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isIsolated ? "bg-destructive/10" : "bg-secondary/10"
                    }`}>
                      <Server className={`w-5 h-5 ${isIsolated ? "text-destructive" : "text-secondary"}`} />
                    </div>
                    <div>
                      <div className="font-mono font-semibold text-foreground">{b.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{b.url}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(b._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-border/10">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">STATUS</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {b.isActive && !isIsolated ? (
                        <><CheckCircle className="w-3.5 h-3.5 text-secondary" /><span className="text-sm font-mono text-secondary">Active</span></>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5 text-destructive" /><span className="text-sm font-mono text-destructive">{isIsolated ? "Isolated" : "Inactive"}</span></>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">CIRCUIT</div>
                    <div className={`text-sm font-mono mt-1 ${isIsolated ? "text-destructive" : "text-secondary"}`}>
                      {isIsolated ? "OPEN" : "CLOSED"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">AVG LATENCY</div>
                    <div className={`text-sm font-mono mt-1 ${
                      avgLatency === null ? "text-muted-foreground" :
                      avgLatency > 150 ? "text-destructive" :
                      avgLatency > 80 ? "text-primary" : "text-foreground"
                    }`}>
                      {avgLatency !== null ? `${avgLatency}ms` : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">CONNECTIONS</div>
                    <div className="text-sm font-mono mt-1 text-foreground">{m.active}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BackendsPage;
