import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, EmptyState, ErrorState, Header, Icon, LoadingState, PriceRow, Screen } from '@/components/common';
import { HoldTimerCard, PaymentQrCard } from '@/components/order';
import { Colors, Spacing } from '@/constants';
import { paymentSuccessRoute, usePaymentOrder } from '@/features/checkout';
import { canRetryPayment, holdSecondsLeft, retrySecondsLeft, usePaymentStatus } from '@/features/payment';
import { useNow } from '@/hooks';
import type { Order, PaymentSession } from '@/types';
import { formatCountdown, formatMoney, formatTimeVN } from '@/utils/format';
import type { CheckoutProgress } from '@/features/checkout';

/**
 * 15 Payment QR: ONE route with phases (D-6): qr → waiting → success | failed |
 * expired (reference 7.1–7.5). The session comes from the mock payment service
 * and the phase from `usePaymentStatus`; the screen holds no payment state of its
 * own. This is the PAYMENT QR (the customer scans it with a banking app), never
 * the pickup QR. Multi-restaurant checkouts pay one order per QR (D-18).
 */
export default function QrPaymentScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const p = usePaymentOrder(orderId);
  const toHome = () => router.replace('/home');
  const header = <Header title="Thanh toán" onBack={toHome} />;

  useEffect(() => {
    // Already paid (e.g. reopened after success): go to the success screen.
    if (p.status === 'ready' && p.order && !p.session && p.order.paymentStatus === 'success') {
      router.replace(paymentSuccessRoute(p.order.id));
    }
  }, [p.status, p.order, p.session, router]);

  if (p.status === 'loading') {
    return (
      <Screen header={header} scroll={false}>
        <LoadingState message="Đang chuẩn bị mã thanh toán…" />
      </Screen>
    );
  }
  if (p.status === 'not_found' || p.status === 'error' || !p.order) {
    return (
      <Screen header={header}>
        {p.status === 'error' ? (
          <ErrorState title="Không tải được thanh toán" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Thử lại', onPress: p.reload }} secondaryAction={{ label: 'Về trang chủ', onPress: toHome }} />
        ) : (
          <EmptyState title="Không tìm thấy đơn hàng" message="Đơn hàng này không tồn tại." primaryAction={{ label: 'Về trang chủ', onPress: toHome }} />
        )}
      </Screen>
    );
  }
  if (!p.session) {
    // No payment to make: paid (redirecting), or the order is expired / cancelled.
    return p.order.paymentStatus === 'success' ? (
      <Screen header={header} scroll={false}>
        <LoadingState />
      </Screen>
    ) : (
      <ResultBody kind="expired" order={p.order} progress={p.progress} onHome={toHome} onRetry={undefined} canRetry={false} retryLeft={0} />
    );
  }
  return (
    <PaymentBody
      key={p.session.id}
      order={p.order}
      session={p.session}
      progress={p.progress}
      onRetry={p.retry}
      retryError={p.retryError}
      onSettled={p.refresh}
    />
  );
}

interface PaymentBodyProps {
  order: Order;
  session: PaymentSession;
  progress: CheckoutProgress | null;
  onRetry: () => void;
  retryError?: string;
  onSettled: () => Promise<void>;
}

function PaymentBody({ order, session, progress, onRetry, retryError, onSettled }: PaymentBodyProps) {
  const router = useRouter();
  const { session: live, phase, settled } = usePaymentStatus(session);
  const now = useNow(1000);
  const current = live ?? session;
  const toHome = () => router.replace('/home');

  useEffect(() => {
    if (phase === 'success' && settled) router.replace(paymentSuccessRoute(order.id));
    else if ((phase === 'expired' || phase === 'failed') && settled) void onSettled();
  }, [phase, settled, order.id, router, onSettled]);

  if (phase === 'success') {
    return (
      <Screen header={<Header title="Thanh toán" />} scroll={false}>
        <LoadingState message="Đã nhận tiền. Đang xác nhận đơn…" />
      </Screen>
    );
  }
  if (phase === 'failed' || phase === 'expired') {
    return (
      <ResultBody
        kind={phase}
        order={order}
        progress={progress}
        onHome={toHome}
        onRetry={onRetry}
        canRetry={canRetryPayment(current, now)}
        retryLeft={retrySecondsLeft(current, now)}
        retryError={retryError}
        amount={current.amount}
      />
    );
  }

  const orderNumber = progress && progress.orders.length > 1 ? progress.orders.findIndex((o) => o.id === order.id) + 1 : 0;
  return (
    <Screen header={<Header title="Thanh toán" onBack={toHome} />}>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.xl }}>
        {orderNumber > 0 && progress ? (
          <Card variant="mint">
            <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 12.5 }}>
              {`Đơn ${orderNumber}/${progress.orders.length} · ${order.orderCode}`}
            </AppText>
            <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
              Mỗi quán có một mã QR thanh toán riêng. Bạn thanh toán lần lượt từng đơn.
            </AppText>
          </Card>
        ) : null}

        {phase === 'waiting' ? (
          <>
            <View style={{ alignItems: 'center', gap: Spacing.s14, paddingVertical: Spacing.s18 }}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <AppText variant="section" style={{ textAlign: 'center' }}>
                Đang chờ ngân hàng báo có
              </AppText>
              <AppText variant="muted" style={{ textAlign: 'center' }}>
                Bạn không cần bấm gì. Khi tiền về, màn hình sẽ tự chuyển sang bước tiếp theo.
              </AppText>
            </View>
            <Card style={{ gap: Spacing.s10 }}>
              <ChecklistRow text={`Đã tạo đơn ${order.orderCode}`} done />
              <ChecklistRow text={`Đã giữ túi tới ${formatTimeVN(current.holdExpiresAt)}`} done />
              <ChecklistRow text="Đang đối soát giao dịch…" />
            </Card>
          </>
        ) : (
          <PaymentQrCard qr={current.qr} />
        )}

        <Card style={{ gap: 2 }}>
          <PriceRow label="Ngân hàng" value={current.bank.bank} />
          <PriceRow label="Chủ tài khoản" value={current.bank.accountName} />
          <PriceRow label="Số tài khoản" value={current.bank.accountNumber} />
          <PriceRow label="Nội dung" value={current.bank.transferNote} />
          <PriceRow label="Số tiền" value={formatMoney(current.amount)} />
        </Card>

        <HoldTimerCard secondsLeft={holdSecondsLeft(current, now)} heldUntil={formatTimeVN(current.holdExpiresAt)} />
        <AppText variant="caption" color="textMuted" style={{ textAlign: 'center', lineHeight: 18 }}>
          Không cần bấm nút gì thêm. EcoBite tự nhận ra khi tiền về tài khoản và chuyển màn cho bạn.
        </AppText>
      </View>
    </Screen>
  );
}

function ChecklistRow({ text, done = false }: { text: string; done?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.s10 }}>
      {done ? <Icon name="check" size={16} color={Colors.primary} strokeWidth={2.8} /> : <ActivityIndicator size="small" color={Colors.primary} />}
      <AppText variant="bodyStrong" color={done ? 'text' : 'textMuted'} style={{ fontSize: 12.5 }}>
        {text}
      </AppText>
    </View>
  );
}

interface ResultBodyProps {
  kind: 'failed' | 'expired';
  order: Order;
  progress: CheckoutProgress | null;
  onHome: () => void;
  onRetry?: () => void;
  canRetry: boolean;
  retryLeft: number;
  retryError?: string;
  amount?: number;
}

/** Failed (7.4) and expired (7.5) results. Retry re-uses the SAME order; expiry offers to order again. */
function ResultBody({ kind, order, progress, onHome, onRetry, canRetry, retryLeft, retryError, amount }: ResultBodyProps) {
  const router = useRouter();
  const failed = kind === 'failed';
  const nextOrder = progress?.nextToPay ?? null;
  const firstBagId = order.items[0]?.foodBagId;
  return (
    <Screen
      header={<Header title="Thanh toán" onBack={onHome} />}
      footer={
        <BottomActionBar>
          {failed ? (
            <Button label="Thử thanh toán lại" disabled={!canRetry} onPress={onRetry} />
          ) : firstBagId ? (
            <Button label="Đặt lại túi này" onPress={() => router.replace({ pathname: '/food-bag/[id]', params: { id: firstBagId } })} />
          ) : null}
          {nextOrder ? (
            <Button label="Thanh toán đơn tiếp theo" variant="soft" onPress={() => router.replace({ pathname: '/order/[orderId]/payment', params: { orderId: nextOrder.id } })} />
          ) : null}
          <Button label={failed ? 'Về trang chủ' : 'Xem quán khác gần đây'} variant="secondary" onPress={onHome} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <View style={{ minHeight: 250 }}>
          <ErrorState
            tone={failed ? 'danger' : 'warning'}
            icon={failed ? 'warning' : 'clock'}
            title={failed ? 'Chưa thanh toán được' : 'Đơn đã hết hạn giữ chỗ'}
            message={
              failed
                ? 'Ngân hàng báo giao dịch không thành công. Tiền chưa bị trừ khỏi tài khoản của bạn.'
                : 'Sau 10 phút không nhận được thanh toán, các túi đã được trả lại cho khách khác. Bạn không bị trừ tiền.'
            }
          />
        </View>
        <Card style={{ gap: 2 }}>
          <PriceRow label="Mã đơn" value={order.orderCode} />
          {failed ? <PriceRow label="Số tiền" value={formatMoney(amount ?? order.money.total)} /> : <PriceRow label="Trạng thái" value="Đã hết hạn giữ chỗ" />}
          {failed ? <PriceRow label="Lý do" value="Ngân hàng không xác nhận" /> : <PriceRow label="Số tiền đã trừ" value="0đ" />}
        </Card>
        {failed ? (
          <Card variant="mint">
            <AppText variant="caption" color="primaryText" style={{ lineHeight: 18 }}>
              {canRetry
                ? `EcoBite vẫn giữ túi cho bạn thêm ${formatCountdown(retryLeft)} nữa. Thử lại ngay nhé.`
                : 'Đã hết thời gian thử lại cho đơn này.'}
            </AppText>
          </Card>
        ) : null}
        {retryError ? (
          <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11.5 }}>
            {retryError}
          </AppText>
        ) : null}
      </View>
    </Screen>
  );
}
