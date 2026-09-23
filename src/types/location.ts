/** A selectable area (district) used to sort restaurants by distance. NOT a delivery address. */
export interface Area {
  id: string;
  name: string;
  city: string;
  /** Restaurants available in the area (display only). */
  restaurantCount: number;
}
