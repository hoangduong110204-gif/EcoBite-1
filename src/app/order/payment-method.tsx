import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, EmptyState, ErrorState, Header, IconTile, LoadingState, PriceRow, Screen, Skeleton } from '@/components/common';
import { PaymentMethodRow } from '@/components/order';
import { Radius, Spacing } from '@/constants';
import { CHECKOUT_ROUTE, placeCheckout, SUMMARY_ROUTE, useCheckout } from '@/features/checkout';
import { useBack } from '@/hooks';

/**
 * Payment Method (reference 6.8). QR bank transfer is the ONLY enabled method
 * (D-4); the others are shown disabled with "Sắp có". "Tiếp tục thanh toán"
 * creates one Order per restaurant, clears the cart and opens the first Payment
 * QR (`placeCheckout`).
 */
export default function PaymentMethodScreen() {
  const router = useRouter();
  const goBack = useBack(SUMMARY_ROUTE);
  const { view, methods, status, reload } = useCheckout();
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const header = <Header title="Chọn cách thanh toán" onBack={goBack} />;

  // Orders are being created (reference 6.9): the cart is cleared as soon as they are committed, so do not flash the empty state.
  if (busy || placed) {
    return (
      <Screen header={header} scroll={false}>
        <LoadingState message="Đang tạo đơn và giữ túi cho bạn…" />
      </Screen>
    );
  }
  if (status === 'error') {
    return (
      <Screen header={header}>
        <ErrorState title="Không tải được cách thanh toán" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Thử lại', onPress: reload }} />
      </Screen>
    );
  }
  if (status === 'loading') {
    return (
      <Screen header={header}>
        <View style={{ gap: Spacing.s10 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={68} radius={Radius.card} />
          ))}
        </View>
      </Screen>
    );
  }
  if (view.orderCount === 0 || !view.ready) {
    return (
      <Screen header={header}>
        <EmptyState
          icon={view.orderCount === 0 ? 'cart' : 'clock'}
          title={view.orderCount === 0 ? 'Giỏ hàng đang trống' : 'Chưa chọn giờ nhận'}
          message={view.orderCount === 0 ? 'Không có đơn nào để thanh toán.' : `Hãy chọn giờ nhận cho: ${view.missingSlots.join(', ')}.`}
          primaryAction={
            view.orderCount === 0
              ? { label: 'Khám phá nhà hàng gần bạn', onPress: () => router.replace('/home') }
              : { label: 'Chọn giờ nhận', onPress: () => router.replace(CHECKOUT_ROUTE) }
          }
        />
      </Screen>
    );
  }

  const recommended = methods.filter((m) => m.enabled);
  const others = methods.filter((m) => !m.enabled);
  const selected = recommended[0]?.id;

  const pay = async () => {
    if (!selected) return;
    setBusy(true);
    setError(undefined);
    const result = await placeCheckout({ method: selected });
    setBusy(false);
    if (result.ok) {
      setPlaced(true);
      router.replace(result.route);
    } else setError(result.message);
  };

  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          <PriceRow label="Tổng thanh toán" amount={view.money.total} total />
          {error ? (
            <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11.5 }}>
              {error}
            </AppText>
          ) : null}
          <Button label="Tiếp tục thanh toán" loading={busy} disabled={!selected} onPress={pay} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.s10, paddingBottom: Spacing.lg }}>
        <AppText variant="label" color="textMuted">
          Khuyên dùng
        </AppText>
        {recommended.map((m) => (
          <PaymentMethodRow key={m.id} method={m} selected={m.id === selected} />
        ))}
        <AppText variant="label" color="textMuted" style={{ marginTop: Spacing.xs }}>
          Khác
        </AppText>
        {others.map((m) => (
          <PaymentMethodRow key={m.id} method={m} selected={false} />
        ))}
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name="lock" size="sm" iconSize={16} />
          <AppText variant="caption" color="textMuted" style={{ flex: 1, lineHeight: 17 }}>
            EcoBite không lưu thông tin thẻ. Mọi số tài khoản hiển thị trong bản này là{' '}
            <AppText variant="label">số giả lập cho demo</AppText>.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}
