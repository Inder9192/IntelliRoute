import '../styles/MetricsDisplay.css';

function MetricsDisplay({ backends, metrics }) {
  const getBackendMetrics = (backendId) => {
    // Find metrics for this backend across all tenants
    for (const tenantId in metrics) {
      const tenantMetrics = metrics[tenantId];
      if (tenantMetrics && tenantMetrics[backendId]) {
        return tenantMetrics[backendId];
      }
    }
    return null;
  };

  const calculateTotalMetrics = () => {
    let totalRequests = 0;
    let totalErrors = 0;
    let totalLatency = 0;
    let count = 0;

    backends.forEach(backend => {
      const meta = getBackendMetrics(backend._id);
      if (meta) {
        totalRequests += meta.requests || 0;
        totalErrors += meta.errors || 0;
        totalLatency += meta.avgLatency || 0;
        count++;
      }
    });

    return {
      totalRequests,
      totalErrors,
      avgLatency: count > 0 ? Math.round(totalLatency / count) : 0,
      errorRate: totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : 0
    };
  };

  const overallMetrics = calculateTotalMetrics();

  return (
    <div className="metrics-display">
      <div className="metrics-summary">
        <div className="metric-card">
          <div className="metric-label">Total Requests</div>
          <div className="metric-value">{overallMetrics.totalRequests}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Errors</div>
          <div className="metric-value error">{overallMetrics.totalErrors}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Latency</div>
          <div className="metric-value">{overallMetrics.avgLatency}ms</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Error Rate</div>
          <div className="metric-value">{overallMetrics.errorRate}%</div>
        </div>
      </div>

      {backends.length === 0 ? (
        <div className="empty-state">
          <p>No backends configured yet.</p>
          <p className="hint">Add a backend to see metrics.</p>
        </div>
      ) : (
        <div className="backends-metrics">
          <h3>Per-Backend Metrics</h3>
          <div className="metrics-table">
            <div className="table-header">
              <div className="col col-name">Backend Name</div>
              <div className="col col-requests">Requests</div>
              <div className="col col-errors">Errors</div>
              <div className="col col-latency">Avg Latency</div>
              <div className="col col-status">Status</div>
            </div>
            {backends.map(backend => {
              const meta = getBackendMetrics(backend._id);
              return (
                <div key={backend._id} className="table-row">
                  <div className="col col-name">
                    <strong>{backend.name}</strong>
                  </div>
                  <div className="col col-requests">
                    {meta?.requests || 0}
                  </div>
                  <div className="col col-errors">
                    <span className={meta?.errors > 0 ? 'has-errors' : ''}>
                      {meta?.errors || 0}
                    </span>
                  </div>
                  <div className="col col-latency">
                    {meta?.avgLatency || 0}ms
                  </div>
                  <div className="col col-status">
                    {meta?.isIsolated ? (
                      <span className="badge isolated">Isolated</span>
                    ) : (
                      <span className="badge healthy">Healthy</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricsDisplay;
