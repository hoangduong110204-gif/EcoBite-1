import type { Money } from '@/types';

/** Business rules taken from the reference. Pure constants, no logic. */

/** Discount when the customer brings their own box, per bag. */
export const OWN_BOX_DISCOUNT_PER_BAG: Money = 2000;

/** Bags are held this long while waiting for payment (screens 7.1, 7.5). */
export const PAYMENT_HOLD_MINUTES = 10;

/** After a failed payment the order/bags are kept this long for a retry (screen 7.4). */
export const PAYMENT_RETRY_MINUTES = 5;

/** The QR screen turns into the "waiting for bank" phase after this long (screens 7.1 → 7.2). */
export const PAYMENT_WAITING_PHASE_AFTER_MS = 4000;

/** How often the payment status is polled. */
export const PAYMENT_POLL_INTERVAL_MS = 1500;

/** Impact conventions: 1 bag ≈ 1.2 kg food ≈ 2.5 kg CO₂ ≈ 340 L water. */
export const IMPACT_PER_BAG = { foodKg: 1.2, co2Kg: 2.5, waterL: 340 } as const;

/** Fulfilment model. There is only self-pickup; this is a marker, not a switch. */
export const FULFILLMENT = 'SELF_PICKUP' as const;

export const APP_CITY = 'Hà Nội';

/** Seconds before "Gửi lại mã" becomes available (reference 1.8 counts down from 60). */
export const OTP_RESEND_SECONDS = 60;

/** Splash: short brand moment before routing (no artificial long delay). */
export const SPLASH_DURATION_MS = 700;
