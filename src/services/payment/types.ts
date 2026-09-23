import type { Money, PaymentMethod, PaymentMethodId, PaymentSession, PaymentStatus } from '@/types';

export interface PaymentService {
  /** Payment methods for screen 6.8. Only QR bank transfer is enabled. */
  listPaymentMethods(): Promise<PaymentMethod[]>;

  /**
   * Creates a session in `pending` with a PAYMENT QR and a 10-minute hold.
   * Rejects for a method that is not enabled.
   */
  createPayment(input: {
    orderId: string;
    orderCode: string;
    amount: Money;
    method?: PaymentMethodId;
  }): Promise<PaymentSession>;

  /** Polls a session. Once `failed`, `retryUntil` is set (5-minute retry window). */
  getPaymentStatus(paymentId: string): Promise<PaymentSession>;

  /** New attempt for the same order after a `failed` one, inside the retry window. */
  retryPayment(paymentId: string): Promise<PaymentSession>;
}

/** Outcome the mock provider will resolve to once `resolveAfterMs` elapsed. */
export interface MockPaymentScenario {
  outcome: Exclude<PaymentStatus, 'pending'>;
  resolveAfterMs: number;
}
