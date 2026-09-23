import type { Money } from './common';

export interface ImpactStats {
  bagsSaved: number;
  foodKg: number;
  co2Kg: number;
  moneySaved: Money;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  /** Default area used to sort restaurants (NOT a delivery address). */
  area: string;
  /** `YYYY-MM`. */
  memberSince: string;
  walletBalance: Money;
  savedRestaurants: string[];
  impact: ImpactStats;
}

/** Identity + display name of the signed-in customer (subset of `User`). */
export type AuthProfile = Pick<User, 'id' | 'name' | 'phone' | 'email'>;
