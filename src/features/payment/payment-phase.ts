import { PAYMENT_WAITING_PHASE_AFTER_MS } from '@/constants/policy';
import type { PaymentPhase, PaymentSession } from '@/types';

/**
 * Presentation phase of the single payment route (D-6). A pending session
 * shows the QR first, then the "waiting for bank" phase; a finished session
 * maps 1:1 to its result phase.
 */
export const derivePaymentPhase = (
  session: Pick<PaymentSession, 'status' | 'createdAt'>,
  now: number = Date.now(),
): PaymentPhase => {
  if (session.status !== 'pending') return session.status;
  return now - Date.parse(session.createdAt) >= PAYMENT_WAITING_PHASE_AFTER_MS ? 'waiting' : 'qr';
};

/** Seconds left of the bag hold, never negative. */
export const holdSecondsLeft = (
  session: Pick<PaymentSession, 'holdExpiresAt'>,
  now: number = Date.now(),
): number => Math.max(0, Math.round((Date.parse(session.holdExpiresAt) - now) / 1000));

/** True while a failed payment may still be retried (5-minute window). */
export const canRetryPayment = (
  session: Pick<PaymentSession, 'status' | 'retryUntil'>,
  now: number = Date.now(),
): boolean =>
  session.status === 'failed' && session.retryUntil !== null && now < Date.parse(session.retryUntil);

/** Seconds left of the 5-minute retry window after a failed payment, never negative. */
export const retrySecondsLeft = (
  session: Pick<PaymentSession, 'retryUntil'>,
  now: number = Date.now(),
): number => (session.retryUntil ? Math.max(0, Math.round((Date.parse(session.retryUntil) - now) / 1000)) : 0);
