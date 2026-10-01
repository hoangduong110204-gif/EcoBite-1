import { detectIntents, type AiIntent } from './intent-detector';

/**
 * Part 2 — combines intents with numeric constraints extracted from the same
 * message. Still detection only: no filtering, no recommendation selection, no
 * response generation. Composes on top of Part 1's `detectIntents` rather than
 * duplicating it.
 */
export interface AiConstraints {
  /** In VND, e.g. "dưới 50k" → 50000. Absent when no budget is expressed. */
  maxPrice?: number;
  nearby?: boolean;
}

export interface AiQueryUnderstanding {
  intents: AiIntent[];
  constraints: AiConstraints;
}

/** A price ceiling / approximate budget, e.g. "dưới", "không quá", "tối đa", "ít hơn", "<=". */
const CEILING_PHRASES = ['dưới', 'không quá', 'tối đa', 'ít hơn', '<='];
/** "tầm 50k", "khoảng 50k", "~50k" — an approximate amount still reads as a budget. */
const APPROX_PHRASES = ['tầm', 'khoảng', '~'];
/**
 * Signals the number is cash on hand, not a spending limit — e.g. "mình có 100k
 * tiền mặt". Deliberately specific (not the bare word "có", which shows up in
 * plenty of unrelated budget requests like "có gì dưới 40k").
 */
const POSSESSION_PHRASES = ['tiền mặt', 'cầm theo', 'mang theo'];

/** Finds a Vietnamese price-shaped number in the text and returns its value in VND, or `undefined` if none. */
function parsePriceValue(t: string): number | undefined {
  // grouped-thousands, e.g. "50.000", "50,000", "1.250.000"
  const grouped = t.match(/\b\d{1,3}(?:[.,]\d{3})+\b/);
  if (grouped) return Number(grouped[0].replace(/[.,]/g, ''));

  // "50k", "40 k"
  const withK = t.match(/\b(\d+)\s*k\b/);
  if (withK) return Number(withK[1]) * 1000;

  // "50 nghìn", "50 ngàn"
  const withThousandWord = t.match(/\b(\d+)\s*(nghìn|ngàn)\b/);
  if (withThousandWord) return Number(withThousandWord[1]) * 1000;

  // a bare amount already in đồng, e.g. "50000" (4+ digits, no separators/unit)
  const bare = t.match(/\b\d{4,}\b/);
  if (bare) return Number(bare[0]);

  return undefined;
}

/**
 * `maxPrice`, conservatively: a price-shaped number must be present AND the
 * message must actually express a limit (a ceiling/approx phrase), OR — for a
 * bare mention like "50k" with no other context either way — just the number
 * itself. A number that reads as cash on hand ("100k tiền mặt") without any
 * ceiling/approx phrase is NOT treated as a budget.
 */
function detectMaxPrice(text: string): number | undefined {
  const t = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const price = parsePriceValue(t);
  if (price === undefined) return undefined;

  if (CEILING_PHRASES.some((p) => t.includes(p)) || APPROX_PHRASES.some((p) => t.includes(p))) return price;
  if (POSSESSION_PHRASES.some((p) => t.includes(p))) return undefined;
  return price;
}

/** Constraints only; pass already-detected intents to avoid running `detectIntents` twice. */
export function detectConstraints(text: string, intents: AiIntent[] = detectIntents(text)): AiConstraints {
  const constraints: AiConstraints = {};
  const maxPrice = detectMaxPrice(text);
  if (maxPrice !== undefined) constraints.maxPrice = maxPrice;
  if (intents.includes('NEARBY')) constraints.nearby = true;
  return constraints;
}

/** Structured understanding of one message: every detected intent plus any budget/proximity constraint. */
export function understandAiQuery(text: string): AiQueryUnderstanding {
  const intents = detectIntents(text);
  return { intents, constraints: detectConstraints(text, intents) };
}
