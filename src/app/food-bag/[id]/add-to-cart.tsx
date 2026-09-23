import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { getFoodBagImage } from '@/media/images';
import { AppText, Button, LoadingState } from '@/components/common';
import { AddToCartSheet, FoodBagQuantity, OwnBoxRow } from '@/components/food-bag';
import { Colors, Spacing } from '@/constants';
import { CART_MESSAGES } from '@/features/cart';
import { useAddToCart } from '@/features/food-bag';
import { useBack } from '@/hooks';
import { formatMoney } from '@/utils/format';

/**
 * 10 Add to Cart (reference 5.6): a bottom sheet over Food Bag Detail. The
 * quantity is limited to what the restaurant has left minus what the cart
 * already holds; "Thêm N túi" updates the real session cart, then opens Cart.
 */
export default function AddToCartScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const close = useBack({ pathname: '/food-bag/[id]', params: { id } });
  const a = useAddToCart(id);
  const { bag, restaurant, sheet } = a;

  const add = async () => {
    const result = await a.submit();
    if (result?.ok) router.dismissTo(result.route);
  };

  const message = (text: string, action: { label: string; onPress: () => void }) => (
    <View style={{ gap: Spacing.md }}>
      <AppText variant="muted" style={{ textAlign: 'center' }}>
        {text}
      </AppText>
      <Button label={action.label} onPress={action.onPress} />
    </View>
  );

  let body;
  if (a.status === 'loading') body = <View style={{ minHeight: 140 }}><LoadingState /></View>;
  else if (!bag || !restaurant || !sheet) body = message(a.status === 'error' ? 'Không tải được túi. Thử lại nhé.' : CART_MESSAGES.not_found, { label: 'Đóng', onPress: close });
  else if (sheet.kind === 'sold_out') body = message(CART_MESSAGES.sold_out, { label: 'Đóng', onPress: close });
  else if (sheet.kind === 'limit_reached') body = message(`${CART_MESSAGES.limit_reached} (${sheet.inCart} túi trong giỏ)`, { label: 'Xem giỏ hàng', onPress: () => router.dismissTo('/cart') });
  else
    body = (
      <>
        <FoodBagQuantity value={a.quantity} left={bag.left} max={a.addable} onChange={a.setQuantity} />
        <OwnBoxRow checked={a.ownBox} onChange={a.setOwnBox} hint={CART_MESSAGES.ownBoxHint} />
        {a.error ? (
          <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11.5 }}>
            {a.error}
          </AppText>
        ) : null}
        <Button label={`Thêm ${a.quantity} túi · ${formatMoney(a.total)}`} loading={a.busy} onPress={add} />
      </>
    );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' }}>
      <Pressable accessibilityLabel="Đóng" style={{ flex: 1 }} onPress={close} />
      <AddToCartSheet
        art={bag?.art ?? 'rice'}
        image={getFoodBagImage(bag?.id)}
        name={bag?.name ?? 'Túi'}
        subtitle={bag && restaurant ? `${restaurant.name} · nhận ${bag.pickupWindow.label}` : ''}
        price={bag?.price ?? 0}
        originalPrice={bag?.originalPrice ?? 0}>
        {body}
      </AddToCartSheet>
    </View>
  );
}
