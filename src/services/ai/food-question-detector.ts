/**
 * Part 4 — a higher-level classifier that runs BEFORE the Part 1–3 pipeline: is
 * this message a food-related QUESTION (asking for advice/explanation) rather than
 * a recommendation request? If so, it gets its own short, cautious answer instead
 * of being pushed through `understandAiQuery` → `generateReply` as a catalog search.
 *
 * Deliberately does not use `\b` word-boundary regex: without the Unicode flag,
 * JS treats Vietnamese diacritic letters (đ, ọ, ắ, …) as non-word characters, so
 * `\bcó\b` silently fails to match "có" once it sits next to one. Plain substring
 * checks on normalized (lowercased, single-spaced) text avoid that trap entirely.
 */
export type AiFoodQuestion =
  | 'SPICY_HEALTH'
  | 'SWEET_HEALTH'
  | 'HEALTHY_FOOD'
  | 'MEAL_ADVICE'
  | 'LATE_NIGHT_EATING'
  | 'FULLNESS_ADVICE'
  | 'LIGHT_FOOD'
  | 'GENERAL_FOOD_QUESTION'
  | 'NONE';

const MEAL_TIME_WORDS = ['sáng', 'trưa', 'tối'];
const LATE_NIGHT_PHRASES = ['ăn tối muộn', 'ăn đêm', 'ăn khuya'];
const FULLNESS_PHRASES = ['no lâu', 'ăn gì cho no'];
const LIGHT_FOOD_PHRASES = ['nhẹ bụng', 'ít dầu', 'dầu mỡ'];
/** A light-food phrase alone ("nhẹ bụng") is also a Part 1 recommendation trigger; only count it as a
 * QUESTION when it is actually framed as one ("món NÀO nhẹ bụng?", "ăn GÌ nhẹ bụng?"). */
const QUESTION_WORDS = ['nào', 'gì'];
const GENERAL_PHRASES = ['là gì', 'có ngon không', 'gợi ý món', 'nên ăn gì'];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[.,!?;:'"“”()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "có ... không" — the generic Vietnamese yes/no question shape ("có tốt không?", "có sao không?", "có hại không?"). */
function isYesNoQuestion(t: string): boolean {
  return t.includes('có') && t.includes('không');
}

export function detectFoodQuestion(text: string): AiFoodQuestion {
  const t = normalize(text);
  if (!t) return 'NONE';

  const yesNo = isYesNoQuestion(t);
  const explains = t.includes('là gì') || t.includes('như thế nào');

  if (yesNo && t.includes('cay')) return 'SPICY_HEALTH';
  if (yesNo && t.includes('ngọt')) return 'SWEET_HEALTH';
  if ((yesNo || explains || t.includes('gì')) && (t.includes('healthy') || t.includes('lành mạnh'))) return 'HEALTHY_FOOD';
  if (yesNo && LATE_NIGHT_PHRASES.some((p) => t.includes(p))) return 'LATE_NIGHT_EATING';

  if (t.includes('nên ăn gì') && MEAL_TIME_WORDS.some((w) => t.includes(w))) return 'MEAL_ADVICE';

  if (FULLNESS_PHRASES.some((p) => t.includes(p))) return 'FULLNESS_ADVICE';

  if (LIGHT_FOOD_PHRASES.some((p) => t.includes(p)) && QUESTION_WORDS.some((w) => t.includes(w))) return 'LIGHT_FOOD';

  if (GENERAL_PHRASES.some((p) => t.includes(p))) return 'GENERAL_FOOD_QUESTION';

  return 'NONE';
}
