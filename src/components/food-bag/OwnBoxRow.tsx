import { View } from 'react-native';

import { AppText, Card, Checkbox, IconTile } from '@/components/common';
import { Spacing } from '@/constants';

interface OwnBoxRowProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Discount per bag, already formatted (e.g. "−2.000đ/túi"). */
  hint: string;
}

/** "Tôi sẽ mang hộp riêng (−2.000đ/túi)" row of the add-to-cart sheet (5.6). */
export function OwnBoxRow({ checked, onChange, hint }: OwnBoxRowProps) {
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.s11, padding: Spacing.s13 }}>
      <IconTile name="box" size="sm" iconSize={17} />
      <View style={{ flex: 1 }}>
        <AppText variant="caption" color="textMuted" style={{ lineHeight: 17 }}>
          Tôi sẽ mang hộp riêng{' '}
          <AppText variant="label" color="primaryDark">
            ({hint})
          </AppText>
        </AppText>
      </View>
      <Checkbox checked={checked} onChange={onChange} size={22} accessibilityLabel="Mang hộp riêng" />
    </Card>
  );
}
