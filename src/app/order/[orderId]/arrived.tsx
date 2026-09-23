import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, EmptyState, Header, LoadingState, Screen } from '@/components/common';
import { OrderStatusBanner, PickupGateState, PickupInfo } from '@/components/order';
import { Spacing } from '@/constants';
import { getPickupStage, openDirections, pickupRoutes, usePickupScreen } from '@/features/pickup';
import { useBack } from '@/hooks';

/**
 * 20 Customer Arrives (reference 8.5). The customer says they are at the
 * restaurant; that only opens the Pickup QR for the staff to scan. It does NOT
 * complete the order: completion needs the staff scan (QR Verified) and then the
 * customer's confirmation. Before the order is ready this screen refuses to start
 * the pickup.
 */
export default function ArrivedScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const goBack = useBack(orderId ? pickupRoutes.ready(orderId) : '/home');
  const s = usePickupScreen(orderId, ['preparing', 'ready']);
  const header = <Header title="Tới quán nhận túi" onBack={goBack} />;

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
  if (getPickupStage(order) !== 'ready') {
    // Not ready yet: the pickup cannot start.
    return (
      <Screen header={header}>
        <EmptyState
          icon="clock"
          title="Túi chưa sẵn sàng"
          message="Quán vẫn đang chuẩn bị túi của bạn. Bạn chỉ cần tới quán khi nhận được thông báo sẵn sàng."
          primaryAction={{ label: 'Xem trạng thái đơn', onPress: () => router.replace(pickupRoutes.ready(order.id)) }}
        />
      </Screen>
    );
  }

  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          <Button label="Tôi đã tới quán" icon="qr" onPress={() => router.push(pickupRoutes.qr(order.id))} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <OrderStatusBanner title="Túi đang chờ bạn ở quán" hint={`Khung giờ nhận ${order.pickupSlot.label}`} />
        <PickupInfo
          restaurantName={restaurant?.name ?? 'Nhà hàng'}
          address={restaurant?.address ?? ''}
          distanceKm={restaurant?.distanceKm}
          walkMinutes={restaurant?.walkMinutes}
          onDirections={() => openDirections(restaurant?.address)}
        />
        <Card variant="mint">
          <AppText variant="caption" color="primaryText" style={{ lineHeight: 18 }}>
            Khi tới quán, bấm “Tôi đã tới quán” để mở mã QR và đưa cho nhân viên quét. Đơn chỉ hoàn tất sau khi nhân viên quét mã và bạn xác nhận đã nhận túi.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}
