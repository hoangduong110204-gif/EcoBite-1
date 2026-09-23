import { useRouter, type Href } from 'expo-router';
import { useCallback } from 'react';

/** Goes back when there is history, otherwise replaces with `fallback` (deep links, redirects). */
export function useBack(fallback: Href) {
  const router = useRouter();
  return useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
  }, [router, fallback]);
}
