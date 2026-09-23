import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { getFoodBagImage } from '@/media/images';
import { AppText, BottomActionBar, Button, Card, EmptyState, ErrorState, Header, IconTile, PriceRow, Screen, Skeleton, StatusBadge } from '@/components/common';
import { BagImpactTiles } from '@/components/food-bag';
import { OrderItemRow, OrderPriceBreakdown } from '@/components/order';
import { Colors, Radius, Spacing } from '@/constants';
import { getRefundLine, PAYMENT_METHOD_LABEL, reorderOrder, useOrderDetail } from '@/features/order-history';
import { useBack } from '@/hooks';
import { formatDateVN, formatKg, formatTimeVN } from '@/utils/format';
import { calcImpact, countBags } from '@/utils/impact';
import { getLineTotal } from '@/utils/order-pricing';

const STATUS_HEADLINE = {
  picked_up: 'Đã nhận hàng tại quán',
  cancelled: 'Đơn đã huỷ',
  expired: 'Đơn hết hạn giữ chỗ',
} as const;

/**
 * 24 Order Detail (reference 9.5): the READ-ONLY detail of a FINISHED order (D-5:
 * completed, cancelled or expired). A live order is redirected to its flow (status /
 * payment / QR verified). Money is the order's own `money` (no maths here), impact
 * comes from `utils/impact`. "Đặt lại túi này" puts the same bags in the current
 * cart; the invoice, review and report screens (7.7, 9.7, 4.7) are not part of this phase.
 */
export default function OrderDetailScreen() {
  const router = useRouter();
  const goBack = useBack('/orders');
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { order, restaurant, bags, status, reload } = useOrderDetail(orderId);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | undefined>();
  const header = <Header title={order?.orderCode ?? 'Chi tiết đơn'} onBack={goBack} />;

  if (status === 'loading' || status === 'redirecting') {
    return (
      <Screen header={header}>
        <View style={{ gap: Spacing.md }}>
          <Skeleton height={64} radius={Radius.lg} />
          <Skeleton height={120} radius={Radius.lg} />
        </View>
      </Screen>
    );
  }
  if (status === 'error') {
    return (
      <Screen header={header}>
        <ErrorState title="Không tải được đơn hàng" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Thử lại', onPress: reload }} secondaryAction={{ label: 'Về đơn hàng', onPress: () => router.replace('/orders') }} />
      </Screen>
    );
  }
  if (status === 'not_found' || !order) {
    return (
      <Screen header={header}>
        <EmptyState
          icon="orders"
          title="Không tìm thấy đơn hàng"
          message="Đơn hàng này không tồn tại hoặc không thuộc tài khoản của bạn."
          primaryAction={{ label: 'Xem đơn hàng của tôi', onPress: () => router.replace('/orders') }}
        />
      </Screen>
    );
  }

  const terminal = order.status as keyof typeof STATUS_HEADLINE;
  const when =
    order.status === 'picked_up'
      ? order.statusHistory.picked_up
      : order.status === 'cancelled'
        ? order.cancellation?.cancelledAt
        : (order.statusHistory.expired ?? order.createdAt);
  const refund = getRefundLine(order);
  const impact = calcImpact(countBags(order.items));
  const restaurantName = restaurant?.name ?? 'Nhà hàng';

  const reorder = async () => {
    setBusy(true);
    setNotice(undefined);
    const result = await reorderOrder(order);
    setBusy(false);
    if (result.added > 0) {
      router.navigate('/cart');
    } else {
      setNotice(`Không thể đặt lại: ${result.skipped.join(', ')} hiện đã hết hoặc không còn bán.`);
    }
  };

  return (
    <Screen
      header={header}
      footer={
        order.status === 'picked_up' ? (
          <BottomActionBar>
            {notice ? (
              <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11.5 }}>
                {notice}
              </AppText>
            ) : null}
            <Button label="Đặt lại túi này" loading={busy} onPress={reorder} />
          </BottomActionBar>
        ) : undefined
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <Card variant={order.status === 'picked_up' ? 'mint' : 'outline'} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name={order.status === 'picked_up' ? 'check' : 'clock'} size="xl" tone={order.status === 'picked_up' ? 'white' : 'neutral'} iconSize={20} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="rowTitle" color={order.status === 'picked_up' ? 'primaryText' : 'text'}>
              {STATUS_HEADLINE[terminal] ?? 'Đơn hàng'}
            </AppText>
            {when ? (
              <AppText variant="caption" color={order.status === 'picked_up' ? 'primaryText' : 'textMuted'}>
                {`${formatDateVN(when)} · ${formatTimeVN(when)}`}
              </AppText>
            ) : null}
          </View>
          <StatusBadge status={order.status} />
        </Card>

        <Card style={{ gap: Spacing.s10 }}>
          <AppText variant="cardTitle">Nhà hàng</AppText>
          <AppText variant="bodyStrong" onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: order.restaurantId } })} style={{ color: Colors.primaryDark }}>
            {restaurantName}
          </AppText>
          {restaurant ? (
            <AppText variant="caption" color="textMuted">
              {restaurant.address}
            </AppText>
          ) : null}
        </Card>

        <Card style={{ gap: Spacing.s11 }}>
          <AppText variant="cardTitle">Túi trong đơn</AppText>
          {order.items.map((item) => (
            <OrderItemRow
              key={item.foodBagId}
              art={bags.find((b) => b.id === item.foodBagId)?.art ?? restaurant?.art ?? 'rice'}
              image={getFoodBagImage(item.foodBagId)}
              name={item.name}
              quantity={item.quantity}
              detail={item.ownBox ? 'mang hộp riêng' : undefined}
              lineTotal={getLineTotal(item)}
            />
          ))}
        </Card>

        <OrderPriceBreakdown money={order.money} promoCode={order.promoCode} showSavings totalLabel={order.paymentStatus === 'success' ? 'Đã thanh toán' : 'Tổng cộng'} />

        <Card style={{ gap: 2 }}>
          <PriceRow label="Cách thanh toán" value={PAYMENT_METHOD_LABEL[order.paymentMethod]} />
          <PriceRow label="Khung giờ nhận" value={order.pickupSlot.label} />
          <PriceRow label="Đặt lúc" value={`${formatTimeVN(order.createdAt)} · ${formatDateVN(order.createdAt)}`} />
          {order.statusHistory.picked_up ? <PriceRow label="Nhận lúc" value={formatTimeVN(order.statusHistory.picked_up)} /> : null}
          {order.cancellation ? <PriceRow label="Lý do huỷ" value={order.cancellation.reason} /> : null}
          {refund ? <PriceRow label="Hoàn tiền" value={refund} /> : null}
        </Card>

        {order.status === 'picked_up' ? (
          <BagImpactTiles
            tiles={[
              { value: formatKg(impact.foodKg), label: 'thức ăn đã cứu' },
              { value: formatKg(impact.co2Kg), label: 'CO₂ tránh được' },
            ]}
          />
        ) : null}
      </View>
    </Screen>
  );
}
