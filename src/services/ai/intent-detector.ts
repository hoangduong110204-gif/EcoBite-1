/**
 * Part 1 — intent detection only. Turns a free-form Vietnamese message into a set
 * of food-related intents. No filtering, no recommendation logic, no memory: that
 * is later work. Pure string matching, no imports — stays trivially inside the AI
 * module's isolation boundary.
 */
export type AiIntent =
  | 'SWEET'
  | 'SPICY'
  | 'HEALTHY'
  | 'CHEAP'
  | 'BREAKFAST'
  | 'LUNCH'
  | 'DINNER'
  | 'DRINK'
  | 'NOODLES'
  | 'RICE'
  | 'SALAD'
  | 'DESSERT'
  | 'LIGHT_MEAL'
  | 'VEGETARIAN'
  | 'NEARBY'
  | 'UNKNOWN';

/** An intent fires when any of its phrases appears in the normalized text. */
interface IntentRule {
  intent: Exclude<AiIntent, 'UNKNOWN'>;
  phrases: string[];
}

/**
 * Straightforward "any phrase present → intent" rules. `CHEAP` and `NEARBY` are
 * handled separately below: both need a little more care to avoid false positives
 * (a bare "giá" or "gần" does not always mean budget / proximity).
 */
const RULES: IntentRule[] = [
  { intent: 'SWEET', phrases: ['ngọt', 'tráng miệng', 'dessert'] },
  { intent: 'DESSERT', phrases: ['tráng miệng', 'dessert'] },
  { intent: 'SPICY', phrases: ['cay', 'spicy'] },
  { intent: 'HEALTHY', phrases: ['healthy', 'lành mạnh', 'nhẹ bụng', 'ít dầu', 'nhiều rau'] },
  { intent: 'BREAKFAST', phrases: ['ăn sáng', 'bữa sáng', 'món sáng', 'buổi sáng'] },
  { intent: 'LUNCH', phrases: ['ăn trưa', 'bữa trưa', 'món trưa', 'buổi trưa'] },
  { intent: 'DINNER', phrases: ['ăn tối', 'bữa tối', 'món tối', 'buổi tối'] },
  { intent: 'DRINK', phrases: ['đồ uống', 'nước uống', 'uống gì', 'nước'] },
  { intent: 'NOODLES', phrases: ['mì'] },
  { intent: 'RICE', phrases: ['cơm'] },
  { intent: 'SALAD', phrases: ['salad', 'rau'] },
  { intent: 'VEGETARIAN', phrases: ['đồ chay', 'món chay', 'ăn chay'] },
  { intent: 'LIGHT_MEAL', phrases: ['ăn nhẹ', 'món nhẹ', 'nhẹ bụng'] },
];

/** Phrases that always mean a budget preference, regardless of a bare "giá" elsewhere in the message. */
const CHEAP_PHRASES = ['rẻ', 'tiết kiệm', 'giá mềm'];
/** "dưới 50k", "dưới 40 nghìn" — a price ceiling is a budget signal even without the word "rẻ". */
const BUDGET_CEILING = /\bdưới\s*\d/;

/** Phrases that always mean "near me/here"; a bare "gần" counts too, unless it is asking about time ("gần mấy giờ?"). */
const NEARBY_PHRASES = ['gần đây', 'gần mình', 'gần tôi', 'quanh đây', 'gần chỗ tôi'];

/** Lowercase, trim, collapse whitespace and strip common punctuation for consistent phrase matching. */
export function normalizeAiText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[.,!?;:'"“”()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detects every food-related intent in a Vietnamese message (e.g. "món ngọt dưới
 * 50k" → `['SWEET', 'CHEAP']`), or `['UNKNOWN']` when nothing food-related is
 * recognized. Detection only — callers decide what, if anything, to do with it.
 */
export function detectIntents(text: string): AiIntent[] {
  const t = normalizeAiText(text);
  if (!t) return ['UNKNOWN'];

  const intents = new Set<AiIntent>();

  for (const rule of RULES) {
    if (rule.phrases.some((phrase) => t.includes(phrase))) intents.add(rule.intent);
  }

  if (CHEAP_PHRASES.some((phrase) => t.includes(phrase)) || BUDGET_CEILING.test(t)) {
    intents.add('CHEAP');
  }

  if (NEARBY_PHRASES.some((phrase) => t.includes(phrase)) || (t.includes('gần') && !t.includes('giờ'))) {
    intents.add('NEARBY');
  }

  return intents.size > 0 ? [...intents] : ['UNKNOWN'];
}
