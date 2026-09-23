import { useEffect, useState } from 'react';

import { PAYMENT_POLL_INTERVAL_MS } from '@/constants/policy';
import { paymentService } from '@/services/payment';
import type { PaymentPhase, PaymentSession } from '@/types';

import { derivePaymentPhase } from './payment-phase';
import { settlePayment } from './settle-payment';

/**
 * Polls the (mock) payment provider until the session leaves `pending`, then
 * settles the order. Returns the latest session and the presentation phase of
 * the single payment route. `settled` turns true once the order has been updated
 * for a finished session (paid / expired), so screens can safely read the order.
 */
export function usePaymentStatus(initial: PaymentSession | null): {
  session: PaymentSession | null;
  phase: PaymentPhase;
  settled: boolean;
} {
  const [session, setSession] = useState<PaymentSession | null>(initial);
  const [now, setNow] = useState(() => Date.now());
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!initial) return;
    let cancelled = false;
    const timer = setInterval(async () => {
      const next = await paymentService.getPaymentStatus(initial.id);
      if (cancelled) return;
      setSession(next);
      setNow(Date.now());
      if (next.status !== 'pending') {
        clearInterval(timer);
        await settlePayment(next);
        if (!cancelled) setSettled(true);
      }
    }, PAYMENT_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [initial]);

  return { session, phase: session ? derivePaymentPhase(session, now) : 'qr', settled };
}
