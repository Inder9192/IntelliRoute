const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const metricsCollector = require("../metrics/metricsCollector");
const BackendService = require("../models/backendService");

const router = express.Router();

router.get("/overview", authMiddleware, async (req, res) => {
  const tenantId = req.user.tenantId.toString();
  const backends = await BackendService.find({ tenantId: req.user.tenantId });
  const metrics = metricsCollector.getMetrics(tenantId) || {};

  const result = backends.map((b) => {
    const id = b._id.toString();
    const m = metrics[id] || { latency: [], errors: [], active: 0, isIsolated: false };
    const avgLatency = m.latency.length
      ? Math.round(m.latency.reduce((s, v) => s + v, 0) / m.latency.length)
      : 0;

    return {
      id,
      name: b.name,
      url: b.url,
      isActive: b.isActive,
      isIsolated: m.isIsolated,
      avgLatency,
      errorCount: m.errors.length,
      activeConnections: m.active,
    };
  });

  res.json(result);
});

module.exports = router;
