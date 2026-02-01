const { createProxyMiddleware } = require("http-proxy-middleware");
const BackendService = require("../models/backendService");
const metricsCollector = require("../metrics/metricsCollector");
const { buildRoutingPlan } = require("../engine/ruleEngine");

/**
 * Pick backend based on weights
 */
function pickBackendByWeight(weightedPlan) {
  const random = Math.floor(Math.random() * 100) + 1;

  let cumulative = 0;

  for (const entry of weightedPlan) {
    cumulative += entry.weight;
    if (random <= cumulative) {
      return entry.backend;
    }
  }

  // Fallback (should not normally happen)
  return weightedPlan[0].backend;
}

async function proxyHandler(req, res, next) {
  try {
    const tenantId = req.user.tenantId.toString();

    const backends = await BackendService.find({
      tenantId,
      isActive: true
    });

    if (!backends.length) {
      return res.status(503).json({
        msg: "No backends configured"
      });
    }

    // Initialize metrics if needed
    metricsCollector.initTenant(tenantId, backends);

    const metrics = metricsCollector.getMetrics(tenantId);

    // 1. Build weighted routing plan
    const routingPlan = await buildRoutingPlan(backends, metrics);

    // 2. Pick backend probabilistically
    const selectedBackend = pickBackendByWeight(routingPlan);

    const start = Date.now();
    metricsCollector.recordRequest(tenantId, selectedBackend._id);

    return createProxyMiddleware({
      target: selectedBackend.url,
      changeOrigin: true,

      onProxyRes: () => {
        const latency = Date.now() - start;
        metricsCollector.recordResponse(
          tenantId,
          selectedBackend._id,
          latency
        );
      },

      onError: () => {
        metricsCollector.recordError(
          tenantId,
          selectedBackend._id
        );
      }
    })(req, res, next);

  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ msg: "Proxy failure" });
  }
}

module.exports = proxyHandler;
