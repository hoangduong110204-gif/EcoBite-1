import { useCallback, useState, useSyncExternalStore } from 'react';

import { AI_GREETING, aiQuickPrompts } from '@/data/ai';
import { aiService } from '@/services/ai';
import type { AiMessage } from '@/types/ai';
import { createId } from '@/utils/async';

import { appendChatMessage, getChatMessages, subscribeChat } from './chat-store';

/** Chat state for the AI Assistant screen. Mock replies only; the conversation lives in the session store. */
export function useAiChat() {
  const messages = useSyncExternalStore(subscribeChat, getChatMessages, getChatMessages);
  const [isReplying, setIsReplying] = useState(false);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isReplying) return;
      const userMessage: AiMessage = {
        id: createId('msg'),
        role: 'user',
        text: trimmed,
        createdAt: new Date().toISOString(),
      };
      appendChatMessage(userMessage);
      setIsReplying(true);
      try {
        const reply = await aiService.sendMessage({ text: trimmed, history: getChatMessages() });
        appendChatMessage(reply);
      } finally {
        setIsReplying(false);
      }
    },
    [isReplying],
  );

  return { messages, isReplying, send, greeting: AI_GREETING, quickPrompts: aiQuickPrompts };
}
