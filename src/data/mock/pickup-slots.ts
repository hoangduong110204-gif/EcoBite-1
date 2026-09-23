import type { PickupSlotOption } from '@/types';

/** Pickup times are offered every 30 minutes. */
const STEP_MINUTES = 30;
/** Earliest / latest time the mock offers; wide enough to cover every bag's pickup window. */
const FIRST_MINUTE = 16 * 60 + 30;
const LAST_MINUTE = 21 * 60 + 30;
/** Places per time (capacity is validated by `canSelectSlot`, never shown to the customer). */
const DEFAULT_CAPACITY = 5;

const hhmm = (minutes: number): string => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/**
 * Every selectable pickup time of the day, as a point in time: `start === end === label`
 * ("18:30"). Which of them a customer may pick is decided per restaurant from the bags'
 * pickup windows (`features/checkout/checkout-logic`), not here.
 */
export const mockPickupSlots: PickupSlotOption[] = Array.from(
  { length: (LAST_MINUTE - FIRST_MINUTE) / STEP_MINUTES + 1 },
  (_, i): PickupSlotOption => {
    const time = hhmm(FIRST_MINUTE + i * STEP_MINUTES);
    return { id: `slot_${time.replace(':', '')}`, label: time, date: '2026-09-14', start: time, end: time, left: DEFAULT_CAPACITY };
  },
);
