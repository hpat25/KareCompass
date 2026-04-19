export function adjustCost(provider, userInsurance) {
  if (!userInsurance) {
    return Math.max(provider.baseCost, 100);
  }

  if (provider.acceptsInsurance.includes(userInsurance)) {
    return provider.baseCost * 0.3;
  }

  return provider.baseCost * 1.2;
}
