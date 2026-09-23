import type { AllergenInfo, FoodBag, RestaurantListing } from '@/types';

export type BagAvailability = 'available' | 'sold_out';

/** Bags with nothing left cannot be added to the cart. */
export const getBagAvailability = (bag: Pick<FoodBag, 'left'>): BagAvailability => (bag.left > 0 ? 'available' : 'sold_out');

/** Bags at or below this count are shown as "Chỉ còn N túi". */
export const LOW_STOCK_THRESHOLD = 3;

/** Badge on the cover: "Chỉ còn 3 túi" / "Còn 5 túi" / "Hết túi". */
export const getStockLabel = (bag: Pick<FoodBag, 'left'>): string =>
  bag.left <= 0 ? 'Hết túi' : bag.left <= LOW_STOCK_THRESHOLD ? `Chỉ còn ${bag.left} túi` : `Còn ${bag.left} túi`;

const ALLERGEN_LABEL: Record<keyof AllergenInfo, string> = {
  peanut: 'đậu phộng',
  seafood: 'hải sản',
  gluten: 'gluten',
  dairy: 'sữa',
  egg: 'trứng',
  spicy: 'cay',
};

/** "Có đậu phộng, hải sản · có thể có gluten" (restaurant-declared; see reference 5.1 / 5.4). */
export function summarizeAllergens(info: AllergenInfo): string {
  const keys = Object.keys(ALLERGEN_LABEL) as (keyof AllergenInfo)[];
  const yes = keys.filter((k) => info[k] === true).map((k) => ALLERGEN_LABEL[k]);
  const maybe = keys.filter((k) => info[k] === 'maybe').map((k) => ALLERGEN_LABEL[k]);
  const parts: string[] = [];
  if (yes.length) parts.push(`Có ${yes.join(', ')}`);
  if (maybe.length) parts.push(`có thể có ${maybe.join(', ')}`);
  return parts.length ? parts.join(' · ') : 'Quán không khai báo chất gây dị ứng';
}

/** Sold-out screen (reference 5.7): other restaurants that still have bags today. */
export const getAlternativeListings = (listings: RestaurantListing[], restaurantId: string, limit = 2): RestaurantListing[] =>
  listings.filter((l) => l.restaurant.id !== restaurantId && !l.soldOut).slice(0, limit);
