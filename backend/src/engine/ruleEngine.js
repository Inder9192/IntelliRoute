const { calculateScore } = require("./scoringEngine");

function selectBestBackend(backends, metrics) {
  let best = null;
  let bestScore = -1;

  backends.forEach(b => {
    const stats = metrics[b._id];
    const score = calculateScore(stats);
    if (score > bestScore) {
      bestScore = score;
      best = b;
    }
  });

  return best;
}

module.exports = { selectBestBackend };
