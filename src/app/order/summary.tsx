import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { getFoodBagImage } from '@/media/images';
import { AppText, BottomActionBar, Button, Card, EmptyState, ErrorState, Header, Icon, IconTile, Screen, Skeleton } from '@/components/common';
import { OrderItemRow, OrderPriceBreakdown } from '@/components/order';
import { Colors, Radius, Spacing } from '@/constants';
import { CHECKOUT_ROUTE, PAYMENT_METHOD_ROUTE, useCheckout } from '@/features/checkout';
import { useBack } from '@/hooks';
import { formatKg, formatMoney } from '@/utils/format';
import { calcImpact } from '@/utils/impact';
import { getLineTotal } from '@/utils/order-pricing';

/**
 * 14 Order Summary (reference 6.7): the final review before payment. One block
 * per restaurant (= one Order each), the payment method, and the totals from
 * `utils/order-pricing`. "Chọn cách thanh toán" opens Payment Method; the
 * orders are created there. No delivery fee.
 */
export default function OrderSummaryScreen() {
  const router = useRouter();
  const goBack = useBack(CHECKOUT_ROUTE);
  const { view, status, reload } = useCheckout();
  const header = <Header title="Tóm tắt đơn hàng" onBack={goBack} />;

  if (status === 'error') {
    return (
      <Screen header={header}>
        <ErrorState title="Không tải được đơn hàng" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Thử lại', onPress: reload }} />
      </Screen>
    );
  }
  if (status === 'loading' && view.orderCount > 0) {
    return (
      <Screen header={header}>
        <View style={{ gap: Spacing.md }}>
          <Skeleton height={120} radius={Radius.lg} />
          <Skeleton height={100} radius={Radius.lg} />
        </View>
      </Screen>
    );
  }
  if (view.orderCount === 0) {
    return (
      <Screen header={header}>
        <EmptyState
          icon="cart"
          title="Giỏ hàng đang trống"
          message="Không có đơn nào để xác nhận."
          primaryAction={{ label: 'Khám phá nhà hàng gần bạn', onPress: () => router.replace('/home') }}
        />
      </Screen>
    );
  }
  if (!view.ready) {
    return (
      <Screen header={header}>
        <EmptyState
          icon="clock"
          title="Chưa chọn giờ nhận"
          message={`Hãy chọn giờ nhận cho: ${view.missingSlots.join(', ')}.`}
          primaryAction={{ label: 'Chọn giờ nhận', onPress: () => router.replace(CHECKOUT_ROUTE) }}
        />
      </Screen>
    );
  }

  const impact = calcImpact(view.bagCount);
  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          <Button label={`Chọn cách thanh toán · ${formatMoney(view.money.total)}`} onPress={() => router.push(PAYMENT_METHOD_ROUTE)} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        {view.orderCount > 1 ? (
          <Card variant="warning">
            <AppText variant="caption" style={{ color: Colors.warningNote, lineHeight: 18 }}>
              {`Bạn đang đặt ${view.orderCount} đơn riêng, mỗi quán một đơn. Bạn sẽ thanh toán lần lượt từng đơn bằng mã QR riêng, sau đó nhận ${view.orderCount} mã QR nhận hàng.`}
            </AppText>
          </Card>
        ) : null}

        {view.groups.map(({ restaurant, view: group }, index) => (
          <View key={group.restaurantId} style={{ gap: Spacing.s10 }}>
            <Card style={{ gap: Spacing.s11 }}>
              <AppText variant="cardTitle">
                {view.orderCount > 1 ? `Đơn ${index + 1} · bạn sẽ tới lấy tại` : 'Bạn sẽ tới lấy tại'}
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.s11 }}>
                <Icon name="pin" size={18} color={Colors.primaryDark} />
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="bodyStrong">{group.restaurantName}</AppText>
                  <AppText variant="muted" style={{ fontSize: 12.5 }}>
                    {restaurant?.address}
                  </AppText>
                  <AppText variant="label" color="primaryDark">
                    Khung giờ nhận {group.pickupLabel} hôm nay
                  </AppText>
                </View>
              </View>
              {restaurant ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.s11 }}>
                  <Icon name="phone" size={18} color={Colors.primaryDark} />
                  <AppText variant="muted" style={{ fontSize: 12.5 }}>
                    Quán gọi nếu có thay đổi: <AppText variant="bodyStrong">{restaurant.phone}</AppText>
                  </AppText>
                </View>
              ) : null}
            </Card>
            <Card style={{ gap: Spacing.s11 }}>
              <AppText variant="cardTitle">Túi trong đơn</AppText>
              {group.items.map(({ item, art, summary }) => (
                <OrderItemRow
                  key={item.foodBagId}
                  art={art}
                  image={getFoodBagImage(item.foodBagId)}
                  name={item.name}
                  quantity={item.quantity}
                  detail={summary}
                  lineTotal={getLineTotal(item)}
                />
              ))}
            </Card>
          </View>
        ))}

        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md }}>
          <IconTile name="qr" size="md" iconSize={18} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyStrong" style={{ fontSize: 12.5 }}>
              Cách thanh toán
            </AppText>
            <AppText variant="caption" color="textMuted">
              Chuyển khoản QR ngân hàng
            </AppText>
          </View>
        </Card>

        <OrderPriceBreakdown money={view.money} promoCode={view.groups.find((g) => g.promoCode)?.promoCode} showSavings />

        <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name="leaf" size="md" tone="white" iconSize={18} />
          <AppText variant="caption" color="primaryText" style={{ flex: 1, lineHeight: 17 }}>
            Đơn này cứu <AppText variant="label" color="primaryText">{formatKg(impact.foodKg)} thức ăn</AppText> và tránh{' '}
            <AppText variant="label" color="primaryText">{formatKg(impact.co2Kg)} CO₂</AppText>
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}
