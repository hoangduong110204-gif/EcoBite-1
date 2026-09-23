import { EmptyState, ErrorState } from '@/components/common';

export type PickupGateKind = 'not_found' | 'error' | 'unpaid' | 'expired' | 'cancelled' | 'no_qr';

interface PickupGateStateProps {
  kind: PickupGateKind;
  /** Opens the payment of an unpaid order. */
  onPay?: () => void;
  onRetry?: () => void;
  onHome: () => void;
}

/**
 * Full-screen state of the pickup screens when there is no usable pickup QR:
 * unknown order, load error, unpaid / expired / cancelled order, or a paid
 * order whose QR is missing. Every state leaves the customer a way forward.
 */
export function PickupGateState({ kind, onPay, onRetry, onHome }: PickupGateStateProps) {
  const home = { label: 'Về trang chủ', onPress: onHome };
  switch (kind) {
    case 'not_found':
      return <EmptyState title="Không tìm thấy đơn hàng" message="Đơn hàng này không tồn tại hoặc đường dẫn không đúng." primaryAction={home} />;
    case 'error':
      return (
        <ErrorState
          title="Không tải được đơn hàng"
          message="Kiểm tra kết nối rồi thử lại nhé."
          primaryAction={onRetry ? { label: 'Thử lại', onPress: onRetry } : home}
          secondaryAction={onRetry ? home : undefined}
        />
      );
    case 'unpaid':
      return (
        <EmptyState
          icon="clock"
          title="Đơn chưa được thanh toán"
          message="Mã nhận hàng chỉ có sau khi thanh toán thành công."
          primaryAction={onPay ? { label: 'Thanh toán đơn hàng', onPress: onPay } : home}
          secondaryAction={onPay ? home : undefined}
        />
      );
    case 'expired':
      return (
        <ErrorState
          tone="warning"
          icon="clock"
          title="Đơn đã hết hạn giữ chỗ"
          message="Đơn này không được thanh toán kịp nên không có mã nhận hàng. Bạn không bị trừ tiền."
          primaryAction={home}
        />
      );
    case 'cancelled':
      return <ErrorState title="Đơn đã bị huỷ" message="Đơn này đã bị huỷ nên không có mã nhận hàng." primaryAction={home} />;
    case 'no_qr':
      return (
        <ErrorState
          title="Chưa có mã nhận hàng"
          message="Đơn đã thanh toán nhưng mã nhận hàng chưa sẵn sàng. Thử tải lại nhé."
          primaryAction={onRetry ? { label: 'Tải lại', onPress: onRetry } : home}
          secondaryAction={onRetry ? home : undefined}
        />
      );
  }
}
