import type { AiMessage } from '@/types/ai';

/**
 * Session-level conversation (module singleton, no persistence, resets on reload),
 * so the chat survives leaving and reopening the assistant. Same pattern as the cart store.
 */
let messages: AiMessage[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const getChatMessages = (): AiMessage[] => messages;
export const appendChatMessage = (message: AiMessage) => {
  messages = [...messages, message];
  emit();
};
export const resetChatStore = () => {
  messages = [];
  emit();
};
export const subscribeChat = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
