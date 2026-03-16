const http = require("http");
const https = require("https");
const BackendService = require("../models/backendService");
const metricsCollector = require("../metrics/metricsCollector");

const HEALTH_CHECK_INTERVAL_MS = 10000; // 10 seconds
const RECOVERY_THRESHOLD = 5; // 5 consecutive successful pings to recover

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
  const allMetrics = metricsCollector.metrics;

  for (const [tenantId, backends] of Object.entries(allMetrics)) {
    for (const [backendId, stats] of Object.entries(backends)) {
      if (!stats.isIsolated) continue;

      // Find the backend URL
      const backend = await BackendService.findById(backendId).catch(() => null);
      if (!backend) continue;

      const alive = await ping(backend.url);

      if (alive) {
        consecutiveSuccesses[backendId] = (consecutiveSuccesses[backendId] || 0) + 1;
        console.log(`✅ Health check OK for ${backend.name} (${consecutiveSuccesses[backendId]}/${RECOVERY_THRESHOLD})`);

        if (consecutiveSuccesses[backendId] >= RECOVERY_THRESHOLD) {
          // Recover the backend
          stats.isIsolated = false;
          stats.errors = [];
          consecutiveSuccesses[backendId] = 0;

          console.log(`🟢 Backend ${backend.name} recovered — circuit closed`);

          if (metricsCollector.io) {
            metricsCollector.io.emit("backend:recovered", { tenantId, backendId });
          }
        }
      } else {
        // Failed ping — reset the streak
        consecutiveSuccesses[backendId] = 0;
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
