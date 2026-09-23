import type { PaymentSession } from '@/types';

/**
 * Session memory of the payment sessions created in this app run, one current
 * session per order (a retry replaces it; the ORDER is never re-created).
 * Same model as the auth and cart stores: module singleton, no persistence.
 */
const sessions = new Map<string, PaymentSession>();

export const getPaymentSession = (orderId: string): PaymentSession | null => sessions.get(orderId) ?? null;

export const rememberPaymentSession = (session: PaymentSession): void => {
  sessions.set(session.orderId, session);
};

export const resetCheckoutStore = (): void => sessions.clear();
