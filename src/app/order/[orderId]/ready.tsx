import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, Header, LoadingState, PriceRow, Screen } from '@/components/common';
import { OrderStatusBanner, PickupGateState, PickupInfo } from '@/components/order';
import { Spacing } from '@/constants';
import { ORDER_STATUS_LABEL } from '@/constants/order-status';
import { getPickupStage, getPickupStatusText, openDirections, pickupRoutes, usePickupScreen } from '@/features/pickup';
import { useBack } from '@/hooks';

/**
 * 19 Order Ready (reference 8.4). The order goes paid → preparing → ready on the
 * restaurant side (mock, driven by the dev controls); this screen follows it. While
 * the order is still preparing it shows the preparing state and offers no way to
 * start the pickup. Once ready it says so and leads to Customer Arrives.
 */
export default function OrderReadyScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const goBack = useBack(orderId ? pickupRoutes.instructions(orderId) : '/home');
  const s = usePickupScreen(orderId, ['preparing', 'ready']);
  const header = <Header title="Trạng thái đơn" onBack={goBack} />;
  const toHome = () => router.replace('/home');

  if (s.state === 'loading' || s.state === 'redirecting') {
    return (
      <Screen header={header} scroll={false}>
        <LoadingState />
      </Screen>
    );
  }
  if (s.state !== 'ok' || !s.order) {
    return (
      <Screen header={header}>
        <PickupGateState kind={s.state === 'ok' ? 'no_qr' : s.state} onPay={() => router.replace(pickupRoutes.payment(orderId ?? ''))} onRetry={s.reload} onHome={toHome} />
      </Screen>
    );
  }

  const { order, restaurant } = s;
  const ready = getPickupStage(order) === 'ready';
  const text = getPickupStatusText(order);
  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          {ready ? (
            <>
              <Button label="Tôi đang tới quán" onPress={() => router.push(pickupRoutes.arrived(order.id))} />
              <Button label="Mở mã nhận hàng" variant="secondary" icon="qr" onPress={() => router.push(pickupRoutes.qr(order.id))} />
            </>
          ) : (
            <>
              <Button label="Chờ quán chuẩn bị xong" disabled />
              <Button label="Xem trạng thái đơn" variant="secondary" onPress={() => router.push(pickupRoutes.status(order.id))} />
            </>
          )}
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <OrderStatusBanner title={text.title} hint={text.hint} />
        <Card variant={ready ? 'mint' : 'outline'}>
          <AppText variant="bodyStrong" color={ready ? 'primaryText' : 'text'} style={{ marginBottom: 4 }}>
            {ready ? 'Túi của bạn đã sẵn sàng' : 'Quán đang chuẩn bị túi cho bạn'}
          </AppText>
          <AppText variant="caption" color={ready ? 'primaryText' : 'textMuted'} style={{ lineHeight: 18 }}>
            {ready
              ? `${restaurant?.name ?? 'Quán'} đã chuẩn bị xong. Tới quán lúc ${order.pickupSlot.label} và mở mã QR để nhận.`
              : 'Màn hình sẽ tự cập nhật khi quán báo túi đã sẵn sàng. Bạn chưa cần tới quán.'}
          </AppText>
        </Card>
        <PickupInfo
          restaurantName={restaurant?.name ?? 'Nhà hàng'}
          address={restaurant?.address ?? ''}
          distanceKm={restaurant?.distanceKm}
          walkMinutes={restaurant?.walkMinutes}
          onDirections={() => openDirections(restaurant?.address)}
        />
        <Card style={{ gap: 2 }}>
          <PriceRow label="Mã đơn" value={order.orderCode} />
          <PriceRow label="Khung giờ" value={order.pickupSlot.label} />
          <PriceRow label="Trạng thái" value={ORDER_STATUS_LABEL[order.status]} />
        </Card>
      </View>
    </Screen>
  );
}
