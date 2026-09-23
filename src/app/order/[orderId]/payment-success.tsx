import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, EmptyState, ErrorState, Header, IconTile, LoadingState, PriceRow, Screen } from '@/components/common';
import { PaymentSuccessHero } from '@/components/order';
import { Spacing } from '@/constants';
import { paymentRoute, pickupQrRoute, usePaymentSuccess } from '@/features/checkout';
import { formatDateVN, formatKg, formatMoney, formatTimeVN } from '@/utils/format';
import { calcImpact, countBags } from '@/utils/impact';

/**
 * 16 Payment Success (reference 7.3). Shows the paid order. When the checkout
 * has more orders waiting for payment (multi-restaurant, D-18) the main button
 * continues to the next payment; once every order is paid it goes straight to
 * Pickup QR (8.3) of the first active order, with no extra step in between (D-3).
 */
export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { order, restaurant, progress, status } = usePaymentSuccess(orderId);
  const header = <Header title="Thanh toán" />;

  if (status === 'loading') {
    return (
      <Screen header={header} scroll={false}>
        <LoadingState />
      </Screen>
    );
  }
  if (status !== 'ready' || !order) {
    return (
      <Screen header={header}>
        {status === 'error' ? (
          <ErrorState title="Không tải được đơn hàng" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Về trang chủ', onPress: () => router.replace('/home') }} />
        ) : status === 'not_paid' ? (
          <EmptyState
            title="Đơn chưa được thanh toán"
            message="Đơn này chưa nhận được tiền."
            primaryAction={{ label: 'Quay lại thanh toán', onPress: () => router.replace({ pathname: '/order/[orderId]/payment', params: { orderId: orderId ?? '' } }) }}
          />
        ) : (
          <EmptyState title="Không tìm thấy đơn hàng" message="Đơn hàng này không tồn tại." primaryAction={{ label: 'Về trang chủ', onPress: () => router.replace('/home') }} />
        )}
      </Screen>
    );
  }

  const next = progress?.nextToPay ?? null;
  const pickupTarget = progress?.firstPickup ?? order;
  const impact = calcImpact(countBags(order.items));
  const multi = (progress?.orders.length ?? 1) > 1;
  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          {next ? (
            <Button label="Thanh toán đơn tiếp theo" onPress={() => router.replace(paymentRoute(next.id))} />
          ) : (
            <Button label="Xem mã nhận hàng" icon="qr" onPress={() => router.replace(pickupQrRoute(pickupTarget.id))} />
          )}
          <Button label="Về trang chủ" variant="secondary" onPress={() => router.replace('/home')} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <PaymentSuccessHero title="Thanh toán thành công" message="Quán đã nhận đơn của bạn và bắt đầu chuẩn bị túi." />

        {multi && progress ? (
          <Card variant="mint">
            <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 12.5 }}>
              {`Đã thanh toán ${progress.paid.length}/${progress.orders.length} đơn`}
            </AppText>
            <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
              {next ? 'Còn đơn của quán khác cần thanh toán. Mỗi quán có mã QR nhận hàng riêng.' : 'Bạn sẽ có một mã QR nhận hàng riêng cho từng quán.'}
            </AppText>
          </Card>
        ) : null}

        <Card style={{ gap: 2 }}>
          <PriceRow label="Mã đơn" value={order.orderCode} />
          <PriceRow label="Đã thanh toán" value={formatMoney(order.money.total)} />
          <PriceRow label="Cách thanh toán" value="Chuyển khoản QR" />
          {order.statusHistory.paid ? <PriceRow label="Lúc" value={`${formatTimeVN(order.statusHistory.paid)} · ${formatDateVN(order.statusHistory.paid)}`} /> : null}
        </Card>

        <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name="pin" size="md" tone="white" iconSize={18} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 12.5 }}>
              {`Tới ${restaurant?.name ?? 'quán'} lấy túi`}
            </AppText>
            <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
              {`${order.pickupSlot.label} hôm nay${restaurant ? ` · ${restaurant.address}` : ''}`}
            </AppText>
          </View>
        </Card>

        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name="leaf" size="md" iconSize={18} />
          <AppText variant="caption" color="textMuted" style={{ flex: 1, lineHeight: 17 }}>
            Bạn vừa cứu <AppText variant="label">{formatKg(impact.foodKg)} thức ăn</AppText> và tránh{' '}
            <AppText variant="label">{formatKg(impact.co2Kg)} CO₂</AppText>
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}
