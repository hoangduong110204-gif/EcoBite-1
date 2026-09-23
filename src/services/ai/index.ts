import { mockAiService } from './mock-ai';

export type { AiService } from './types';

/** Swap for a real AI backend client later. */
export const aiService = mockAiService;
