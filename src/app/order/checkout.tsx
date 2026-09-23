import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { getFoodBagImage } from '@/media/images';
import { AppText, BottomActionBar, Button, Card, EmptyState, ErrorState, Header, IconTile, Screen, Skeleton } from '@/components/common';
import { OrderItemRow, OrderPriceBreakdown, PickupInfo } from '@/components/order';
import { Colors, Radius, Spacing } from '@/constants';
import { useCheckout } from '@/features/checkout';
import { openDirections } from '@/features/pickup';
import { useBack } from '@/hooks';
import { getLineTotal } from '@/utils/order-pricing';

/**
 * 12 Checkout (reference 6.4). Built from the REAL session cart: one section per
 * restaurant (each becomes its own Order), each with its own pickup time. The
 * time is chosen on Select Pickup Time and stored in the cart per restaurant;
 * "Xem tóm tắt đơn" stays disabled until every restaurant has one. There is no
 * delivery fee; totals come from `utils/order-pricing`.
 */
export default function CheckoutScreen() {
  const router = useRouter();
  const goBack = useBack('/cart');
  const { view, status, reload } = useCheckout();
  const header = <Header title="Xác nhận đơn" onBack={goBack} />;

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
          <Skeleton height={64} radius={Radius.lg} />
          <Skeleton height={140} radius={Radius.lg} />
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
          message="Hãy chọn vài túi trước khi thanh toán."
          primaryAction={{ label: 'Khám phá nhà hàng gần bạn', onPress: () => router.replace('/home') }}
          secondaryAction={{ label: 'Về giỏ hàng', onPress: () => router.replace('/cart') }}
        />
      </Screen>
    );
  }

  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          {!view.ready ? (
            <AppText variant="caption" style={{ color: Colors.warningNote, textAlign: 'center' }}>
              Chọn giờ nhận cho: {view.missingSlots.join(', ')}
            </AppText>
          ) : null}
          <Button label="Xem tóm tắt đơn" disabled={!view.ready} onPress={() => router.push('/order/summary')} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name="pin" size="md" tone="white" iconSize={18} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyStrong" color="primaryText">
              Chỉ nhận hàng tại quán
            </AppText>
            <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
              Bạn tự đến quán lấy túi đúng khung giờ đã chọn.
            </AppText>
          </View>
        </Card>

        {view.orderCount > 1 ? (
          <Card variant="warning">
            <AppText variant="caption" style={{ color: Colors.warningNote, lineHeight: 18 }}>
              {`${view.orderCount} quán = ${view.orderCount} đơn riêng. Mỗi quán có giờ nhận, mã QR thanh toán và mã QR nhận hàng riêng.`}
            </AppText>
          </Card>
        ) : null}

        {view.groups.map(({ restaurant, view: group }) => (
          <View key={group.restaurantId} style={{ gap: Spacing.s10 }}>
            <PickupInfo
              title={view.orderCount > 1 ? `Điểm lấy hàng · ${group.restaurantName}` : 'Điểm lấy hàng'}
              restaurantName={group.restaurantName}
              address={restaurant?.address ?? ''}
              distanceKm={restaurant?.distanceKm}
              walkMinutes={restaurant?.walkMinutes}
              onDirections={() => openDirections(restaurant?.address)}
              pickupLabel={group.pickupLabel}
              onPickTime={() => router.push({ pathname: '/order/pickup-time', params: { restaurantId: group.restaurantId } })}
            />
            <Card style={{ gap: Spacing.s11 }}>
              <AppText variant="cardTitle">Túi đã đặt</AppText>
              {group.items.map(({ item, art }) => (
                <OrderItemRow
                  key={item.foodBagId}
                  art={art}
                  image={getFoodBagImage(item.foodBagId)}
                  name={item.name}
                  quantity={item.quantity}
                  detail={item.ownBox ? 'mang hộp riêng' : undefined}
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

        <OrderPriceBreakdown money={view.money} showSavings />
      </View>
    </Screen>
  );
}
