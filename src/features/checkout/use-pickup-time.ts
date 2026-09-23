import { useCallback, useEffect, useState } from 'react';

import { useCart } from '@/features/cart';
import { api } from '@/services/api';
import type { PickupSlotOption, Restaurant } from '@/types';

import { getPickupWindow, listSlotsInWindow, type PickupWindowBounds } from './checkout-logic';
import { selectPickupSlot } from './checkout-actions';

export type PickupTimeStatus = 'loading' | 'ready' | 'not_in_cart' | 'error';

/**
 * Select Pickup Time for ONE restaurant. The chosen slot is stored in the real
 * cart (`selectPickupSlot`), so it survives navigation between Checkout and this
 * screen and each restaurant keeps its own time.
 */
export function usePickupTime(restaurantId: string | undefined) {
  const cart = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [options, setOptions] = useState<PickupSlotOption[]>([]);
  const [window, setWindow] = useState<PickupWindowBounds | null>(null);
  const [status, setStatus] = useState<PickupTimeStatus>('loading');
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const stored = restaurantId ? cart.pickupSlots[restaurantId] : undefined;
  const cartBagIds = cart.items.filter((i) => i.restaurantId === restaurantId).map((i) => i.foodBagId);
  const inCart = cartBagIds.length > 0;

  const load = useCallback(async () => {
    if (!restaurantId) {
      setStatus('not_in_cart');
      return;
    }
    setStatus('loading');
    try {
      const found = await api.getRestaurant(restaurantId);
      const [slots, bags] = await Promise.all([api.listPickupSlots(restaurantId), api.listFoodBags(restaurantId)]);
      const bounds = getPickupWindow(bags.filter((b) => cartBagIds.includes(b.id)));
      setRestaurant(found);
      setWindow(bounds);
      setOptions(listSlotsInWindow(slots, bounds));
      setStatus(found && cartBagIds.length > 0 ? 'ready' : 'not_in_cart');
    } catch {
      setStatus('error');
    }
    // cartBagIds is derived from the cart; the restaurant id is what triggers a reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Start from the slot already stored in the cart.
  const selectedId = choiceId ?? options.find((o) => o.label === stored?.label)?.id ?? null;
  const selected = options.find((o) => o.id === selectedId) ?? null;

  const confirm = async (): Promise<boolean> => {
    if (!restaurantId || !selected) return false;
    setError(undefined);
    const result = await selectPickupSlot(restaurantId, selected);
    if (!result.ok) setError(result.message);
    return result.ok;
  };

  return { restaurant, options, window, status, inCart, selected, selectedId, choose: setChoiceId, confirm, error, reload: load };
}
