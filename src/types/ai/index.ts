/**
 * AI module types. Deliberately independent of the core ordering types:
 * suggestions reference core entities by id only.
 */

export type AiMessageRole = 'user' | 'assistant';

export interface AiSuggestion {
  id: string;
  label: string;
  /** Loosely coupled reference to a core entity, resolved by the UI layer. */
  target?: { type: 'restaurant' | 'food-bag'; id: string };
  /** Explicit reasons why this was suggested (screen 11.4). */
  reasons?: string[];
}

export interface AiMessage {
  id: string;
  role: AiMessageRole;
  text: string;
  createdAt: string;
  suggestions?: AiSuggestion[];
}

export interface AiMockResponse {
  /** Lower-case keywords; the first response with a matching keyword wins. */
  keywords: string[];
  text: string;
  suggestions?: AiSuggestion[];
}

export interface AiRequest {
  text: string;
  history: AiMessage[];
}

/** One row of the conversation history list (screen 11.5). */
export interface AiConversationSummary {
  id: string;
  emoji: string;
  title: string;
  /** Display string, e.g. "17:28" or "10/09". */
  when: string;
  suggestionCount: number;
  group: 'today' | 'earlier';
}
