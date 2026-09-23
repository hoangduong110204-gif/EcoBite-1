import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, Header, LoadingState, PriceRow, Screen, StatusBadge } from '@/components/common';
import { BagImpactTiles } from '@/components/food-bag';
import { PaymentSuccessHero, PickupGateState } from '@/components/order';
import { Spacing } from '@/constants';
import { getNextPickupStep, pickupRoutes, resolvePickupRoute, usePickupScreen } from '@/features/pickup';
import { formatDateVN, formatKg, formatMoney, formatTimeVN } from '@/utils/format';
import { calcImpact, countBags } from '@/utils/impact';

/**
 * 22 Order Completed (reference 8.7): the order is `picked_up` ("Đã nhận hàng"), the
 * final state. Shows what was paid and the demo impact (`utils/impact`). When the
 * checkout had more restaurants, the NEXT order (paid, not yet picked up) is offered
 * here (D-21); each order keeps its own pickup QR and state. Rating and "order again"
 * (9.7 / 9.6) are not part of this phase.
 */
export default function OrderCompletedScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const s = usePickupScreen(orderId, ['completed']);
  const header = <Header title="Hoàn tất" />;
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
  const bags = countBags(order.items);
  const impact = calcImpact(bags);
  const next = getNextPickupStep(s.orders, order.checkoutId, order.id);
  const nextName = next.kind === 'none' ? '' : (s.restaurants.find((r) => r.id === next.order.restaurantId)?.name ?? 'quán tiếp theo');
  const nextRoute = next.kind === 'pickup' ? resolvePickupRoute(next.order) : next.kind === 'pay' ? pickupRoutes.payment(next.order.id) : null;
  const pickedUpAt = order.statusHistory.picked_up;

  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          {nextRoute ? (
            <>
              <Button label={next.kind === 'pickup' ? 'Nhận đơn tiếp theo' : 'Thanh toán đơn tiếp theo'} onPress={() => router.replace(nextRoute)} />
              <Button label="Về trang chủ" variant="secondary" onPress={toHome} />
            </>
          ) : (
            <Button label="Về trang chủ" onPress={toHome} />
          )}
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <PaymentSuccessHero
          title="Đã nhận hàng tại quán"
          message={`Cảm ơn bạn đã cứu ${bags} túi đồ ăn khỏi thùng rác. Chúc bạn ngon miệng!`}
        />
        <BagImpactTiles
          tiles={[
            { value: formatKg(impact.foodKg), label: 'thức ăn đã cứu' },
            { value: formatKg(impact.co2Kg), label: 'CO₂ tránh được' },
          ]}
        />
        <Card style={{ gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 }}>
            <AppText variant="cardTitle">Đơn hàng</AppText>
            <StatusBadge status={order.status} />
          </View>
          <PriceRow label="Mã đơn" value={order.orderCode} />
          <PriceRow label="Nhà hàng" value={restaurant?.name ?? 'Nhà hàng'} />
          <PriceRow label="Túi" value={order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')} />
          <PriceRow label="Đã thanh toán" value={formatMoney(order.money.total)} />
          {pickedUpAt ? <PriceRow label="Nhận lúc" value={`${formatTimeVN(pickedUpAt)} · ${formatDateVN(pickedUpAt)}`} /> : null}
        </Card>
        {next.kind !== 'none' ? (
          <Card variant="mint">
            <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 12.5 }}>
              {next.kind === 'pickup' ? `Còn đơn của ${nextName} cần nhận` : `Đơn của ${nextName} chưa thanh toán`}
            </AppText>
            <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
              Mỗi quán có một mã QR nhận hàng riêng. Đơn này đã hoàn tất, đơn kia vẫn giữ nguyên trạng thái.
            </AppText>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}
