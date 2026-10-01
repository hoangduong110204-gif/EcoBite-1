import { AI_FALLBACK_RESPONSE, aiConversationHistory, aiMockResponses } from '@/data/ai';
import type { AiMessage } from '@/types/ai';
import { createId, delay } from '@/utils/async';

import { detectFoodQuestion } from './food-question-detector';
import { generateFoodQuestionReply } from './food-question-responses';
import { generateReply } from './response-generator';
import type { AiService } from './types';

/**
 * Message flow: is this a food-related QUESTION (asking for advice, Part 4) rather
 * than a recommendation request? If so, answer it directly and stop there. Otherwise
 * fall through to the existing Part 1–3 pipeline: literal keyword match first
 * (unchanged, byte-for-byte, so every existing exact-phrase test keeps passing),
 * then `generateReply`'s structured understanding. Only pure UNKNOWN input still
 * falls through to the generic fallback.
 */
export const mockAiService: AiService = {
  async sendMessage({ text }) {
    await delay(600);

    const question = detectFoodQuestion(text);
    if (question !== 'NONE') {
      const answer = generateFoodQuestionReply(question, text);
      return { id: createId('ai'), role: 'assistant', text: answer.text, createdAt: new Date().toISOString(), suggestions: answer.suggestions };
    }

    const lower = text.toLowerCase();
    const byKeyword = aiMockResponses.find((r) => r.keywords.some((k) => lower.includes(k)));
    const generated = byKeyword ? undefined : generateReply(text);
    const match = byKeyword ?? generated ?? AI_FALLBACK_RESPONSE;
    const reply: AiMessage = {
      id: createId('ai'),
      role: 'assistant',
      text: match.text,
      createdAt: new Date().toISOString(),
      suggestions: match.suggestions,
    };
    return reply;
  },

  async listConversations() {
    await delay(200);
    return aiConversationHistory;
  },
};
