import { addBagToCart } from '@/features/cart/cart-actions';
import type { Order } from '@/types';

export interface ReorderResult {
  /** Bags actually put in the cart (a sold-out or capped bag may add less than before, or nothing). */
  added: number;
  /** Names of the bags that could not be added. */
  skipped: string[];
}

/**
 * "Đặt lại túi này" on a completed order: puts the same bags (same own-box choice)
 * into the CURRENT session cart through the normal add-to-cart rules, so sold-out
 * bags and stock limits still apply. It creates no order, payment or pickup QR and
 * never touches the old order; the customer still goes through Checkout.
 */
export async function reorderOrder(order: Pick<Order, 'items'>): Promise<ReorderResult> {
  let added = 0;
  const skipped: string[] = [];
  for (const item of order.items) {
    const result = await addBagToCart({ foodBagId: item.foodBagId, quantity: item.quantity, ownBox: item.ownBox });
    if (result.ok) added += result.added;
    else skipped.push(item.name);
  }
  return { added, skipped };
}
