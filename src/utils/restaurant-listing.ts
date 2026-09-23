import type { Category, FoodBag, Restaurant, RestaurantListing } from '@/types';

/** Category id meaning "no category filter". */
export const ALL_CATEGORY_ID = 'cat_all';

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
};

/**
 * Joins restaurants with their bags and category. Pure: the caller passes the
 * catalog it loaded from `services/api`. Order of `restaurants` is kept.
 */
export function buildRestaurantListings(
  restaurants: Restaurant[],
  bags: FoodBag[],
  categories: Category[],
): RestaurantListing[] {
  return restaurants.map((restaurant) => {
    const own = bags.filter((b) => b.restaurantId === restaurant.id);
    const available = own.filter((b) => b.left > 0);
    const featuredBag = available[0] ?? null;
    const earliest = available.reduce<FoodBag | null>(
      (first, b) => (!first || toMinutes(b.pickupWindow.start) < toMinutes(first.pickupWindow.start) ? b : first),
      null,
    );
    return {
      restaurant,
      categoryName: categories.find((c) => c.id === restaurant.categoryId)?.name ?? '',
      bags: own,
      availableCount: available.reduce((sum, b) => sum + b.left, 0),
      featuredBag,
      pickupWindowLabel: earliest ? earliest.pickupWindow.label : null,
      soldOut: available.length === 0,
    };
  });
}

/** Category filter for Home. `cat_all` (or no id) keeps everything. */
export function filterByCategory(listings: RestaurantListing[], categoryId: string | null | undefined): RestaurantListing[] {
  return !categoryId || categoryId === ALL_CATEGORY_ID
    ? listings
    : listings.filter((l) => l.restaurant.categoryId === categoryId);
}

/**
 * Mock "location-based" ordering: the selected area's restaurants come first,
 * the rest keep their order. No distance maths, no GPS.
 */
export function sortByArea(listings: RestaurantListing[], areaId: string | null | undefined): RestaurantListing[] {
  if (!areaId) return listings;
  const rank = (l: RestaurantListing) => (l.restaurant.areaId === areaId ? 0 : 1);
  return listings
    .map((l, index) => ({ l, index }))
    .sort((a, b) => rank(a.l) - rank(b.l) || a.index - b.index)
    .map(({ l }) => l);
}

/** Lookup for Restaurant Detail. `null` for an unknown id (screen shows the not-found state). */
export function findListing(listings: RestaurantListing[], restaurantId: string | undefined): RestaurantListing | null {
  return listings.find((l) => l.restaurant.id === restaurantId) ?? null;
}
