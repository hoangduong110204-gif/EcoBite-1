import { mockAuthService } from './mock-auth';

export type { AuthAccount, AuthService, RegisterError } from './types';

/** Swap for a real auth client later; consumers do not change. */
export const authService = mockAuthService;
