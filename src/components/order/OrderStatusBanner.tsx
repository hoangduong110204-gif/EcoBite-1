import { View } from 'react-native';

import { AppText, Card, IconTile } from '@/components/common';
import { Colors, Spacing } from '@/constants';

interface OrderStatusBannerProps {
  /** e.g. "Túi đã sẵn sàng". */
  title: string;
  /** e.g. "Tới quán trước 19:00 để nhận". */
  hint?: string;
  /** Countdown text on the right, e.g. "36:12". */
  countdown?: string;
}

/** Mint banner above the timeline (reference 8.2): icon, current status, deadline countdown. */
export function OrderStatusBanner({ title, hint, countdown }: OrderStatusBannerProps) {
  return (
    <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
      <IconTile name="box" size="xl" tone="white" iconSize={22} />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="rowTitle" color="primaryText">
          {title}
        </AppText>
        {hint ? (
          <AppText variant="caption" style={{ color: Colors.primaryText }}>
            {hint}
          </AppText>
        ) : null}
      </View>
      {countdown ? (
        <AppText variant="button" color="primaryDark" style={{ fontVariant: ['tabular-nums'] }}>
          {countdown}
        </AppText>
      ) : null}
    </Card>
  );
}
