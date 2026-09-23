import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppText, Button, Card, Chip, EmptyState, ErrorState, Header, Icon, Screen, Skeleton } from '@/components/common';
import { OrderCard } from '@/components/order';
import { Colors, Radius, Spacing } from '@/constants';
import {
  countOrdersByTab,
  filterOrders,
  getDefaultTab,
  getOrderAction,
  getOrderCardSubtitle,
  getRefundLine,
  ORDER_TABS,
  resolveOrderRoute,
  summarizeCompleted,
  useOrders,
  type OrderTab,
} from '@/features/order-history';
import { formatKg } from '@/utils/format';

const EMPTY_TAB_MESSAGE: Record<OrderTab, string> = {
  active: 'Không có đơn nào đang xử lý.',
  completed: 'Bạn chưa nhận đơn nào.',
  cancelled: 'Không có đơn nào bị huỷ hay hết hạn.',
};

/**
 * 23 Orders (reference 9.1–9.4): the customer's orders in three segments (Đang xử
 * lý / Đã xong / Đã huỷ). Read-only: it lists orders, it never changes one. An
 * active order opens its flow (status / payment / QR verified) and a finished one
 * its detail (D-5); every multi-restaurant order stays its own card.
 */
export default function OrdersScreen() {
  const router = useRouter();
  const { orders, restaurants, status, reload } = useOrders();
  const [picked, setPicked] = useState<OrderTab | null>(null);
  const header = <Header title="Đơn hàng của tôi" />;

  if (status === 'error') {
    return (
      <Screen header={header}>
        <ErrorState title="Không tải được đơn hàng" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Thử lại', onPress: reload }} />
      </Screen>
    );
  }
  if (status === 'loading') {
    return (
      <Screen header={header}>
        <View style={{ gap: Spacing.md }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={112} radius={Radius.lg} />
          ))}
        </View>
      </Screen>
    );
  }
  if (orders.length === 0) {
    return (
      <Screen header={header}>
        <EmptyState
          icon="orders"
          title="Bạn chưa có đơn hàng nào"
          message="Các đơn bạn đặt sẽ hiện ở đây. Hãy khám phá những túi đang chờ được cứu quanh bạn."
          primaryAction={{ label: 'Khám phá nhà hàng gần bạn', onPress: () => router.navigate('/home') }}
        />
      </Screen>
    );
  }

  const counts = countOrdersByTab(orders);
  const tab = picked ?? getDefaultTab(orders);
  const visible = filterOrders(orders, tab);
  const impact = summarizeCompleted(orders);
  const nameOf = (restaurantId: string) => restaurants.find((r) => r.id === restaurantId)?.name ?? 'Nhà hàng';

  return (
    <Screen header={header}>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {ORDER_TABS.map((t) => (
            <Chip key={t.key} label={`${t.label} · ${counts[t.key]}`} selected={t.key === tab} onPress={() => setPicked(t.key)} />
          ))}
        </View>

        {tab === 'completed' && impact.orderCount > 0 ? (
          <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <Icon name="leaf" size={20} color={Colors.primaryDark} />
            <AppText variant="caption" color="primaryText" style={{ flex: 1, lineHeight: 17 }}>
              {`${impact.orderCount} đơn đã nhận · cứu `}
              <AppText variant="label" color="primaryText">{`${formatKg(impact.foodKg)} thức ăn`}</AppText>
              {' · tránh '}
              <AppText variant="label" color="primaryText">{`${formatKg(impact.co2Kg)} CO₂`}</AppText>
            </AppText>
          </Card>
        ) : null}

        {visible.length === 0 ? (
          <AppText variant="muted" style={{ textAlign: 'center', paddingVertical: Spacing.xl }}>
            {EMPTY_TAB_MESSAGE[tab]}
          </AppText>
        ) : (
          visible.map((order) => {
            const action = getOrderAction(order);
            const refund = getRefundLine(order);
            return (
              <OrderCard
                key={order.id}
                order={order}
                restaurantName={nameOf(order.restaurantId)}
                subtitle={getOrderCardSubtitle(order)}
                onPress={() => router.push(resolveOrderRoute(order))}>
                {action ? <Button label={action.label} size="sm" onPress={() => router.push(action.route)} /> : null}
                {refund ? (
                  <AppText variant="caption" color="primaryDark">
                    {refund}
                  </AppText>
                ) : null}
              </OrderCard>
            );
          })
        )}
      </View>
    </Screen>
  );
}
