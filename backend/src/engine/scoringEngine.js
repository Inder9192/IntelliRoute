function calculateScore(stats) {
  const avgLatency =
    stats.latency.length === 0
      ? 0
      : stats.latency.reduce((a, b) => a + b, 0) / stats.latency.length;

  let score = 100;
  score -= avgLatency * 0.2;
  score -= stats.errors * 10;
  score -= stats.active * 2;

  return Math.max(score, 0);
}

module.exports = { calculateScore };
