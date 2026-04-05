const express = require("express");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const backendRoutes = require("./routes/backendRoutes");
const metricsRoutes = require("./routes/metricsRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const apiKeyMiddleware = require("./middleware/apiKeyMiddleware");
const proxyHandler = require("./proxy/proxyServer");

const metricsCollector = require("./metrics/metricsCollector");
const healthChecker = require("./health/healthChecker");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/backends", backendRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/proxy", authMiddleware, proxyHandler);      // dashboard testing (JWT)
app.use("/proxy", apiKeyMiddleware, proxyHandler);         // external apps (API key)

app.get("/", (req, res) => {
  res.send("🔥 IntelliRoute Backend Running");
});

// Debug: see what tenantIds are in metrics
app.get("/debug/metrics", (req, res) => {
  const keys = Object.keys(metricsCollector.metrics);
  res.json({ tenantIds: keys, metrics: metricsCollector.metrics });
});

/* SOCKET SERVER */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

/* attach socket to metrics */
metricsCollector.setSocket(io);

/* start health checker */
healthChecker.start();

io.on("connection", (socket) => {
  console.log("⚡ Dashboard connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Dashboard disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
