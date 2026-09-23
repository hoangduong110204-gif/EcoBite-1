import { View } from 'react-native';

import { AppText, Card } from '@/components/common';
import { Colors, Spacing } from '@/constants';

interface PickupInfoTilesProps {
  /** e.g. "18:00 – 20:00"; null when every bag is sold out. */
  pickupWindowLabel: string | null;
  walkMinutes: number;
}

const CAPTION = { fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' } as const;

/** Restaurant Detail (4.1): two tiles, "Giờ nhận hôm nay" (mint) and "Đi bộ khoảng" (outline). */
export function PickupInfoTiles({ pickupWindowLabel, walkMinutes }: PickupInfoTilesProps) {
  return (
    <View style={{ flexDirection: 'row', gap: Spacing.s10 }}>
      <Card variant="mint" style={{ flex: 1, gap: 3, padding: Spacing.md }}>
        <AppText variant="label" color="primaryText" style={CAPTION}>
          Giờ nhận hôm nay
        </AppText>
        <AppText variant="cardTitle" color="primaryText">
          {pickupWindowLabel ?? 'Đã hết túi'}
        </AppText>
      </Card>
      <Card variant="outline" style={{ flex: 1, gap: 3, padding: Spacing.md }}>
        <AppText variant="label" color="textFaint" style={CAPTION}>
          Đi bộ khoảng
        </AppText>
        <AppText variant="cardTitle" style={{ color: Colors.text }}>
          {walkMinutes} phút
        </AppText>
      </Card>
    </View>
  );
}
