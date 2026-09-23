import { View } from 'react-native';

import { Colors } from '@/constants';

/** Onboarding pagination (reference 1.2–1.4): active dot is a 22x7 green pill, others 7x7 grey. */
export function PagerDots({ count, index }: { count: number; index: number }) {
  return (
    <View accessibilityRole="progressbar" style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === index ? 22 : 7,
            height: 7,
            borderRadius: 999,
            backgroundColor: i === index ? Colors.primary : Colors.pagerDot,
          }}
        />
      ))}
    </View>
  );
}
