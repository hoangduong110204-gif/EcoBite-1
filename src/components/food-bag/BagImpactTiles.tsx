import { View } from 'react-native';

import { AppText, Card } from '@/components/common';
import { Spacing } from '@/constants';

interface ImpactTile {
  value: string;
  label: string;
}

/** Two outlined tiles: "1,2 kg thức ăn được cứu" and "2,5 kg CO₂ không thải ra" (5.1). */
export function BagImpactTiles({ tiles }: { tiles: [ImpactTile, ImpactTile] }) {
  return (
    <View style={{ flexDirection: 'row', gap: Spacing.s10 }}>
      {tiles.map((t) => (
        <Card key={t.label} variant="outline" style={{ flex: 1, gap: 3, padding: Spacing.s13 }}>
          <AppText variant="section" color="primaryDark" style={{ fontSize: 16 }}>
            {t.value}
          </AppText>
          <AppText variant="label" color="textMuted" style={{ fontSize: 10.5 }}>
            {t.label}
          </AppText>
        </Card>
      ))}
    </View>
  );
}
