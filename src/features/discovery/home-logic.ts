import type { CategoryIconKey } from '@/constants/home';
import type { Area, Category, FoodBag, Restaurant, RestaurantListing } from '@/types';
import { ALL_CATEGORY_ID, filterByCategory, sortByArea } from '@/utils/restaurant-listing';

export interface HomeView {
  /** The area picked on Select Location (auth session), or null before it was chosen. */
  area: Area | null;
  categoryId: string;
  /** Restaurants to show: filtered by category, the selected area's ones first. */
  restaurants: RestaurantListing[];
}

/**
 * Home content (3.1). With the "Tất cả" category Home exposes all six demo
 * restaurants; the selected area only decides the order (mock location logic,
 * no GPS or distance maths).
 */
export function getHomeView(
  listings: RestaurantListing[],
  area: Area | null,
  categoryId: string = ALL_CATEGORY_ID,
): HomeView {
  return {
    area,
    categoryId,
    restaurants: sortByArea(filterByCategory(listings, categoryId), area?.id),
  };
}

/**
 * The six categories Home shows, in order (reference 1): each with its own vector
 * illustration (never a photo). Other catalog categories (Bánh, Chay) are not on Home.
 */
const HOME_CATEGORY_ICONS: Record<string, CategoryIconKey> = {
  cat_all: 'all',
  cat_rice: 'rice',
  cat_noodle: 'noodle',
  cat_healthy: 'healthy',
  cat_dessert: 'dessert',
  cat_drink: 'drink',
};

export interface HomeCategory {
  category: Category;
  icon: CategoryIconKey;
}

export function getHomeCategories(categories: readonly Category[]): HomeCategory[] {
  return Object.keys(HOME_CATEGORY_ICONS).flatMap((id) => {
    const category = categories.find((c) => c.id === id);
    return category ? [{ category, icon: HOME_CATEGORY_ICONS[id] }] : [];
  });
}

export interface PopularBag {
  bag: FoodBag;
  restaurant: Restaurant;
  /** Whole-number discount vs the original price. */
  discountPercent: number;
}

/**
 * "Phổ biến hôm nay": bags that can still be bought (never a sold-out one), best-rated
 * restaurant first, then the biggest discount, then catalog order. Pure; no new data.
 */
export function getPopularBags(listings: readonly RestaurantListing[], limit = 6): PopularBag[] {
  const all = listings.flatMap(({ restaurant, bags }) =>
    bags
      .filter((bag) => bag.left > 0)
      .map((bag) => ({
        bag,
        restaurant,
        discountPercent: bag.originalPrice > 0 ? Math.round(((bag.originalPrice - bag.price) / bag.originalPrice) * 100) : 0,
      })),
  );
  return all
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => b.entry.restaurant.rating - a.entry.restaurant.rating || b.entry.discountPercent - a.entry.discountPercent || a.index - b.index)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

/**
 * Home-only display order: "Bếp Nhà Lá" (res_01) and "Cơm Niêu Quê" (res_04) trade
 * places in the "Nhà hàng gần bạn" row. Applied on top of `getHomeView` (area first),
 * so the data, search and results ordering are untouched. Swaps only when both
 * restaurants are in the list (e.g. not under the "Mì" category).
 */
export const HOME_SWAPPED_RESTAURANTS = ['res_01', 'res_04'] as const;

export function swapHomeRestaurants<T extends { restaurant: { id: string } }>(items: readonly T[]): T[] {
  const [a, b] = HOME_SWAPPED_RESTAURANTS.map((id) => items.findIndex((item) => item.restaurant.id === id));
  const next = [...items];
  if (a < 0 || b < 0) return next;
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}
