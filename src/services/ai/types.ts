import type { AiConversationSummary, AiMessage, AiRequest } from '@/types/ai';

/** Contract for the AI backend. Today: mock. Later: a real AI API. */
export interface AiService {
  /** Returns the assistant reply to the user's message. */
  sendMessage(request: AiRequest): Promise<AiMessage>;
  /** Conversation history list (screen 11.5). */
  listConversations(): Promise<AiConversationSummary[]>;
}
