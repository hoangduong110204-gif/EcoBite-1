import { mockApi } from './mock-api';

export type { EcoBiteApi } from './types';

/** Swap this binding for a real client later; consumers don't change. */
export const api = mockApi;
