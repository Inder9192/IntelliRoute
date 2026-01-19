class MetricsCollector {
  constructor() {
    this.metrics = {};
  }

  initTenant(tenantId, backends) {
    if (!this.metrics[tenantId]) {
      this.metrics[tenantId] = {};
      backends.forEach(b => {
        this.metrics[tenantId][b._id] = {
          latency: [],
          errors: 0,
          active: 0
        };
      });
    }
  }

  recordRequest(tenantId, backendId) {
    this.metrics[tenantId][backendId].active++;
  }

  recordResponse(tenantId, backendId, latency) {
    this.metrics[tenantId][backendId].latency.push(latency);
    this.metrics[tenantId][backendId].active--;
  }

  recordError(tenantId, backendId) {
    this.metrics[tenantId][backendId].errors++;
    this.metrics[tenantId][backendId].active--;
  }

  getMetrics(tenantId) {
    return this.metrics[tenantId];
  }
}

module.exports = new MetricsCollector();
