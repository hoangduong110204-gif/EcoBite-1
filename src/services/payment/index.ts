import { mockPaymentService } from './mock-payment';

export { setMockPaymentScenario } from './mock-payment';
export type { MockPaymentScenario, PaymentService } from './types';

/**
 * Swap for a real provider adapter later. No PayOS/Casso/SePay integration
 * exists yet by design.
 */
export const paymentService = mockPaymentService;
