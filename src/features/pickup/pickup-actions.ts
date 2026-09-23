import { api } from '@/services/api';
import type { Order } from '@/types';

export type PickupFailure = 'invalid_qr' | 'already_used' | 'not_ready' | 'not_found' | 'not_verified' | 'unknown';

export const PICKUP_MESSAGES: Record<PickupFailure, string> = {
  invalid_qr: 'Mã QR không hợp lệ cho đơn này.',
  already_used: 'Mã QR này đã được sử dụng.',
  not_ready: 'Đơn hàng chưa sẵn sàng để nhận.',
  not_found: 'Không tìm thấy đơn hàng.',
  not_verified: 'Nhân viên chưa xác nhận mã QR của đơn này.',
  unknown: 'Không thể hoàn tất. Vui lòng thử lại.',
};

export type PickupActionResult = { ok: true; order: Order } | { ok: false; reason: PickupFailure; message: string };

/** Maps a mock-service error message to a failure reason (the service messages are the contract). */
export function classifyPickupError(error: unknown): PickupFailure {
  const message = error instanceof Error ? error.message : String(error);
  if (/Invalid pickup QR/i.test(message)) return 'invalid_qr';
  if (/already used/i.test(message)) return 'already_used';
  if (/not ready/i.test(message) || /Illegal order transition/i.test(message)) return 'not_ready';
  if (/not found/i.test(message)) return 'not_found';
  return 'unknown';
}

const fail = (reason: PickupFailure): PickupActionResult => ({ ok: false, reason, message: PICKUP_MESSAGES[reason] });

/**
 * Staff-side scan, MOCKED (no camera): what the restaurant's scanner would send
 * for this order. Delegates to the existing `api.verifyPickupQr`, which checks the
 * token against THIS order's pickup QR, that the order is `ready` and that the QR
 * was not used yet, then moves `ready → qr_verified`. A payment QR payload,
 * another order's token, or a made-up value is rejected. There is no second state machine here.
 */
export async function simulateStaffScan(orderId: string, scanned: string): Promise<PickupActionResult> {
  try {
    return { ok: true, order: await api.verifyPickupQr(orderId, scanned) };
  } catch (error) {
    return fail(classifyPickupError(error));
  }
}

/**
 * "Tôi đã nhận đủ túi": the customer confirms receipt after the staff scan
 * (`qr_verified → picked_up`). It cannot skip the verification: an order that is
 * not `qr_verified` is refused, and it never creates an order, payment or token.
 */
export async function confirmReceived(orderId: string): Promise<PickupActionResult> {
  try {
    const order = await api.getOrder(orderId);
    if (!order) return fail('not_found');
    if (order.status !== 'qr_verified') return fail('not_verified');
    return { ok: true, order: await api.completePickup(orderId) };
  } catch (error) {
    return fail(classifyPickupError(error));
  }
}
