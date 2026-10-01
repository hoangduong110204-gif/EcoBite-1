import type { ImageSourcePropType } from 'react-native';

import { getFoodBagImage, getRestaurantImage } from '@/media/images';

export interface AiRecommendationPresentation {
  /** Real bundled photo (same registry every other screen uses) — never a remote URL or gradient placeholder. */
  image?: ImageSourcePropType;
  /** Pre-formatted display string, e.g. "45.000đ". */
  price?: string;
  /** Pre-formatted display string, e.g. "4.7". */
  rating?: string;
}

/**
 * Presentation-only mock data for AI recommendation cards, keyed by the suggestion's
 * own `{type, id}` (the only thing `AiSuggestion` ever carries). Hand-authored to
 * match the real catalog mock for display purposes only — this file never imports
 * `@/data/mock` or a core catalog type, so the AI module stays isolated. Kept
 * deliberately small (photo, price, rating): the recommendation panel is a compact
 * conversational aside, not a product listing.
 *
 * Deliberately NOT re-exported from `data/ai/index.ts`: it's the only `data/ai` file
 * that touches `@/media/images`, whose `require('*.jpg')` calls only Metro can
 * resolve. Import it directly (`@/data/ai/recommendation-presentations`).
 */
const PRESENTATIONS: Record<string, AiRecommendationPresentation> = {
  'food-bag:bag_04': { image: getFoodBagImage('bag_04'), price: '45.000đ', rating: '4.7' },
  'food-bag:bag_08': { image: getFoodBagImage('bag_08'), price: '38.000đ', rating: '4.6' },
  'food-bag:bag_05': { image: getFoodBagImage('bag_05'), price: '52.000đ', rating: '4.9' },
  'food-bag:bag_06': { image: getFoodBagImage('bag_06'), price: '25.000đ', rating: '4.5' },
  'restaurant:res_03': { image: getRestaurantImage('res_03'), rating: '4.7' },
  'restaurant:res_06': { image: getRestaurantImage('res_06'), rating: '4.5' },
};

export function getRecommendationPresentation(type: 'restaurant' | 'food-bag', id: string): AiRecommendationPresentation | undefined {
  return PRESENTATIONS[`${type}:${id}`];
}
