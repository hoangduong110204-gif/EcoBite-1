import type { FoodBag, RestaurantListing } from '@/types';

/** Bags to show on Restaurant Detail: available first, sold-out last (catalog order otherwise). */
export function orderBagsForDetail(bags: FoodBag[]): FoodBag[] {
  return bags
    .map((b, index) => ({ b, index }))
    .sort((x, y) => Number(x.b.left <= 0) - Number(y.b.left <= 0) || x.index - y.index)
    .map(({ b }) => b);
}

/**
 * Where the bottom button leads: the first bag that is still available. Food
 * Bag Detail is built in U1.4; its route already exists.
 */
export function getPrimaryBag(listing: RestaurantListing): FoodBag | null {
  return orderBagsForDetail(listing.bags).find((b) => b.left > 0) ?? null;
}
