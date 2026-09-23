import type { FoodArt, GeoPoint, Money, TimeOfDay } from './common';

export interface Category {
  id: string;
  name: string;
  /** Number of restaurants with bags in this category. */
  count: number;
}

export interface Restaurant {
  id: string;
  name: string;
  categoryId: string;
  /** One of the four supported areas (`Area.id`). */
  areaId: string;
  address: string;
  phone: string;
  location: GeoPoint;
  /** Distance from the sample user location, in km (mock only). */
  distanceKm: number;
  walkMinutes: number;
  rating: number;
  ratingCount: number;
  art: FoodArt;
  pickupLocationId: string;
}

/**
 * Read model for discovery lists (Home, search results, restaurant detail): a
 * restaurant plus its bags and the values the cards show. Built by
 * `utils/restaurant-listing`, never stored.
 */
export interface RestaurantListing {
  restaurant: Restaurant;
  categoryName: string;
  /** All bags of the restaurant (sold-out ones included). */
  bags: FoodBag[];
  /** Sum of `left` over all bags ("Còn 5 túi hôm nay"). */
  availableCount: number;
  /** First bag (catalog order) that is still available; drives the price and -x% on cards, as in the reference. */
  featuredBag: FoodBag | null;
  /** Pickup window label of the earliest available bag. */
  pickupWindowLabel: string | null;
  soldOut: boolean;
}

/** Daily pickup window for a bag. `label` is the display string. */
export interface PickupWindow {
  label: string;
  start: TimeOfDay;
  end: TimeOfDay;
}

/** `true`/`false`, or `'maybe'` when the restaurant cannot exclude it. */
export type AllergenFlag = boolean | 'maybe';

export interface AllergenInfo {
  peanut: AllergenFlag;
  seafood: AllergenFlag;
  gluten: AllergenFlag;
  dairy: AllergenFlag;
  egg: AllergenFlag;
  spicy: AllergenFlag;
}

export interface FoodBag {
  id: string;
  restaurantId: string;
  name: string;
  summary: string;
  originalPrice: Money;
  price: Money;
  /** Remaining bags today. */
  left: number;
  pickupWindow: PickupWindow;
  art: FoodArt;
  contents: string[];
  allergens: AllergenInfo;
  /** Last-call "surprise" bag. */
  lastCall?: boolean;
}

/** Discount code. Codes flagged `onlyVegan` are not applicable yet (no vegan tagging on bags). */
export interface Promo {
  code: string;
  label: string;
  minTotal: Money;
  /** Fixed discount. */
  amount?: Money;
  /** Percentage discount, capped by `cap`. */
  percent?: number;
  cap?: Money;
  /** `DD/MM` display string. */
  expires: string;
  usable: boolean;
  onlyVegan?: boolean;
}
