import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, Header, IconTile, LoadingState, PriceRow, Screen } from '@/components/common';
import { PaymentSuccessHero, PickupGateState } from '@/components/order';
import { Spacing } from '@/constants';
import { confirmReceived, pickupRoutes, usePickupScreen } from '@/features/pickup';
import { formatDateVN, formatTimeVN } from '@/utils/format';
import { countBags } from '@/utils/impact';

/**
 * 21 QR Verified (reference 8.6). Reached automatically once restaurant staff scan
 * the Pickup QR (`ready → qr_verified`). "Tôi đã nhận đủ túi" is the customer's
 * confirmation (`qr_verified → picked_up`) and opens Order Completed. No new order,
 * payment or pickup token is created here.
 */
export default function QrVerifiedScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const s = usePickupScreen(orderId, ['verified']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const header = <Header title="Xác nhận nhận hàng" />;

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
  const verifiedAt = order.statusHistory.qr_verified;
  const ownBoxBags = countBags(order.items.filter((i) => i.ownBox));
  const receive = async () => {
    setBusy(true);
    setError(undefined);
    const result = await confirmReceived(order.id);
    setBusy(false);
    if (result.ok) router.replace(pickupRoutes.completed(order.id));
    else setError(result.message);
  };

  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          {error ? (
            <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11.5 }}>
              {error}
            </AppText>
          ) : null}
          <Button label="Tôi đã nhận đủ túi" loading={busy} onPress={receive} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <PaymentSuccessHero title="QR đã được xác nhận" message="Nhân viên đã quét mã. Nhận túi từ quán và kiểm tra giúp EcoBite xem có đúng như mô tả không nhé." />
        <Card style={{ gap: 2 }}>
          <PriceRow label="Mã đơn" value={order.orderCode} />
          <PriceRow label="Nhà hàng" value={restaurant?.name ?? 'Nhà hàng'} />
          {verifiedAt ? <PriceRow label="Xác nhận lúc" value={`${formatTimeVN(verifiedAt)} · ${formatDateVN(verifiedAt)}`} /> : null}
          <PriceRow label="Điểm nhận" value={`Quầy ${restaurant?.name ?? 'quán'}`} />
        </Card>
        {ownBoxBags > 0 ? (
          <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <IconTile name="box" size="md" tone="white" iconSize={18} />
            <AppText variant="caption" color="primaryText" style={{ flex: 1, lineHeight: 17 }}>
              Bạn đã dùng hộp riêng — <AppText variant="label" color="primaryText">{`tiết kiệm thêm ${ownBoxBags} hộp nhựa`}</AppText>
            </AppText>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}
