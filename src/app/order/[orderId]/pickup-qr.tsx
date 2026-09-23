import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, Header, LoadingState, PriceRow, Screen } from '@/components/common';
import { PickupGateState, PickupQrCard } from '@/components/order';
import { Colors, Spacing } from '@/constants';
import { ORDER_STATUS_LABEL } from '@/constants/order-status';
import { getOrderPosition, getPickupStage, pickupRoutes, usePickupScreen } from '@/features/pickup';
import { useBack } from '@/hooks';

/**
 * 17 Pickup QR (reference 8.3). Shows the order's PICKUP QR (`PickupQr`): the QR
 * encodes the opaque token, the order code is printed under it for manual entry.
 * This is never the payment QR. The screen follows the real order: while the
 * restaurant is preparing it says the QR cannot be scanned yet, and as soon as staff
 * verify it the screen moves on to QR Verified. Only a paid order gets here.
 */
export default function PickupQrScreen() {
  const router = useRouter();
  const goBack = useBack('/home');
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const s = usePickupScreen(orderId, ['preparing', 'ready']);
  const header = <Header title="Mã nhận hàng" onBack={goBack} />;
  const toHome = () => router.replace('/home');

  if (s.state === 'loading' || s.state === 'redirecting') {
    return (
      <Screen header={header} scroll={false}>
        <LoadingState />
      </Screen>
    );
  }
  const qr = s.order?.pickupQr ?? null;
  if (s.state !== 'ok' || !s.order || !qr) {
    return (
      <Screen header={header}>
        <PickupGateState
          kind={s.state === 'ok' ? 'no_qr' : s.state}
          onPay={() => router.replace(pickupRoutes.payment(orderId ?? ''))}
          onRetry={s.reload}
          onHome={toHome}
        />
      </Screen>
    );
  }

  const { order, restaurant } = s;
  const ready = getPickupStage(order) === 'ready';
  const position = getOrderPosition(s.orders, order.checkoutId, order.id);
  const restaurantName = restaurant?.name ?? 'Nhà hàng';
  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          <Button label="Hướng dẫn nhận hàng" onPress={() => router.push(pickupRoutes.instructions(order.id))} />
          <Button label="Xem trạng thái đơn" variant="secondary" onPress={() => router.push(pickupRoutes.status(order.id))} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        {position ? (
          <Card variant="mint">
            <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 12.5 }}>
              {`Đơn ${position.index}/${position.total} · ${restaurantName}`}
            </AppText>
            <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
              Mỗi quán có một mã QR nhận hàng riêng.
            </AppText>
          </Card>
        ) : null}

        <View style={{ alignItems: 'center', gap: 4 }}>
          <AppText variant="section">Đưa màn hình này cho nhân viên</AppText>
          <AppText variant="muted" style={{ textAlign: 'center' }}>
            {`Nhân viên ${restaurantName} sẽ quét mã để xác nhận đã trao túi cho bạn.`}
          </AppText>
        </View>

        <PickupQrCard qr={qr} />

        {ready ? (
          <Card variant="mint">
            <AppText variant="caption" color="primaryText" style={{ lineHeight: 18 }}>
              Túi đã sẵn sàng. Tới quán và đưa mã này cho nhân viên quét. Màn hình sẽ tự chuyển khi mã được xác nhận.
            </AppText>
          </Card>
        ) : (
          <Card variant="warning">
            <AppText variant="caption" style={{ color: Colors.warningNote, lineHeight: 18 }}>
              Quán đang chuẩn bị túi nên chưa thể quét mã. Bạn sẽ thấy “Sẵn sàng nhận hàng” khi túi xong.
            </AppText>
          </Card>
        )}

        <Card style={{ gap: 2 }}>
          <PriceRow label="Nhà hàng" value={restaurantName} />
          <PriceRow label="Túi" value={order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')} />
          <PriceRow label="Khung giờ" value={order.pickupSlot.label} />
          <PriceRow label="Trạng thái" value={ORDER_STATUS_LABEL[order.status]} />
        </Card>

        <Card variant="outline">
          <AppText variant="caption" color="textMuted" style={{ lineHeight: 18 }}>
            Máy quán hỏng? Đọc mã <AppText variant="label">{order.orderCode}</AppText> cho nhân viên nhập tay.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}
