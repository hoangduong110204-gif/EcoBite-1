import { PAYMENT_HOLD_MINUTES, PAYMENT_RETRY_MINUTES } from '@/constants/policy';
import { mockBankAccount, mockPaymentMethods } from '@/data/mock';
import type { PaymentSession } from '@/types';
import { createId, delay } from '@/utils/async';
import { orderCodeToTransferNote } from '@/utils/order-code';

import type { MockPaymentScenario, PaymentService } from './types';

const MINUTE = 60 * 1000;

let scenario: MockPaymentScenario = { outcome: 'success', resolveAfterMs: 4000 };

/** Test/dev hook: choose how the next sessions resolve (success/failed/expired). */
export const setMockPaymentScenario = (next: MockPaymentScenario): void => {
  scenario = next;
};

interface StoredSession {
  session: PaymentSession;
  createdAtMs: number;
  scenario: MockPaymentScenario;
}

const sessions = new Map<string, StoredSession>();

const createSession = (input: {
  orderId: string;
  orderCode: string;
  amount: number;
  method: PaymentSession['method'];
}): PaymentSession => {
  const id = createId('pay');
  const now = Date.now();
  const holdExpiresAt = new Date(now + PAYMENT_HOLD_MINUTES * MINUTE).toISOString();
  const session: PaymentSession = {
    id,
    ...input,
    status: 'pending',
    qr: {
      kind: 'payment',
      payload: `MOCK-PAYMENT|${id}|${input.amount}|${orderCodeToTransferNote(input.orderCode)}`,
      amount: input.amount,
      reference: orderCodeToTransferNote(input.orderCode),
      expiresAt: holdExpiresAt,
    },
    bank: { ...mockBankAccount, transferNote: orderCodeToTransferNote(input.orderCode) },
    holdExpiresAt,
    retryUntil: null,
    createdAt: new Date(now).toISOString(),
  };
  sessions.set(id, { session, createdAtMs: now, scenario });
  return session;
};

/** Time-based, deterministic: no timers. Latency of the mock counts toward elapsed time. */
const resolve = (stored: StoredSession): PaymentSession => {
  const now = Date.now();
  const elapsed = now - stored.createdAtMs;
  const { outcome, resolveAfterMs } = stored.scenario;
  if (elapsed >= resolveAfterMs) {
    const failedAtMs = stored.createdAtMs + resolveAfterMs;
    return {
      ...stored.session,
      status: outcome,
      retryUntil:
        outcome === 'failed'
          ? new Date(failedAtMs + PAYMENT_RETRY_MINUTES * MINUTE).toISOString()
          : null,
    };
  }
  // Still pending: the bag hold can still run out.
  if (now >= Date.parse(stored.session.holdExpiresAt)) {
    return { ...stored.session, status: 'expired' };
  }
  return stored.session;
};

const require_ = (paymentId: string): StoredSession => {
  const stored = sessions.get(paymentId);
  if (!stored) throw new Error(`Payment not found: ${paymentId}`);
  return stored;
};

export const mockPaymentService: PaymentService = {
  async listPaymentMethods() {
    await delay(100);
    return mockPaymentMethods;
  },

  async createPayment({ orderId, orderCode, amount, method = 'bank_qr' }) {
    await delay(200);
    const definition = mockPaymentMethods.find((m) => m.id === method);
    if (!definition?.enabled) throw new Error(`Payment method not available: ${method}`);
    return createSession({ orderId, orderCode, amount, method });
  },

  async getPaymentStatus(paymentId) {
    await delay(100);
    return resolve(require_(paymentId));
  },

  async retryPayment(paymentId) {
    await delay(200);
    const previous = resolve(require_(paymentId));
    if (previous.status !== 'failed' || !previous.retryUntil) {
      throw new Error('Only a failed payment can be retried');
    }
    if (Date.now() >= Date.parse(previous.retryUntil)) {
      throw new Error('Retry window has closed');
    }
    return createSession({
      orderId: previous.orderId,
      orderCode: previous.orderCode,
      amount: previous.amount,
      method: previous.method,
    });
  },
};
