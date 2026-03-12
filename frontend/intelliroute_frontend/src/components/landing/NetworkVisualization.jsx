import { useEffect, useRef } from "react";

const NetworkVisualization = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const nodes = [
      // Clients (left side)
      { x: 0.08, y: 0.2, vx: 0, vy: 0.0003, radius: 5, type: "client", label: "Client 1", pulsePhase: 0 },
      { x: 0.08, y: 0.5, vx: 0, vy: -0.0002, radius: 5, type: "client", label: "Client 2", pulsePhase: 2 },
      { x: 0.08, y: 0.8, vx: 0, vy: 0.0004, radius: 5, type: "client", label: "Client 3", pulsePhase: 4 },
      // Proxy (center)
      { x: 0.5, y: 0.5, vx: 0, vy: 0, radius: 14, type: "proxy", label: "InteliRoute", pulsePhase: 0 },
      // Backends (right side)
      { x: 0.88, y: 0.15, vx: 0, vy: 0.0002, radius: 7, type: "backend", label: "Server A", pulsePhase: 1 },
      { x: 0.88, y: 0.42, vx: 0, vy: -0.0003, radius: 7, type: "backend", label: "Server B", pulsePhase: 3 },
      { x: 0.88, y: 0.68, vx: 0, vy: 0.0001, radius: 7, type: "backend", label: "Server C", pulsePhase: 5 },
      { x: 0.88, y: 0.9, vx: 0, vy: -0.0002, radius: 7, type: "backend", label: "Server D", pulsePhase: 2 },
    ];

    // Connections: clients→proxy, proxy→backends
    const connections = [
      [0, 3], [1, 3], [2, 3],
      [3, 4], [3, 5], [3, 6], [3, 7],
    ];

    const packets = [];

    const colors = {
      client: "hsl(170, 100%, 50%)",
      proxy: "hsl(170, 100%, 50%)",
      backend: "hsl(145, 100%, 50%)",
      line: "hsla(170, 60%, 40%, 0.15)",
      packet1: "hsl(170, 100%, 60%)",
      packet2: "hsl(145, 100%, 55%)",
      packet3: "hsl(270, 80%, 65%)",
    };
    const packetColors = [colors.packet1, colors.packet2, colors.packet3];

    let frame = 0;

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);
      frame++;

      // Animate node positions slightly
      nodes.forEach((n) => {
        if (n.type !== "proxy") {
          n.y += n.vy;
          if (n.y < 0.1 || n.y > 0.9) n.vy *= -1;
        }
      });

      // Spawn packets
      if (frame % 40 === 0) {
        const conn = connections[Math.floor(Math.random() * connections.length)];
        packets.push({
          fromIdx: conn[0],
          toIdx: conn[1],
          progress: 0,
          speed: 0.008 + Math.random() * 0.008,
          color: packetColors[Math.floor(Math.random() * packetColors.length)],
        });
      }

      // Draw connections
      connections.forEach(([fi, ti]) => {
        const f = nodes[fi];
        const t = nodes[ti];
        ctx.beginPath();
        ctx.moveTo(f.x * w, f.y * h);
        ctx.lineTo(t.x * w, t.y * h);
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw & update packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const f = nodes[p.fromIdx];
        const t = nodes[p.toIdx];
        const px = (f.x + (t.x - f.x) * p.progress) * w;
        const py = (f.y + (t.y - f.y) * p.progress) * h;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes
      nodes.forEach((n) => {
        const nx = n.x * w;
        const ny = n.y * h;
        const pulse = Math.sin((frame * 0.03) + n.pulsePhase) * 0.3 + 1;
        const r = n.radius * pulse;

        // Glow
        const glowColor = n.type === "proxy" ? colors.proxy : n.type === "client" ? colors.client : colors.backend;
        ctx.beginPath();
        ctx.arc(nx, ny, r + 8, 0, Math.PI * 2);
        ctx.fillStyle = glowColor.replace(")", ", 0.08)").replace("hsl", "hsla");
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = n.type === "proxy" ? "hsl(240, 15%, 8%)" : "hsl(240, 15%, 6%)";
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = n.type === "proxy" ? 2.5 : 1.5;
        ctx.fill();
        ctx.stroke();

        // Label
        if (n.type === "proxy") {
          ctx.font = "bold 10px 'JetBrains Mono', monospace";
          ctx.fillStyle = colors.proxy;
          ctx.textAlign = "center";
          ctx.fillText("⚡", nx, ny + 4);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default NetworkVisualization;
