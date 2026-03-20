const { createProxyMiddleware } = require("http-proxy-middleware");
const BackendService = require("../models/backendService");
const metricsCollector = require("../metrics/metricsCollector");
const { buildRoutingPlan } = require("../engine/ruleEngine");
const crypto = require("crypto");

function pickBackendByWeight(weightedPlan) {
  const random = Math.floor(Math.random() * 100) + 1;
  let cumulative = 0;
  for (const entry of weightedPlan) {
    cumulative += entry.weight;
    if (random <= cumulative) return entry.backend;
  }
  return weightedPlan[0].backend;
}

// ONE proxy instance reused for all requests — fixes MaxListeners leak
const proxy = createProxyMiddleware({
  router: (req) => req._proxyTarget,
  changeOrigin: true,
  on: {
    proxyRes: (proxyRes, req) => {
      if (!req._proxyMeta) return;
      const { tenantId, backendId, backendName, backendUrl, requestId, start, method, path } = req._proxyMeta;
      const latency = Date.now() - start;

      metricsCollector.recordResponse(tenantId, backendId, latency);

      if (metricsCollector.io) {
        metricsCollector.io.emit("metrics:full", metricsCollector.metrics);
        metricsCollector.io.emit("request:routed", {
          tenantId, requestId, backendId: backendId.toString(),
          backendName, backendUrl, method, path,
          timestamp: Date.now(), latency,
          status: proxyRes.statusCode >= 500 ? "error" : "success"
        });
      }
    },

    error: (err, req) => {
      if (!req._proxyMeta) return;
      const { tenantId, backendId, backendName, backendUrl, requestId, method, path } = req._proxyMeta;

      metricsCollector.recordError(tenantId, backendId);

      if (metricsCollector.io) {
        metricsCollector.io.emit("metrics:full", metricsCollector.metrics);
        metricsCollector.io.emit("request:routed", {
          tenantId, requestId, backendId: backendId.toString(),
          backendName, backendUrl, method, path,
          timestamp: Date.now(), status: "error"
        });
      }
    }
  }
});

async function proxyHandler(req, res, next) {
  try {
    const tenantId = req.user.tenantId.toString();

    const backends = await BackendService.find({ tenantId, isActive: true });

    if (!backends.length) {
      return res.status(503).json({ msg: "No backends configured" });
    }

    metricsCollector.initTenant(tenantId, backends);
    const metrics = metricsCollector.getMetrics(tenantId);

    const routingPlan = await buildRoutingPlan(backends, metrics);
    const selectedBackend = pickBackendByWeight(routingPlan);

    const requestId = crypto.randomBytes(4).toString("hex");
    const start = Date.now();

    metricsCollector.recordRequest(tenantId, selectedBackend._id);

    // store meta on req so the proxy callbacks can access it
    req._proxyTarget = selectedBackend.url;
    req._proxyMeta = {
      tenantId,
      backendId: selectedBackend._id,
      backendName: selectedBackend.name,
      backendUrl: selectedBackend.url,
      requestId,
      start,
      method: req.method,
      path: req.path
    };

    // emit routing decision immediately
    if (metricsCollector.io) {
      metricsCollector.io.emit("metrics:full", metricsCollector.metrics);
      metricsCollector.io.emit("request:routed", {
        tenantId, requestId,
        backendId: selectedBackend._id.toString(),
        backendName: selectedBackend.name,
        backendUrl: selectedBackend.url,
        method: req.method,
        path: req.path,
        timestamp: Date.now(),
        status: "pending"
      });
    }

    return proxy(req, res, next);

  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ msg: "Proxy failure" });
  }
}

module.exports = proxyHandler;
