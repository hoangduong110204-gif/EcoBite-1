import { AI_FALLBACK_RESPONSE, aiConversationHistory, aiMockResponses } from '@/data/ai';
import type { AiMessage } from '@/types/ai';
import { createId, delay } from '@/utils/async';

import type { AiService } from './types';

/** Keyword-matched canned replies. No model, no network. */
export const mockAiService: AiService = {
  async sendMessage({ text }) {
    await delay(600);
    const lower = text.toLowerCase();
    const match =
      aiMockResponses.find((r) => r.keywords.some((k) => lower.includes(k))) ??
      AI_FALLBACK_RESPONSE;
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
