export function adjustCost(provider, userInsurance) {
  if (!userInsurance) {
    return provider.baseCost;
  }

  if (provider.acceptsInsurance.includes(userInsurance)) {
    return provider.baseCost * 0.3;
  }

  return provider.baseCost * 1.2;
}