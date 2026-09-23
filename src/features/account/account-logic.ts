import { countOrdersByTab, summarizeCompleted } from '@/features/order-history/order-history-logic';
import type { Order } from '@/types';

export interface AccountSummary {
  /** Every order of the account. */
  orderCount: number;
  /** Orders still to be paid / prepared / picked up (they are kept on logout). */
  activeCount: number;
  /** Impact of the completed orders (`utils/impact`). */
  bags: number;
  foodKg: number;
  co2Kg: number;
}

/** Numbers of the Account screen, derived from the account's own orders. */
export function getAccountSummary(orders: readonly Order[]): AccountSummary {
  const impact = summarizeCompleted(orders);
  return {
    orderCount: orders.length,
    activeCount: countOrdersByTab(orders).active,
    bags: impact.bags,
    foodKg: impact.foodKg,
    co2Kg: impact.co2Kg,
  };
}

/** `2026-08` → `08/2026` ("Thành viên từ 08/2026"). */
export const formatMemberSince = (month: string): string => {
  const [year, m] = month.split('-');
  return year && m ? `${m}/${year}` : month;
};

/** First letter of the name for the avatar circle. */
export const getInitial = (name: string): string => name.trim().charAt(0).toUpperCase() || '?';
