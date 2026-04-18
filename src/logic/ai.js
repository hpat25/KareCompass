export function getAIRecommendation(providers) {
  if (!providers.length) {
    return "No providers found.";
  }

  const best = providers[0];

  return `Best option: ${best.name}.
Estimated cost: $${best.adjustedCost.toFixed(2)}.
Score: ${best.score}/100.
This option is recommended based on affordability, distance, and wait time.`;
}