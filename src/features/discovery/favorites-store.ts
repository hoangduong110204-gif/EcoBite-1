import { useSyncExternalStore } from 'react';

/**
 * Session-level favourites for the heart buttons on Home (module singleton, no
 * persistence, resets on reload and on logout). There is no saved-restaurants
 * screen yet (reference 3.10 is not built): this only remembers the taps.
 */
export type FavoriteKind = 'restaurant' | 'food-bag';

let favorites: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();

export const favoriteKey = (kind: FavoriteKind, id: string): string => `${kind}:${id}`;
export const getFavorites = (): ReadonlySet<string> => favorites;
export const subscribeFavorites = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function toggleFavorite(kind: FavoriteKind, id: string): boolean {
  const key = favoriteKey(kind, id);
  const next = new Set(favorites);
  const on = !next.delete(key);
  if (on) next.add(key);
  favorites = next;
  listeners.forEach((l) => l());
  return on;
}

export function resetFavoritesStore() {
  favorites = new Set();
  listeners.forEach((l) => l());
}

export function useFavorites() {
  const current = useSyncExternalStore(subscribeFavorites, getFavorites, getFavorites);
  return { isFavorite: (kind: FavoriteKind, id: string) => current.has(favoriteKey(kind, id)), toggle: toggleFavorite };
}
