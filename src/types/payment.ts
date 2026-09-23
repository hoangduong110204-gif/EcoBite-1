import type { IsoDateString, Money } from './common';

/** Provider-side outcome of one payment attempt. */
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired';

/**
 * Presentation phase of the single payment route
 * (`/order/[orderId]/payment`, screens 7.1 → 7.2 → result).
 */
export type PaymentPhase = 'qr' | 'waiting' | 'success' | 'failed' | 'expired';

export type PaymentMethodId = 'bank_qr' | 'e_wallet' | 'card' | 'cash';

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
  /** Only QR bank transfer is enabled; the rest are shown disabled. */
  enabled: boolean;
  /** Small caption, e.g. "Khuyên dùng" or "Sắp có". */
  badge: string;
}

/** Bank account the customer transfers to. Demo values only. */
export interface BankTransferDetails {
  bank: string;
  accountName: string;
  accountNumber: string;
  /** Transfer note = order code without dashes, e.g. `EB2409017`. */
  transferNote: string;
  isDemo: boolean;
}

/**
 * PAYMENT QR — shown by the app, scanned BY the customer's banking app to
 * pay. This is NOT the pickup QR (see types/pickup.ts).
 */
export interface PaymentQr {
  kind: 'payment';
  /** Payload encoded into the QR image (mock string for now). */
  payload: string;
  amount: Money;
  reference: string;
  expiresAt: IsoDateString;
}

/**
 * One payment attempt for ONE order (each restaurant order of a multi-order
 * checkout is paid separately).
 *
 * - `holdExpiresAt`: the bags are held until then (10 min); a still-pending
 *   session past this moment resolves to `expired` and the order expires.
 * - `retryUntil`: set only when `status = failed`; until then the customer
 *   may retry (5 min) and the order stays `placed`.
 */
export interface PaymentSession {
  id: string;
  orderId: string;
  orderCode: string;
  amount: Money;
  method: PaymentMethodId;
  status: PaymentStatus;
  qr: PaymentQr;
  bank: BankTransferDetails;
  holdExpiresAt: IsoDateString;
  retryUntil: IsoDateString | null;
  createdAt: IsoDateString;
}
