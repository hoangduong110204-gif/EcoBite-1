import { View } from 'react-native';

import { AppText, Badge, Button, Card, Divider, Icon } from '@/components/common';
import { Colors, Spacing } from '@/constants';
import { formatDistance } from '@/utils/format';

interface PickupInfoProps {
  restaurantName: string;
  address: string;
  distanceKm?: number;
  walkMinutes?: number;
  /** Shows the "Chỉ đường" button when provided. Opening maps stays in the caller. */
  onDirections?: () => void;
  /** Chosen pickup time ("18:30 – 19:00"); `null` = not chosen yet. `undefined` hides the time row. */
  pickupLabel?: string | null;
  /** "Đổi" / "Chọn giờ" button of the time row. */
  onPickTime?: () => void;
  /** Heading of the card (default "Điểm lấy hàng"). */
  title?: string;
}

/** "Điểm lấy hàng" card (reference 6.4, 8.1, 8.2): restaurant, address, distance and directions. */
export function PickupInfo({ restaurantName, address, distanceKm, walkMinutes, onDirections, pickupLabel, onPickTime, title = 'Điểm lấy hàng' }: PickupInfoProps) {
  const detail = [address, distanceKm !== undefined ? formatDistance(distanceKm) : null, walkMinutes !== undefined ? `đi bộ ${walkMinutes} phút` : null]
    .filter(Boolean)
    .join(' · ');
  return (
    <Card style={{ gap: Spacing.s11 }}>
      <AppText variant="cardTitle">{title}</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.s11 }}>
        <View style={{ marginTop: 1 }}>
          <Icon name="pin" size={18} color={Colors.primaryDark} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="bodyStrong">{restaurantName}</AppText>
          <AppText variant="muted" style={{ fontSize: 12.5 }}>
            {detail}
          </AppText>
        </View>
        {onDirections ? <Button label="Chỉ đường" variant="soft" size="xs" onPress={onDirections} /> : null}
      </View>
      {pickupLabel !== undefined ? (
        <>
          <Divider />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.s11 }}>
            <Icon name="clock" size={18} color={Colors.primaryDark} />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.s6 }}>
              {pickupLabel ? (
                <AppText variant="muted" style={{ fontSize: 12.5 }}>
                  Giờ tới lấy <AppText variant="bodyStrong">{pickupLabel}</AppText> hôm nay
                </AppText>
              ) : (
                <Badge label="Chưa chọn giờ nhận" tone="amber" />
              )}
            </View>
            {onPickTime ? <Button label={pickupLabel ? 'Đổi' : 'Chọn giờ'} variant="soft" size="xs" onPress={onPickTime} /> : null}
          </View>
        </>
      ) : null}
    </Card>
  );
}
