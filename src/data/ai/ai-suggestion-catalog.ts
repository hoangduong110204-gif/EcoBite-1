import type { AiIntent } from '@/services/ai/intent-detector';
import type { AiSuggestion } from '@/types/ai';

import { aiMockResponses } from './responses';

interface SuggestionFacts {
  /** Which intents this suggestion genuinely satisfies. Hand-tagged, never inferred. */
  intents: AiIntent[];
  /** VND. Hand-verified against the real catalog mock — never fabricated. Absent when unknown. */
  priceValue?: number;
  /** km. Hand-verified against the real catalog mock. Absent when unknown. */
  distanceKm?: number;
}

/**
 * Verified facts per suggestion id, kept apart from the display strings in
 * `recommendation-presentations.ts` on purpose: that file imports `@/media/images`
 * (real `require('*.jpg')` calls Metro resolves), which would crash
 * `scripts/verify-foundation.ts` if pulled into the service layer it eagerly
 * imports under plain Node. This file has no such import, so it is safe there.
 */
const FACTS: Record<string, SuggestionFacts> = {
  sg_bag_04: { intents: ['SPICY', 'CHEAP', 'NOODLES'], priceValue: 45000, distanceKm: 0.8 },
  sg_bag_08: { intents: ['SPICY', 'CHEAP', 'RICE'], priceValue: 38000, distanceKm: 2.1 },
  sg_bag_05: { intents: ['HEALTHY', 'SALAD'], priceValue: 52000, distanceKm: 1.8 },
  sg_bag_06: { intents: ['SWEET', 'DESSERT'], priceValue: 25000, distanceKm: 0.9 },
  sg_res_03: { intents: ['NEARBY', 'SPICY', 'NOODLES'], distanceKm: 0.8 },
  sg_res_06: { intents: ['NEARBY', 'SWEET', 'DESSERT'], distanceKm: 0.9 },
};

export interface AiCatalogEntry {
  suggestion: AiSuggestion;
  intents: AiIntent[];
  priceValue?: number;
  distanceKm?: number;
}

/**
 * Every known suggestion across the existing mock responses, tagged with the
 * intents it satisfies and its verified price/distance. Built from
 * `aiMockResponses` (single source of truth for the suggestion objects
 * themselves) rather than duplicating them.
 */
export const AI_SUGGESTION_CATALOG: AiCatalogEntry[] = aiMockResponses
  .flatMap((response) => response.suggestions ?? [])
  .map((suggestion) => {
    const facts = FACTS[suggestion.id];
    return { suggestion, intents: facts?.intents ?? [], priceValue: facts?.priceValue, distanceKm: facts?.distanceKm };
  });
