import { View } from 'react-native';

import { AppText, Card, IconTile } from '@/components/common';
import { Spacing } from '@/constants';
import { formatCountdown } from '@/utils/format';

interface HoldTimerCardProps {
  /** Seconds left of the bag hold. */
  secondsLeft: number;
  /** Clock time the bags are held until, e.g. "17:46". */
  heldUntil: string;
}

/** "Mã giữ chỗ còn hiệu lực · Túi được giữ tới 17:46 · 09:42" card of the Payment QR screen (7.1). */
export function HoldTimerCard({ secondsLeft, heldUntil }: HoldTimerCardProps) {
  return (
    <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
      <IconTile name="clock" size="md" tone="white" iconSize={18} />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 12.5 }}>
          Mã giữ chỗ còn hiệu lực
        </AppText>
        <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
          Túi được giữ tới {heldUntil}
        </AppText>
      </View>
      <AppText variant="section" color="primaryDark" style={{ fontVariant: ['tabular-nums'] }}>
        {formatCountdown(secondsLeft)}
      </AppText>
    </Card>
  );
}
