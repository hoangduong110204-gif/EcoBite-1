import type { DateString, GeoPoint, IsoDateString, TimeOfDay } from './common';

/** A physical restaurant counter where the customer collects the order. */
export interface PickupLocation {
  id: string;
  restaurantId: string;
  label: string;
  address: string;
  location: GeoPoint;
  instructions: string;
}

/** Time slot the customer chose to pick the order up. `label` is `HH:mm – HH:mm`. */
export interface PickupSlot {
  label: string;
  date: DateString;
  start: TimeOfDay;
  end: TimeOfDay;
}

/** A selectable slot with remaining capacity (`left = 0` means full). */
export interface PickupSlotOption extends PickupSlot {
  id: string;
  left: number;
}

/**
 * PICKUP QR — shown BY the customer, scanned BY restaurant staff to verify
 * the pickup. This is NOT the payment QR (see types/payment.ts).
 *
 * `token` is opaque and is what the QR encodes. `orderCode` is the human
 * readable code displayed below the QR, read aloud if the scanner fails.
 */
export interface PickupQr {
  kind: 'pickup';
  orderId: string;
  orderCode: string;
  token: string;
  issuedAt: IsoDateString;
  /** Set once staff have verified the QR. */
  verifiedAt: IsoDateString | null;
}
