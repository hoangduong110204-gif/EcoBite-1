import { AI_SUGGESTION_CATALOG, type AiCatalogEntry } from '@/data/ai/ai-suggestion-catalog';
import type { AiSuggestion } from '@/types/ai';

import type { AiIntent } from './intent-detector';
import { understandAiQuery, type AiConstraints } from './query-understanding';

export interface AiGeneratedReply {
  text: string;
  suggestions?: AiSuggestion[];
}

const MAX_SUGGESTIONS = 2;

/** 2–3 natural variants per intent so the same request doesn't always read identically. */
const FEELING: Partial<Record<AiIntent, string[]>> = {
  SWEET: ['Đang thèm ngọt', 'Thèm món ngọt', 'Muốn ăn gì đó ngọt ngọt'],
  DESSERT: ['Đang thèm tráng miệng', 'Muốn ăn gì đó ngọt tráng miệng'],
  SPICY: ['Ok, hôm nay mình chiều vị cay cho bạn', 'Muốn ăn cay', 'Thèm vị cay đậm đà'],
  HEALTHY: ['Muốn ăn nhẹ nhàng, healthy một chút', 'Đang muốn ăn healthy', 'Muốn ăn lành mạnh'],
  VEGETARIAN: ['Muốn ăn chay', 'Đang tìm món chay'],
  SALAD: ['Muốn ăn salad', 'Thèm rau tươi'],
  NOODLES: ['Thèm món mì'],
  RICE: ['Muốn ăn cơm'],
  DRINK: ['Đang tìm đồ uống'],
  LIGHT_MEAL: ['Muốn ăn nhẹ bụng'],
  BREAKFAST: ['Đang tìm món ăn sáng', 'Muốn ăn sáng'],
  LUNCH: ['Đến giờ ăn trưa rồi', 'Muốn ăn trưa'],
  DINNER: ['Tối nay đang tìm món ăn tối', 'Muốn ăn tối'],
  NEARBY: ['Muốn tìm món gần bạn', 'Đang muốn ăn gần đây'],
  CHEAP: ['Muốn ăn ngon mà vẫn tiết kiệm', 'Đang tìm món giá mềm'],
};

const EMOJI: Partial<Record<AiIntent, string>> = {
  SWEET: '😄',
  DESSERT: '😄',
  SPICY: '🌶️',
  HEALTHY: '🥗',
  VEGETARIAN: '🌱',
  SALAD: '🥗',
  NOODLES: '🍜',
  RICE: '🍚',
  DRINK: '🥤',
  LIGHT_MEAL: '😄',
  BREAKFAST: '😄',
  LUNCH: '😄',
  DINNER: '😄',
  NEARBY: '📍',
  CHEAP: '😄',
};

/** Which intent leads the sentence when several are present (taste/meal-type first, budget/proximity are modifiers). */
const PRIMARY_ORDER: AiIntent[] = [
  'SWEET', 'DESSERT', 'SPICY', 'HEALTHY', 'VEGETARIAN', 'SALAD', 'NOODLES', 'RICE', 'DRINK', 'LIGHT_MEAL',
  'BREAKFAST', 'LUNCH', 'DINNER', 'NEARBY', 'CHEAP',
];

const CLOSINGS = ['Mình tìm vài lựa chọn phù hợp cho bạn nhé.', 'Mình lọc thử vài món hợp với bạn nhé.', 'Mình ưu tiên vài lựa chọn cho bạn nhé.'];

/** Small stable hash so the same message always picks the same variant, but different messages can vary — deterministic, not random. */
function stableIndex(seed: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return modulo > 0 ? hash % modulo : 0;
}

function formatK(value: number): string {
  return value % 1000 === 0 ? `${value / 1000}k` : `${value}đ`;
}

function pickPrimary(intents: AiIntent[]): AiIntent | undefined {
  for (const candidate of PRIMARY_ORDER) if (intents.includes(candidate)) return candidate;
  return intents[0];
}

/** One combined clause, not separate concatenated sentences — e.g. ", mà vẫn giữ ngân sách dưới 50k và muốn tìm chỗ gần đây". */
function buildModifierClause(intents: AiIntent[], constraints: AiConstraints, primary: AiIntent | undefined): string {
  const parts: string[] = [];
  if (intents.includes('CHEAP') && primary !== 'CHEAP') {
    parts.push(constraints.maxPrice !== undefined ? `mà vẫn giữ ngân sách dưới ${formatK(constraints.maxPrice)}` : 'mà giá cũng dễ chịu');
  }
  if (intents.includes('NEARBY') && primary !== 'NEARBY') {
    parts.push('và muốn tìm chỗ gần đây');
  }
  return parts.length > 0 ? `, ${parts.join(' ')}` : '';
}

/**
 * Picks up to `MAX_SUGGESTIONS` known suggestions matching the request. Prefers
 * entries matching the PRIMARY intent (so "món ngọt dưới 50k" surfaces the sweet
 * item, not just any cheap one); among those, entries also satisfying secondary
 * intents (budget/proximity) rank first. When a budget is given, only price-
 * verified entries are used if any exist — otherwise the picks are still returned,
 * but flagged unverified so the caller can add a truthful caveat instead of
 * claiming a price it cannot confirm.
 */
function selectSuggestions(intents: AiIntent[], constraints: AiConstraints, primary: AiIntent | undefined): { suggestions: AiSuggestion[]; priceVerified: boolean } {
  const withPrimary = primary ? AI_SUGGESTION_CATALOG.filter((e) => e.intents.includes(primary)) : [];
  const pool = withPrimary.length > 0 ? withPrimary : AI_SUGGESTION_CATALOG.filter((e) => e.intents.some((i) => intents.includes(i)));
  if (pool.length === 0) return { suggestions: [], priceVerified: true };

  const secondary = intents.filter((i) => i !== primary);
  const ranked = [...pool].sort((a, b) => {
    const scoreOf = (e: AiCatalogEntry) => secondary.filter((i) => e.intents.includes(i)).length;
    return scoreOf(b) - scoreOf(a);
  });

  if (constraints.maxPrice === undefined) {
    return { suggestions: ranked.slice(0, MAX_SUGGESTIONS).map((e) => e.suggestion), priceVerified: true };
  }

  const verified = ranked.filter((e) => e.priceValue !== undefined && e.priceValue <= constraints.maxPrice!);
  if (verified.length > 0) return { suggestions: verified.slice(0, MAX_SUGGESTIONS).map((e) => e.suggestion), priceVerified: true };
  return { suggestions: ranked.slice(0, MAX_SUGGESTIONS).map((e) => e.suggestion), priceVerified: false };
}

/**
 * Turns one message into a natural reply + (best-effort, truthful) recommendation,
 * using the structured understanding from `understandAiQuery`. Returns `undefined`
 * for pure UNKNOWN input — Part 5 owns off-topic handling; the caller keeps its
 * existing fallback for now.
 */
export function generateReply(text: string): AiGeneratedReply | undefined {
  const { intents, constraints } = understandAiQuery(text);
  if (intents.length === 1 && intents[0] === 'UNKNOWN') return undefined;

  const primary = pickPrimary(intents);
  const feelingOptions = (primary && FEELING[primary]) || ['Mình hiểu ý bạn rồi'];
  const feeling = feelingOptions[stableIndex(text, feelingOptions.length)];
  const modifier = buildModifierClause(intents, constraints, primary);
  const emoji = (primary && EMOJI[primary]) || '😄';

  const { suggestions, priceVerified } = selectSuggestions(intents, constraints, primary);

  const tail =
    constraints.maxPrice !== undefined && !priceVerified
      ? `Mình chưa thấy lựa chọn nào mình có thể xác nhận chắc chắn là dưới ${formatK(constraints.maxPrice)} trong dữ liệu hiện tại 😅 Mình đưa bạn vài lựa chọn gần nhất nhé.`
      : CLOSINGS[stableIndex(`${text}#closing`, CLOSINGS.length)];

  return {
    text: `${feeling}${modifier} đúng không ${emoji} ${tail}`,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}
