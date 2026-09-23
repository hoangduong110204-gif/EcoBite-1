import { authReducer, initialAuthState, type AuthEvent, type AuthState } from './auth-state';

/**
 * Session-level auth store (module singleton). Deliberately tiny: no library,
 * no persistence. React reads it through `useAuth` (useSyncExternalStore);
 * plain code and tests use `getAuthState` / `dispatchAuth`.
 */
let state: AuthState = initialAuthState;
const listeners = new Set<() => void>();

export const getAuthState = (): AuthState => state;

export const dispatchAuth = (event: AuthEvent): AuthState => {
  state = authReducer(state, event);
  listeners.forEach((listener) => listener());
  return state;
};

export const subscribeAuth = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Back to a fresh session (tests, sign-out). */
export const resetAuthStore = (): void => {
  state = initialAuthState;
  listeners.forEach((listener) => listener());
};
