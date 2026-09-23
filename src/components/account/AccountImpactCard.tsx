import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '@/components/common';
import { AccountImpactArt, Colors, Radius, Spacing } from '@/constants';

interface ImpactStat {
  value: string;
  label: string;
}

/** "Thành tích của bạn" (reference 10.1): green gradient card with three stats (bags, food, CO₂). */
export function AccountImpactCard({ stats }: { stats: [ImpactStat, ImpactStat, ImpactStat] }) {
  return (
    <LinearGradient
      colors={AccountImpactArt.gradient.colors}
      start={AccountImpactArt.gradient.start}
      end={AccountImpactArt.gradient.end}
      style={{ borderRadius: Radius.hero - 2, padding: 17, gap: Spacing.s13 }}>
      <AppText variant="rowTitle" style={{ color: Colors.white }}>
        Thành tích của bạn
      </AppText>
      <View style={{ flexDirection: 'row', gap: Spacing.s10 }}>
        {stats.map((s) => (
          <View key={s.label} style={{ flex: 1, gap: 2, padding: Spacing.s11, borderRadius: Radius.sm + 2, backgroundColor: AccountImpactArt.tile }}>
            <AppText variant="section" style={{ color: Colors.white, fontSize: 16 }}>
              {s.value}
            </AppText>
            <AppText variant="label" style={{ color: AccountImpactArt.label, fontSize: 10.5 }}>
              {s.label}
            </AppText>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}
