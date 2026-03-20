const http = require("http");
const https = require("https");
const BackendService = require("../models/backendService");
const metricsCollector = require("../metrics/metricsCollector");

const HEALTH_CHECK_INTERVAL_MS = 5000; // 5 seconds
const RECOVERY_THRESHOLD = 3; // 3 consecutive successful pings to recover (~15 seconds)

// Track consecutive successes per backend: { backendId: count }
const consecutiveSuccesses = {};

function ping(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { timeout: 4000 }, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

async function runHealthChecks() {
  // ping ALL backends from DB — not just ones tracked in memory
  const allBackends = await BackendService.find({ isActive: true }).catch(() => []);

  for (const backend of allBackends) {
    const backendId = backend._id.toString();
    const tenantId = backend.tenantId.toString();

    // ensure metrics entry exists
    if (!metricsCollector.metrics[tenantId]) metricsCollector.metrics[tenantId] = {};
    if (!metricsCollector.metrics[tenantId][backendId]) {
      metricsCollector.metrics[tenantId][backendId] = { latency: [], consecutiveErrors: 0, totalErrors: 0, active: 0, isIsolated: false };
    }

    const stats = metricsCollector.metrics[tenantId][backendId];

    const alive = await ping(backend.url);

    if (alive) {
      consecutiveSuccesses[backendId] = (consecutiveSuccesses[backendId] || 0) + 1;

      if (stats.isIsolated) {
        console.log(`✅ Health check OK for ${backend.name} (${consecutiveSuccesses[backendId]}/${RECOVERY_THRESHOLD})`);
      }

      if (stats.isIsolated && consecutiveSuccesses[backendId] >= RECOVERY_THRESHOLD) {
        stats.isIsolated = false;
        stats.consecutiveErrors = 0;
        stats.active = 0;
        consecutiveSuccesses[backendId] = 0;

        console.log(`🟢 Backend ${backend.name} recovered — circuit closed`);

        if (metricsCollector.io) {
          metricsCollector.io.emit("backend:recovered", { tenantId, backendId });
          metricsCollector.io.emit("metrics:full", metricsCollector.metrics);
        }
      }
    } else {
      // always reset success streak on failure (isolated or not)
      consecutiveSuccesses[backendId] = 0;
      if (stats.isIsolated) {
        console.log(`❌ Health check FAILED for ${backend.name}`);
      }
    }
  }
}

function start() {
  setInterval(runHealthChecks, HEALTH_CHECK_INTERVAL_MS);
  console.log(`🏥 Health checker started (every ${HEALTH_CHECK_INTERVAL_MS / 1000}s, recovery after ${RECOVERY_THRESHOLD} successes)`);
}

module.exports = { start };
