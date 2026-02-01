class MetricsCollector {
  constructor() {
    this.metrics = {};
    this.io = null;

    this.WINDOW_SIZE = 20;
    this.ERROR_THRESHOLD = 5;

    /* broadcast snapshot every 5 seconds */
    setInterval(() => {
      if (this.io) {
        this.io.emit("metrics:full", this.metrics);
      }
    }, 5000);
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
          errors: [],
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

    if (stats.latency.length > this.WINDOW_SIZE) {
      stats.latency.shift();
    }

    /* emit live update */
    if (this.io) {
      this.io.emit("metrics:update", {
        tenantId,
        backendId,
        latency
      });
    }
  }

  recordError(tenantId, backendId) {
    const stats = this.metrics[tenantId][backendId.toString()];
    if (!stats) return;

    stats.active--;

    stats.errors.push(Date.now());

    if (stats.errors.length > this.WINDOW_SIZE) {
      stats.errors.shift();
    }

    /* CIRCUIT BREAKER */
    if (stats.errors.length >= this.ERROR_THRESHOLD) {
      stats.isIsolated = true;

      console.log(`🚨 Backend ${backendId} isolated`);

      if (this.io) {
        this.io.emit("backend:isolated", {
          tenantId,
          backendId
        });
      }
    }
  }

  getMetrics(tenantId) {
    return this.metrics[tenantId];
  }
}

module.exports = new MetricsCollector();
