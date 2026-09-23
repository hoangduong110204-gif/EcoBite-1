import { useSyncExternalStore } from 'react';

import { getAuthProfile, getAuthStage, type AuthState } from './auth-state';
import { getAuthState, subscribeAuth } from './auth-store';

/** Reactive view of the session auth state (survives navigation, resets on reload). */
export function useAuth(): AuthState & {
  profile: ReturnType<typeof getAuthProfile>;
  stage: ReturnType<typeof getAuthStage>;
} {
  const state = useSyncExternalStore(subscribeAuth, getAuthState, getAuthState);
  return { ...state, profile: getAuthProfile(state), stage: getAuthStage(state) };
}
