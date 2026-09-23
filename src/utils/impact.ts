import { IMPACT_PER_BAG } from '@/constants/policy';

/** Food saved and CO₂ avoided by `bagCount` bags (1 bag ≈ 1,2 kg food ≈ 2,5 kg CO₂), rounded to 1 decimal. */
export const calcImpact = (bagCount: number): { foodKg: number; co2Kg: number } => ({
  foodKg: Math.round(bagCount * IMPACT_PER_BAG.foodKg * 10) / 10,
  co2Kg: Math.round(bagCount * IMPACT_PER_BAG.co2Kg * 10) / 10,
});

/** Number of bag units in a list of order / cart lines. */
export const countBags = (lines: { quantity: number }[]): number => lines.reduce((sum, l) => sum + l.quantity, 0);
