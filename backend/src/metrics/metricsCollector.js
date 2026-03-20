class MetricsCollector {
  constructor() {
    this.metrics = {};
    this.io = null;

    this.WINDOW_SIZE = 20;
    this.ERROR_THRESHOLD = 3; // 3 consecutive failures to isolate

    /* metrics are pushed live after every request via proxyServer — no interval needed */
  }

  setSocket(io) {
    this.io = io;
  }

  initTenant(tenantId, backends) {
    if (!this.metrics[tenantId]) {
      this.metrics[tenantId] = {};
    }

    backends.forEach(b => {
      const id = b._id.toString();

      if (!this.metrics[tenantId][id]) {
        this.metrics[tenantId][id] = {
          latency: [],
          consecutiveErrors: 0,
          totalErrors: 0,
          active: 0,
          isIsolated: false
        };
      }
    });
  }

  recordRequest(tenantId, backendId) {
    const stats = this.metrics[tenantId][backendId.toString()];
    if (!stats) return;

    stats.active++;
  }

  recordResponse(tenantId, backendId, latency) {
    const stats = this.metrics[tenantId][backendId.toString()];
    if (!stats) return;

    stats.active--;

    /* Sliding latency window */
    stats.latency.push(latency);
    if (stats.latency.length > this.WINDOW_SIZE) stats.latency.shift();

    /* Success resets the consecutive error counter */
    stats.consecutiveErrors = 0;
  }

  recordError(tenantId, backendId) {
    const stats = this.metrics[tenantId][backendId.toString()];
    if (!stats) return;

    stats.active--;

    if (stats.isIsolated) return; // already isolated, stop counting

    /* CONSECUTIVE error tracking — resets on any success */
    stats.consecutiveErrors = (stats.consecutiveErrors || 0) + 1;
    stats.totalErrors = (stats.totalErrors || 0) + 1;

    /* CIRCUIT BREAKER — trips only after N consecutive failures */
    if (stats.consecutiveErrors >= this.ERROR_THRESHOLD) {
      stats.isIsolated = true;
      stats.consecutiveErrors = 0;

      console.log(`🚨 Backend ${backendId} isolated after ${this.ERROR_THRESHOLD} consecutive failures`);

      if (this.io) {
        this.io.emit("backend:isolated", { tenantId, backendId: backendId.toString() });
        this.io.emit("metrics:full", this.metrics);
      }
    }
  }

  getMetrics(tenantId) {
    return this.metrics[tenantId];
  }
}

module.exports = new MetricsCollector();
