import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface BackendMetric {
  latency: number[];
  errors: number[];
  active: number;
  isIsolated: boolean;
}

export type MetricsSnapshot = Record<string, Record<string, BackendMetric>>;

export function useSocket(tenantId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const [metrics, setMetrics] = useState<Record<string, BackendMetric>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!tenantId) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("metrics:full", (snapshot: MetricsSnapshot) => {
      const tenantMetrics = snapshot[tenantId];
      if (tenantMetrics) setMetrics(tenantMetrics);
    });

    socket.on("metrics:update", (data: { tenantId: string; backendId: string; latency: number }) => {
      if (data.tenantId !== tenantId) return;
      setMetrics((prev) => {
        const existing = prev[data.backendId] || { latency: [], errors: [], active: 0, isIsolated: false };
        const latency = [...existing.latency.slice(-19), data.latency];
        return { ...prev, [data.backendId]: { ...existing, latency } };
      });
    });

    socket.on("backend:isolated", (data: { tenantId: string; backendId: string }) => {
      if (data.tenantId !== tenantId) return;
      setMetrics((prev) => {
        const existing = prev[data.backendId];
        if (!existing) return prev;
        return { ...prev, [data.backendId]: { ...existing, isIsolated: true } };
      });
    });

    socket.on("backend:recovered", (data: { tenantId: string; backendId: string }) => {
      if (data.tenantId !== tenantId) return;
      setMetrics((prev) => {
        const existing = prev[data.backendId];
        if (!existing) return prev;
        return { ...prev, [data.backendId]: { ...existing, isIsolated: false, errors: [] } };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [tenantId]);

  return { metrics, connected };
}
