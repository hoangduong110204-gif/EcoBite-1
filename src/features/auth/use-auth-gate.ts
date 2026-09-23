import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { getProtectedRedirect } from './auth-routing';
import { useAuth } from './use-auth';

/**
 * Root guard (mounted once in the root layout): a signed-out or half-set-up
 * customer cannot stay on any protected route (Orders, Account, Cart, …). After
 * logout the session is fresh, so this sends the customer back to the auth flow.
 */
export function useAuthGate(): void {
  const router = useRouter();
  const segments = useSegments();
  const navigationReady = useRootNavigationState()?.key !== undefined;
  const state = useAuth();
  const redirect = getProtectedRedirect(state, segments);
  useEffect(() => {
    if (navigationReady && redirect) router.replace(redirect);
  }, [navigationReady, redirect, router]);
}
