const { createProxyMiddleware } = require("http-proxy-middleware");
const BackendService = require("../models/backendService");
const metricsCollector = require("../metrics/metricsCollector");
const { selectBestBackend } = require("../engine/ruleEngine");

async function proxyHandler(req, res, next) {
  const tenantId = req.user.tenantId.toString();

  const backends = await BackendService.find({
    tenantId,
    isActive: true
  });

  metricsCollector.initTenant(tenantId, backends);

  const metrics = metricsCollector.getMetrics(tenantId);
  const bestBackend = selectBestBackend(backends, metrics);

  const start = Date.now();
  metricsCollector.recordRequest(tenantId, bestBackend._id);

  return createProxyMiddleware({
    target: bestBackend.url,
    changeOrigin: true,
    onProxyRes: () => {
      const latency = Date.now() - start;
      metricsCollector.recordResponse(tenantId, bestBackend._id, latency);
    },
    onError: () => {
      metricsCollector.recordError(tenantId, bestBackend._id);
    }
  })(req, res, next);
}

module.exports = proxyHandler;
