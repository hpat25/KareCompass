import { adjustCost } from "./insurance";

export function affordabilityScore(provider, user) {
  const cost = adjustCost(provider, user.insurance);

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

  //Rating 
  score += provider.rating * 2;

  //between 0–100
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function processProviders(providers, user) {
  const updated = providers.map(p => {
    const adjustedCost = adjustCost(p, user.insurance);
    const score = affordabilityScore(p, user);

    return {
      ...p,
      adjustedCost,
      score
    };
  });

  // sort best → worst
  updated.sort((a, b) => b.score - a.score);

  return updated;
}