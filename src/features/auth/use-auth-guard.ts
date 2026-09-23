import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { canAccessAuthScreen, resolveAuthRoute, type AuthScreen } from './auth-routing';
import { useAuth } from './use-auth';

/**
 * Redirects to the route the customer belongs on when this auth screen is
 * not valid for the current session state (deep links, dev reloads, back
 * navigation). Returns whether the screen may render.
 */
export function useAuthGuard(screen: AuthScreen): boolean {
  const router = useRouter();
  const state = useAuth();
  const allowed = canAccessAuthScreen(state, screen);
  const target = resolveAuthRoute(state);
  useEffect(() => {
    if (!allowed) router.replace(target);
  }, [allowed, router, target]);
  return allowed;
}
