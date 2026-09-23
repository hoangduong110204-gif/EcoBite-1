import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { getFoodBagImage } from '@/media/images';
import { AppText, BottomActionBar, Button, Card, ConfirmDialog, EmptyState, ErrorState, Header, Screen, Skeleton } from '@/components/common';
import { CartItem, CartRestaurantSection, CartSummary } from '@/components/cart';
import { Colors, Radius, Spacing } from '@/constants';
import { APP_CITY } from '@/constants/policy';
import { removeCartItem, setCartItemQuantity, useCartView, type CartViewItem } from '@/features/cart';
import { useAuth } from '@/features/auth';
import { formatMoney } from '@/utils/format';

/**
 * 11 Cart (reference 6.1, empty state 6.2, remove dialog 6.3). One section per
 * restaurant (D-1): each becomes its own order at checkout. State is the session
 * cart store; totals come from `utils/order-pricing` via `useCartView`.
 * There is no delivery fee. "Tiếp tục" opens the Checkout route (built in U1.5).
 */
export default function CartScreen() {
  const router = useRouter();
  const { area } = useAuth();
  const { view, status, reload, availableBagCount } = useCartView();
  const [pendingRemove, setPendingRemove] = useState<{ entry: CartViewItem; restaurantName: string } | null>(null);
  const empty = view.groups.length === 0;

  const changeQuantity = (entry: CartViewItem, restaurantName: string, next: number) => {
    if (next <= 0) setPendingRemove({ entry, restaurantName });
    else setCartItemQuantity(entry.item.foodBagId, next, entry.maxQuantity);
  };

  const header = <Header title="Giỏ hàng" centered onBack={() => router.navigate('/home')} />;

  if (status === 'error') {
    return (
      <Screen header={header}>
        <ErrorState title="Không tải được giỏ hàng" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Thử lại', onPress: reload }} />
      </Screen>
    );
  }
  if (status === 'loading' && !empty) {
    return (
      <Screen header={header}>
        <View style={{ gap: Spacing.md }}>
          <Skeleton width="45%" height={20} />
          <Skeleton height={96} radius={Radius.lg} />
        </View>
      </Screen>
    );
  }
  if (empty) {
    return (
      <Screen header={header}>
        <EmptyState
          icon="cart"
          title="Giỏ hàng đang trống"
          message={
            availableBagCount > 0
              ? `Còn ${availableBagCount} túi đang chờ được cứu quanh ${area?.name ?? APP_CITY} hôm nay.`
              : 'Hãy khám phá các nhà hàng có túi hôm nay.'
          }
          primaryAction={{ label: 'Khám phá nhà hàng gần bạn', onPress: () => router.navigate('/home') }}
          secondaryAction={{ label: 'Hỏi AI xem nên ăn gì', icon: 'leaf', onPress: () => router.push('/ai') }}
        />
      </Screen>
    );
  }

  return (
    <>
      <Screen
        header={header}
        footer={
          <BottomActionBar>
            <CartSummary bagCount={view.count} subtotal={view.money.subtotal} savings={view.money.bagSavings} ownBoxDiscount={view.money.ownBoxDiscount} />
            <Button label={`Tiếp tục · ${formatMoney(view.money.total)}`} onPress={() => router.push('/order/checkout')} />
          </BottomActionBar>
        }>
        <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
          {view.groups.map((group) => (
            <CartRestaurantSection key={group.restaurantId} restaurantName={group.restaurantName} pickupLabel={group.pickupLabel}>
              {group.items.map((entry) => (
                <CartItem
                  key={entry.item.foodBagId}
                  item={entry.item}
                  art={entry.art}
                  image={getFoodBagImage(entry.item.foodBagId)}
                  summary={entry.summary}
                  maxQuantity={entry.maxQuantity}
                  onChangeQuantity={(next) => changeQuantity(entry, group.restaurantName, next)}
                />
              ))}
            </CartRestaurantSection>
          ))}
          {view.restaurantCount > 1 ? (
            <Card variant="warning">
              <AppText variant="caption" style={{ color: Colors.warningNote, lineHeight: 18 }}>
                {`${view.restaurantCount} quán ở các địa chỉ khác nhau — bạn sẽ nhận `}
                <AppText variant="label" style={{ color: Colors.warningNote }}>{`${view.restaurantCount} mã QR riêng`}</AppText>.
              </AppText>
            </Card>
          ) : null}
        </View>
      </Screen>
      <ConfirmDialog
        visible={pendingRemove !== null}
        title="Xoá túi khỏi giỏ?"
        message={
          pendingRemove
            ? `“${pendingRemove.entry.item.name}” của ${pendingRemove.restaurantName} sẽ bị bỏ khỏi giỏ hàng. Chỗ này có thể bị khách khác đặt mất.`
            : undefined
        }
        confirmLabel="Xoá túi"
        cancelLabel="Giữ lại"
        onConfirm={() => {
          if (pendingRemove) removeCartItem(pendingRemove.entry.item.foodBagId);
          setPendingRemove(null);
        }}
        onCancel={() => setPendingRemove(null)}
      />
    </>
  );
}
