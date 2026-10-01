import { useEffect, useRef } from 'react';
import { Animated, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText, Icon } from '@/components/common';
import { Colors, Shadows } from '@/constants';

interface AiOrbProps {
  /** Opens the AI assistant. The caller owns navigation; the orb has no AI logic. */
  onPress: () => void;
  /** 60 px (reference `.cau`) or 40 px compact (`.cau.nho`). */
  size?: 60 | 40;
  /** Positioning of the whole orb+label group. Default matches the reference: right 18, bottom 96. */
  style?: StyleProp<ViewStyle>;
  /** `false` = no absolute positioning: the caller places it (e.g. `DraggableAiOrb`). Default true. */
  floating?: boolean;
}

/**
 * Floating AI assistant orb (reference 11.1 `.cau`): compact EcoBite-green sphere with a
 * glossy highlight, brand leaf, a tiny spark accent and a slow 3.6 s float, plus a small
 * "AI" caption underneath so the orb reads as "tap to ask EcoBite AI" rather than a
 * generic floating widget. No halo, ring or oversized glow — only the app's standard
 * subtle shadow. The caption sits outside the sphere's own hit area, so it never
 * changes the orb's tap/drag target.
 */
export function AiOrb({ onPress, size = 60, style, floating = true }: AiOrbProps) {
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -4, duration: 1800, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  return (
    <View
      pointerEvents="box-none"
      style={[floating ? { position: 'absolute', right: 18, bottom: 96, alignItems: 'center', zIndex: 30 } : { alignItems: 'center' }, style]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Mở trợ lý AI" onPress={onPress} style={{ width: size, height: size }}>
        <Animated.View style={{ flex: 1, transform: [{ translateY: float }] }}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
            start={{ x: 0.15, y: 0.1 }}
            end={{ x: 0.85, y: 0.95 }}
            style={{
              flex: 1,
              borderRadius: size / 2,
              alignItems: 'center',
              justifyContent: 'center',
              ...Shadows.card,
            }}>
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: size * 0.2, top: size * 0.13, width: size * 0.32, height: size * 0.2, borderRadius: size, backgroundColor: Colors.white, opacity: 0.4 }}
            />
            <Icon name="leaf" size={size === 60 ? 21 : 14} color={Colors.white} />
            <View
              pointerEvents="none"
              style={{ position: 'absolute', right: size * 0.14, top: size * 0.14, width: size * 0.09, height: size * 0.09, borderRadius: size, backgroundColor: Colors.white, opacity: 0.85 }}
            />
          </LinearGradient>
        </Animated.View>
      </Pressable>
      <AppText pointerEvents="none" numberOfLines={1} variant="label" color="primaryDark" style={{ marginTop: 3, fontSize: size === 60 ? 10.5 : 9 }}>
        AI
      </AppText>
    </View>
  );
}
