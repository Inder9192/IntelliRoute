const http = require('http');

// Configuration for Backend 1
const config = {
  port: process.env.PORT || 5001,
  name: 'Backend Service 1',
  latencyMs: { min: 50, max: 150 },
  errorRate: 0.05, // 5% error rate
  jitter: true
};

let activeConnections = 0;
let requestCount = 0;
let errorCount = 0;

/**
 * Generate random latency with optional jitter
 */
function getLatency() {
  const base = Math.random() * (config.latencyMs.max - config.latencyMs.min) + config.latencyMs.min;
  if (!config.jitter) return base;
  return base * (0.8 + Math.random() * 0.4); // ±20% jitter
}

/**
 * Simulate backend processing
 */
async function processRequest(req) {
  activeConnections++;
  requestCount++;
  
  const latency = getLatency();
  const shouldError = Math.random() < config.errorRate;
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, latency));
  
  if (shouldError) {
    errorCount++;
    return {
      status: 500,
      body: {
        error: 'Internal Server Error',
        message: 'Backend service encountered an error',
        backendId: 'backend_1',
        timestamp: new Date().toISOString()
      }
    };
  }
  
  return {
    status: 200,
    body: {
      success: true,
      backendId: 'backend_1',
      method: req.method,
      path: req.url,
      latency: Math.round(latency),
      activeConnections: activeConnections,
      requestCount: requestCount,
      timestamp: new Date().toISOString(),
      data: {
        message: `Request processed by ${config.name}`,
        serverTime: new Date().toISOString()
      }
    }
  };
}

/**
 * Health check endpoint
 */
function getHealth() {
  return {
    status: 'healthy',
    backendId: 'backend_1',
    uptime: process.uptime(),
    activeConnections: activeConnections,
    totalRequests: requestCount,
    totalErrors: errorCount,
    errorRate: (errorCount / requestCount * 100).toFixed(2) + '%'
  };
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    activeConnections--;
    return;
  }
  
  try {
    // Health check endpoint
    if (req.url === '/health') {
      const health = getHealth();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(health));
      activeConnections--;
      return;
    }
    
    // Process any other request
    const result = await processRequest(req);
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.body));
    
  } catch (error) {
    console.error('Request error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Server Error',
      message: error.message,
      backendId: 'backend_1'
    }));
  } finally {
    activeConnections--;
  }
});

server.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════╗
║  ${config.name} Running On Port ${config.port}      ║
╚════════════════════════════════════════╝
📊 Configuration:
   - Latency: ${config.latencyMs.min}-${config.latencyMs.max}ms
   - Error Rate: ${(config.errorRate * 100).toFixed(1)}%
   - Jitter: ${config.jitter ? 'Enabled' : 'Disabled'}
📍 Health Check: http://localhost:${config.port}/health
  `);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n+ Shutting down...');
  server.close(() => {
    console.log('✓ Server stopped');
    process.exit(0);
  });
});
