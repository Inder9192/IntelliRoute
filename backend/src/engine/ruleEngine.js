const { calculateScore } = require("./scoringEngine");
const { askBedrock } = require("../ai/bedrockClient");

const AI_WEIGHT_DIFF_THRESHOLD = 5; // %
const MAX_AI_DELTA = 10; // %

function normalizeWeights(scored) {
  const total = scored.reduce((s, b) => s + b.score, 0);

  if (total === 0) {
    const equal = Math.floor(100 / scored.length);
    return scored.map(b => ({
      backend: b.backend,
      weight: equal
    }));
  }

  return scored.map(b => ({
    backend: b.backend,
    weight: Math.round((b.score / total) * 100)
  }));
}

function weightsAreClose(plan) {
  if (plan.length < 2) return false;

  const sorted = [...plan].sort((a, b) => b.weight - a.weight);
  return Math.abs(sorted[0].weight - sorted[1].weight) <= AI_WEIGHT_DIFF_THRESHOLD;
}

function applyAIAdjustments(plan, adjustments) {
  const map = {};
  plan.forEach(p => {
    map[p.backend._id.toString()] = p.weight;
  });

  adjustments.forEach(adj => {
    if (!map.hasOwnProperty(adj.backendId)) return;

    const delta = Math.max(
      -MAX_AI_DELTA,
      Math.min(MAX_AI_DELTA, adj.delta)
    );

    map[adj.backendId] += delta;
  });

  // Normalize back to 100
  const total = Object.values(map).reduce((a, b) => a + b, 0);
  Object.keys(map).forEach(k => {
    map[k] = Math.round((map[k] / total) * 100);
  });

  return plan.map(p => ({
    backend: p.backend,
    weight: map[p.backend._id.toString()] || 0
  }));
}

async function buildRoutingPlan(backends, metrics) {
  const healthy = backends.filter(b => {
    const stats = metrics[b._id.toString()];
    return stats && !stats.isIsolated;
  });

  if (!healthy.length) {
    throw new Error("All backends are isolated");
  }

  const scored = healthy.map(b => ({
    backend: b,
    score: calculateScore(metrics[b._id.toString()])
  }));

  let routingPlan = normalizeWeights(scored);

  // ---------- AI ARBITRATION ----------
  if (weightsAreClose(routingPlan)) {
    try {
      const context = {
        backends: routingPlan.map(p => ({
          backendId: p.backend._id.toString(),
          weight: p.weight,
          stats: metrics[p.backend._id.toString()]
        }))
      };

      const aiResponse = await askBedrock(context);

      if (aiResponse && Array.isArray(aiResponse.adjustments)) {
        routingPlan = applyAIAdjustments(
          routingPlan,
          aiResponse.adjustments
        );
      }
    } catch (err) {
      console.log("AI arbitration skipped:", err.message);
    }
  }

  return routingPlan;
}

module.exports = { buildRoutingPlan };
