import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { OnboardingIllustration, PagerDots } from '@/components/auth';
import { AppText, Badge, BottomActionBar, Button, Screen } from '@/components/common';
import { Spacing } from '@/constants';
import { ONBOARDING_SLIDES, completeOnboarding, useAuthGuard } from '@/features/auth';

/** 02 Onboarding (reference 1.2–1.4): three slides, "Bỏ qua" skips to Welcome, last "Tiếp tục" → Welcome. */
export default function OnboardingScreen() {
  const router = useRouter();
  const allowed = useAuthGuard('public');
  const [index, setIndex] = useState(0);
  const slide = ONBOARDING_SLIDES[index];
  const last = index === ONBOARDING_SLIDES.length - 1;

  const finish = () => {
    const result = completeOnboarding();
    if (result.ok) router.replace(result.route);
  };

  if (!allowed) return null;
  return (
    <Screen
      scroll={false}
      padded={false}
      footer={
        <BottomActionBar transparent>
          <View style={{ gap: 18 }}>
            <PagerDots count={ONBOARDING_SLIDES.length} index={index} />
            <Button label="Tiếp tục" onPress={() => (last ? finish() : setIndex(index + 1))} />
          </View>
        </BottomActionBar>
      }
      header={
        <View style={{ alignItems: 'flex-end', paddingHorizontal: Spacing.s20, paddingVertical: Spacing.md }}>
          <Pressable accessibilityRole="button" onPress={finish} hitSlop={10}>
            <AppText variant="label" color="textMuted">
              Bỏ qua
            </AppText>
          </Pressable>
        </View>
      }>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26, paddingHorizontal: 30 }}>
        <OnboardingIllustration art={slide.key} />
        <View style={{ alignItems: 'center', gap: 10 }}>
          <Badge label={slide.tag} tone="green" />
          <AppText variant="title" style={{ fontSize: 25, lineHeight: 30, textAlign: 'center' }}>
            {slide.title[0]}
            {'\n'}
            {slide.title[1]}
          </AppText>
          <AppText variant="muted" style={{ textAlign: 'center', maxWidth: 260 }}>
            {slide.body}
          </AppText>
        </View>
      </View>
    </Screen>
  );
}
