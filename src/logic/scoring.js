import { adjustCost } from "./insurance";

export function affordabilityScore(provider, user) {
  const cost = adjustCost(provider, user.insurance);

  // Start from a perfect score and subtract cost/access barriers.
  let score=100;

  //Cost impact
  if (cost >user.budget) {
    score -= 40;
  } else {
    score -= (cost/user.budget) * 30;
  }

  //Wait time 
  score -= provider.waitTimeDays * 2;

  //Distance 
  score -= provider.distanceMiles * 1.5;

  score += provider.rating * 2;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function processProviders(providers, user) {
  const updated = providers.map(p => {
    const adjustedCost = adjustCost(p, user.insurance);

    const affordability = affordabilityScore(p, user);
    const accessibility = accessibilityScore(p);

    const finalScore = (affordability * 0.6) + (accessibility * 0.4);

    return {
      ...p,
      adjustedCost,
      affordabilityScore: affordability,
      accessibilityScore: accessibility,
      finalScore: Math.round(finalScore)
    };
  });

  // Sort highest-scoring providers to the top for ranking and AI fallback.
  updated.sort((a, b) => b.finalScore - a.finalScore);

  return updated;
}


export function accessibilityScore(provider) {
  let score = 100;

  score -= provider.waitTimeDays * 5;

  //distance
  score -= provider.distanceMiles * 2;

  if (provider.telehealth) {
    score += 15;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
