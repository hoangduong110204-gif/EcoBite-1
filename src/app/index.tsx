import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/auth';
import { AppText } from '@/components/common';
import { SPLASH_DURATION_MS, SplashGradient, SplashPalette, Colors, Typography } from '@/constants';
import { getAuthState, resolveAuthRoute } from '@/features/auth';

/** 01 Splash (reference 1.1): brand mark, tagline, thin progress bar, then routes by auth state. */
export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: SPLASH_DURATION_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
    const timer = setTimeout(() => router.replace(resolveAuthRoute(getAuthState())), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [progress, router]);

  return (
    <LinearGradient colors={SplashGradient.colors} start={SplashGradient.start} end={SplashGradient.end} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 34 }}>
        <BrandMark tileSize={104} tone="white" />
        <View style={{ alignItems: 'center', gap: 6, marginTop: 4 }}>
          <AppText style={[Typography.display, { color: Colors.primaryText, letterSpacing: -0.96 }]}>EcoBite</AppText>
          <AppText variant="bodyStrong" style={{ color: SplashPalette.tagline }}>
            Good Food · Green Future
          </AppText>
        </View>
      </View>
      <View style={{ alignItems: 'center', gap: 16, paddingBottom: Math.max(insets.bottom, 16) + 42 }}>
        <View style={{ width: 132, height: 4, borderRadius: 2, backgroundColor: SplashPalette.track, overflow: 'hidden' }}>
          <Animated.View
            style={{
              height: '100%',
              borderRadius: 2,
              backgroundColor: Colors.primary,
              width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }}
          />
        </View>
        <AppText variant="caption" style={{ color: SplashPalette.hint }}>
          Đang chuẩn bị bữa ngon…
        </AppText>
      </View>
    </LinearGradient>
  );
}
