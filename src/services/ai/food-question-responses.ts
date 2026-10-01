import { AI_SUGGESTION_CATALOG } from '@/data/ai/ai-suggestion-catalog';
import type { AiSuggestion } from '@/types/ai';

import type { AiFoodQuestion } from './food-question-detector';
import type { AiIntent } from './intent-detector';

export interface AiGeneratedReply {
  text: string;
  suggestions?: AiSuggestion[];
}

/** Same stable-hash approach as `response-generator.ts`: deterministic per message, still varied across messages. */
function stableIndex(seed: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return modulo > 0 ? hash % modulo : 0;
}

/** Up to 2 known, already-verified suggestions matching any of the given intents — reused from Part 3's catalog, never fabricated. */
function suggestionsForIntents(intents: AiIntent[]): AiSuggestion[] | undefined {
  const matches = AI_SUGGESTION_CATALOG.filter((e) => e.intents.some((i) => intents.includes(i)));
  return matches.length > 0 ? matches.slice(0, 2).map((e) => e.suggestion) : undefined;
}

interface FoodQuestionAnswer {
  /** 2 short, cautious variants — never a medical claim or diagnosis. */
  variants: string[];
  /** The natural "back to being a food assistant" line, e.g. offering a recommendation. */
  offer?: string;
  /** Only attached when the offer text actually promises a recommendation. */
  intents?: AiIntent[];
}

const ANSWERS: Record<Exclude<AiFoodQuestion, 'NONE'>, FoodQuestionAnswer> = {
  SPICY_HEALTH: {
    variants: [
      'Ăn cay vừa phải thường không có vấn đề với nhiều người, nhưng ăn quá cay hoặc quá thường xuyên có thể gây khó chịu như nóng rát, ợ nóng hoặc đau bụng ở một số người 🌶️',
      'Cay vừa miệng thì thường ổn, nhưng ăn cay nhiều quá hoặc quá thường xuyên đôi khi khiến bụng khó chịu hơn với một số người 🌶️',
    ],
    offer: 'Nếu bạn vẫn muốn ăn cay, mình có thể tìm vài món cay vừa cho bạn nhé.',
    intents: ['SPICY'],
  },
  SWEET_HEALTH: {
    variants: [
      'Ăn đồ ngọt quá thường xuyên có thể khiến lượng đường và năng lượng nạp vào tăng khá nhiều 🍰 Nếu muốn cân bằng hơn, bạn có thể chọn khẩu phần nhỏ hoặc món ít ngọt hơn.',
      'Ăn ngọt nhiều quá, nhất là thường xuyên, có thể khiến bạn nạp thêm khá nhiều đường 🍰 Khẩu phần nhỏ hơn thường sẽ dễ chịu hơn.',
    ],
    offer: 'Mình cũng có thể tìm vài lựa chọn nhẹ nhàng hơn cho bạn.',
    intents: ['SWEET'],
  },
  HEALTHY_FOOD: {
    variants: [
      'Ăn healthy không nhất thiết phải thật khắt khe đâu 😄 Thường chỉ cần ưu tiên rau, đạm phù hợp, tinh bột vừa đủ và hạn chế món quá nhiều dầu hoặc đường.',
      'Ăn healthy đơn giản là cân bằng hơn thôi 😄 Ưu tiên rau, đạm vừa đủ, tinh bột hợp lý, và bớt đồ nhiều dầu mỡ hay đường.',
    ],
    offer: 'Nếu muốn, mình có thể tìm vài món healthy trên EcoBite cho bạn.',
    intents: ['HEALTHY'],
  },
  MEAL_ADVICE: {
    variants: [
      'Buổi nào thì mình cũng thường ưu tiên món vừa đủ no, không quá nhiều dầu mỡ 😄',
      'Mình nghĩ ưu tiên món nhẹ nhàng, vừa đủ no là hợp lý nhất 😄',
    ],
    offer: 'Nếu bạn muốn, mình có thể tìm vài lựa chọn phù hợp trên EcoBite.',
  },
  LATE_NIGHT_EATING: {
    variants: [
      'Ăn quá sát giờ ngủ có thể khiến một số người khó chịu hoặc khó ngủ hơn.',
      'Ăn muộn quá gần giờ ngủ đôi khi khiến bụng khó chịu hoặc ảnh hưởng giấc ngủ với một số người.',
    ],
    offer: 'Nếu phải ăn muộn, bạn có thể ưu tiên khẩu phần vừa phải và món nhẹ hơn nhé.',
    intents: ['LIGHT_MEAL', 'HEALTHY'],
  },
  FULLNESS_ADVICE: {
    variants: [
      'Nếu muốn no lâu, bạn có thể ưu tiên món có đủ đạm, chất xơ và tinh bột vừa phải 🥗',
      'Muốn no lâu thì món có đạm và chất xơ đầy đủ thường hợp hơn 🥗',
    ],
    offer: 'Mình cũng có thể tìm vài lựa chọn no lâu trên EcoBite cho bạn.',
    intents: ['RICE', 'HEALTHY'],
  },
  LIGHT_FOOD: {
    variants: [
      'Nếu muốn ăn nhẹ bụng, mình sẽ ưu tiên các món ít dầu, có rau và khẩu phần vừa phải 🌱',
      'Ăn nhẹ bụng thì nên ưu tiên món ít dầu mỡ, nhiều rau một chút 🌱',
    ],
    offer: 'Mình có thể tìm vài lựa chọn như vậy cho bạn.',
    intents: ['LIGHT_MEAL', 'HEALTHY', 'SALAD'],
  },
  GENERAL_FOOD_QUESTION: {
    variants: [
      'Mình là trợ lý gợi ý món ăn của EcoBite nên chưa trả lời chi tiết câu này được 😄',
      'Câu này thì mình chưa có đủ thông tin để trả lời chi tiết 😄',
    ],
    offer: 'Bạn cứ nói cụ thể hơn bạn đang muốn ăn gì — mình tìm giúp liền nhé.',
  },
};

/** A short, cautious answer for a recognized food question, plus an optional truthful, best-effort recommendation. */
export function generateFoodQuestionReply(question: Exclude<AiFoodQuestion, 'NONE'>, text: string): AiGeneratedReply {
  const answer = ANSWERS[question];
  const body = answer.variants[stableIndex(text, answer.variants.length)];
  const offer = answer.offer ? ` ${answer.offer}` : '';
  return {
    text: `${body}${offer}`,
    suggestions: answer.intents ? suggestionsForIntents(answer.intents) : undefined,
  };
}
