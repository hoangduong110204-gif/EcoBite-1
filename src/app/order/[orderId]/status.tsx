import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { BottomActionBar, Button, Header, LoadingState, Screen } from '@/components/common';
import { OrderStatusBanner, OrderStatusTimeline, PickupGateState, PickupInfo } from '@/components/order';
import { Spacing } from '@/constants';
import { getPickupStage, getPickupStatusText, openDirections, pickupRoutes, usePickupScreen } from '@/features/pickup';
import { useBack } from '@/hooks';

/**
 * 8.2 Order status (D-5: `/order/[orderId]/status` is the ACTIVE order timeline; the
 * completed-order detail 9.5 is `/order/[orderId]`). The six lifecycle steps with the
 * time each was reached, following the real order state.
 */
export default function OrderStatusScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const goBack = useBack(orderId ? pickupRoutes.qr(orderId) : '/home');
  const s = usePickupScreen(orderId, ['preparing', 'ready']);
  const header = <Header title="Trạng thái đơn" onBack={goBack} />;

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
        <PickupGateState kind={s.state === 'ok' ? 'no_qr' : s.state} onPay={() => router.replace(pickupRoutes.payment(orderId ?? ''))} onRetry={s.reload} onHome={() => router.replace('/home')} />
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
          <Button label="Đưa mã cho nhân viên quét" icon="qr" disabled={!ready} onPress={() => router.push(pickupRoutes.qr(order.id))} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <OrderStatusBanner title={text.title} hint={text.hint} />
        <OrderStatusTimeline status={order.status} history={order.statusHistory} currentHint={ready ? 'Chờ nhân viên quét mã' : 'Quán đang thực hiện'} />
        <PickupInfo
          restaurantName={restaurant?.name ?? 'Nhà hàng'}
          address={restaurant?.address ?? ''}
          distanceKm={restaurant?.distanceKm}
          walkMinutes={restaurant?.walkMinutes}
          onDirections={() => openDirections(restaurant?.address)}
        />
      </View>
    </Screen>
  );
}
