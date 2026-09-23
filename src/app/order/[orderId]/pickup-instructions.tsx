import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, Header, IconTile, LoadingState, Screen } from '@/components/common';
import { PickupGateState, PickupInfo, PickupStepList } from '@/components/order';
import { Spacing } from '@/constants';
import { PICKUP_INSTRUCTION_STEPS, openDirections, pickupRoutes, usePickupScreen } from '@/features/pickup';
import { useBack } from '@/hooks';
import { formatMoney } from '@/utils/format';

/**
 * 18 Pickup Instructions (reference 8.1): what to do to collect the order. It is
 * self-pickup only: go to the restaurant, show the Pickup QR, staff verify it,
 * take the bag, confirm receipt. Reached from the Pickup QR screen.
 */
export default function PickupInstructionsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const goBack = useBack(orderId ? pickupRoutes.qr(orderId) : '/home');
  const s = usePickupScreen(orderId, ['preparing', 'ready']);
  const toHome = () => router.replace('/home');

  if (s.state === 'loading' || s.state === 'redirecting') {
    return (
      <Screen header={<Header title="Hướng dẫn nhận hàng" onBack={goBack} />} scroll={false}>
        <LoadingState />
      </Screen>
    );
  }
  if (s.state !== 'ok' || !s.order) {
    return (
      <Screen header={<Header title="Hướng dẫn nhận hàng" onBack={goBack} />}>
        <PickupGateState kind={s.state === 'ok' ? 'no_qr' : s.state} onPay={() => router.replace(pickupRoutes.payment(orderId ?? ''))} onRetry={s.reload} onHome={toHome} />
      </Screen>
    );
  }

  const { order, restaurant } = s;
  return (
    <Screen
      header={<Header title={`Đơn ${order.orderCode}`} onBack={goBack} />}
      footer={
        <BottomActionBar>
          <Button label="Theo dõi đơn hàng" onPress={() => router.push(pickupRoutes.ready(order.id))} />
          <Button label="Mở mã nhận hàng" variant="secondary" icon="qr" onPress={() => router.push(pickupRoutes.qr(order.id))} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <Card variant="mint" style={{ alignItems: 'center', gap: Spacing.s10, paddingVertical: Spacing.s20 }}>
          <IconTile name="check" size="xl" tone="white" iconSize={24} />
          <AppText variant="title" style={{ fontSize: 20, textAlign: 'center' }}>
            Đặt hàng thành công!
          </AppText>
          <AppText variant="muted" style={{ textAlign: 'center' }}>
            Quán đang chuẩn bị túi cho bạn.{'\n'}
            <AppText variant="bodyStrong">Nhớ tới quán lấy trong khung giờ đã chọn.</AppText>
          </AppText>
        </Card>

        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name="clock" size="md" iconSize={18} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="caption" color="textMuted">
              Khung giờ nhận
            </AppText>
            <AppText variant="bodyStrong">{`${order.pickupSlot.label} hôm nay`}</AppText>
          </View>
        </Card>

        <PickupInfo
          title="Điểm lấy hàng"
          restaurantName={restaurant?.name ?? 'Nhà hàng'}
          address={restaurant?.address ?? ''}
          distanceKm={restaurant?.distanceKm}
          walkMinutes={restaurant?.walkMinutes}
          onDirections={() => openDirections(restaurant?.address)}
        />

        <Card style={{ gap: 2 }}>
          <AppText variant="bodyStrong">{order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</AppText>
          <AppText variant="caption" color="textMuted">{`Đã thanh toán ${formatMoney(order.money.total)}`}</AppText>
        </Card>

        <AppText variant="cardTitle">Cách nhận hàng</AppText>
        <PickupStepList steps={[...PICKUP_INSTRUCTION_STEPS]} />
      </View>
    </Screen>
  );
}
