import { View } from 'react-native';

import { AppText, Card } from '@/components/common';
import { Colors, Spacing } from '@/constants';

interface PickupStep {
  title: string;
  detail?: string;
}

/** Numbered "how to pick up" list (Pickup Instructions, reference 8.1): green number badge, title, one line of detail. */
export function PickupStepList({ steps }: { steps: PickupStep[] }) {
  return (
    <Card style={{ gap: Spacing.s14 }}>
      {steps.map((step, index) => (
        <View key={step.title} style={{ flexDirection: 'row', gap: Spacing.md }}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: Colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText variant="label" style={{ color: Colors.white }}>
              {index + 1}
            </AppText>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyStrong">{step.title}</AppText>
            {step.detail ? (
              <AppText variant="caption" color="textMuted" style={{ lineHeight: 17 }}>
                {step.detail}
              </AppText>
            ) : null}
          </View>
        </View>
      ))}
    </Card>
  );
}
