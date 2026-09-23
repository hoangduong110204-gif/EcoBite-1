import { Pressable, View } from 'react-native';

import { AppText, Badge, Card, Icon, IconTile } from '@/components/common';
import { Colors, Spacing } from '@/constants';

interface PromoCodeRowProps {
  /** Applied code; `null` shows the "Thêm mã giảm giá" prompt. */
  appliedCode: string | null;
  onPress: () => void;
}

/** Checkout row (reference 6.4): gift tile, prompt or applied code, chevron. */
export function PromoCodeRow({ appliedCode, onPress }: PromoCodeRowProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md }}>
        <IconTile name="gift" size="md" iconSize={18} />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <AppText variant="bodyStrong" style={{ fontSize: 12.5 }}>
            {appliedCode ? 'Mã giảm giá' : 'Thêm mã giảm giá'}
          </AppText>
          {appliedCode ? <Badge label={appliedCode} tone="green" /> : null}
        </View>
        <Icon name="chevronRight" size={16} color={Colors.textFaint} />
      </Card>
    </Pressable>
  );
}
