import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { AppText, BottomActionBar, Button, Card, EmptyState, ErrorState, Header, IconTile, Screen, Skeleton } from '@/components/common';
import { PickupTimePicker } from '@/components/order';
import { Colors, Radius, Spacing } from '@/constants';
import { CHECKOUT_ROUTE, usePickupTime } from '@/features/checkout';
import { useBack } from '@/hooks';

/**
 * 13 Select Pickup Time (reference 5.3 / 6.6). One restaurant at a time
 * (`?restaurantId=`): the choice is stored in the real cart for THAT restaurant.
 * A horizontal picker offers only the times inside the bags' pickup window (the
 * intersection of that restaurant's bags). Capacity is still validated on select,
 * but never shown.
 */
export default function PickupTimeScreen() {
  const goBack = useBack(CHECKOUT_ROUTE);
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const p = usePickupTime(restaurantId);
  const header = <Header title="Chọn khung giờ nhận" onBack={goBack} />;

  if (p.status === 'error') {
    return (
      <Screen header={header}>
        <ErrorState title="Không tải được khung giờ" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Thử lại', onPress: p.reload }} />
      </Screen>
    );
  }
  if (p.status === 'loading') {
    return (
      <Screen header={header}>
        <View style={{ gap: Spacing.s10 }}>
          <Skeleton height={64} radius={Radius.lg} />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={56} radius={Radius.lg} />
          ))}
        </View>
      </Screen>
    );
  }
  if (p.status === 'not_in_cart' || !p.restaurant) {
    return (
      <Screen header={header}>
        <EmptyState
          title="Không có đơn cho quán này"
          message="Giỏ hàng không có túi của quán này. Quay lại để kiểm tra đơn."
          primaryAction={{ label: 'Quay lại xác nhận đơn', onPress: goBack }}
        />
      </Screen>
    );
  }

  const { restaurant } = p;
  const confirm = async () => {
    if (await p.confirm()) goBack();
  };
  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          <Button label={p.selected ? `Xác nhận ${p.selected.label}` : 'Chọn giờ nhận'} disabled={!p.selected} onPress={confirm} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name="pin" size="md" tone="white" iconSize={18} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 12.5 }}>
              {restaurant.name}
            </AppText>
            <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
              {restaurant.address} · đi bộ khoảng {restaurant.walkMinutes} phút
            </AppText>
          </View>
        </Card>

        <View style={{ gap: Spacing.s10 }}>
          {p.window ? (
            <AppText variant="bodyStrong">
              Khung giờ nhận hôm nay: {p.window.start} – {p.window.end}
            </AppText>
          ) : null}
          {p.options.length === 0 ? (
            <View style={{ minHeight: 220 }}>
              <EmptyState
                title="Không có khung giờ phù hợp"
                message="Các túi của quán này không có chung một khung giờ nhận. Hãy bỏ bớt một túi khỏi giỏ hàng."
                primaryAction={{ label: 'Về giỏ hàng', onPress: goBack }}
              />
            </View>
          ) : (
            <>
              <AppText variant="caption" color="textMuted">
                Chọn giờ bạn sẽ tới lấy túi
              </AppText>
              <PickupTimePicker
                times={p.options.map((o) => ({ id: o.id, label: o.label, disabled: o.left <= 0 }))}
                selectedId={p.selectedId}
                onSelect={p.choose}
              />
              {p.selected ? (
                <AppText variant="bodyStrong" color="primaryText">
                  Giờ đã chọn: {p.selected.label}
                </AppText>
              ) : null}
            </>
          )}
        </View>

        {p.error ? (
          <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11.5 }}>
            {p.error}
          </AppText>
        ) : null}

        <Card variant="warning" style={{ flexDirection: 'row', gap: Spacing.s11 }}>
          <AppText variant="caption" style={{ flex: 1, color: Colors.warningNote, lineHeight: 18 }}>
            Tới muộn quá 15 phút so với giờ đã chọn, quán có thể để túi cho khách khác.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}
