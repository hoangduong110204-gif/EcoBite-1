/** Money is always stored as integer VND (no decimals). */
export type Money = number;

/** ISO-8601 timestamp string. */
export type IsoDateString = string;

/** Calendar date, `YYYY-MM-DD` (local, Vietnam). */
export type DateString = string;

/** Time of day, `HH:mm` (local, Vietnam). */
export type TimeOfDay = string;

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** Placeholder illustration key used until real photos exist. */
export type FoodArt = 'rice' | 'sushi' | 'noodle' | 'clay' | 'salad' | 'dessert';
