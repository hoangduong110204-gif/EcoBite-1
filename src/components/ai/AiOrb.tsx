import { useEffect, useRef } from 'react';
import { Animated, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from '@/components/common';
import { Colors, OrbGradient, Shadows } from '@/constants';

interface AiOrbProps {
  /** Opens the AI assistant. The caller owns navigation; the orb has no AI logic. */
  onPress: () => void;
  /** 60 px (reference `.cau`) or 40 px compact (`.cau.nho`). */
  size?: 60 | 40;
  /** Positioning. Default matches the reference: right 18, bottom 96. */
  style?: StyleProp<ViewStyle>;
  /** `false` = no absolute positioning: the caller places it (e.g. `DraggableAiOrb`). Default true. */
  floating?: boolean;
}

/**
 * Floating AI assistant orb (reference 11.1 `.cau`): compact iridescent sphere with a
 * glossy highlight, brand leaf and a slow 3.6 s float. No halo, ring or coloured glow:
 * only the app's standard subtle shadow. The conic gradient of the CSS is approximated
 * with a multi-stop linear gradient.
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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Mở trợ lý AI"
      onPress={onPress}
      style={[floating ? { position: 'absolute', right: 18, bottom: 96, width: size, height: size, zIndex: 30 } : { width: size, height: size }, style]}>
      <Animated.View style={{ flex: 1, transform: [{ translateY: float }] }}>
        <LinearGradient
          colors={OrbGradient.colors}
          start={OrbGradient.start}
          end={OrbGradient.end}
          style={{
            flex: 1,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadows.card,
          }}>
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: size * 0.2, top: size * 0.13, width: size * 0.35, height: size * 0.22, borderRadius: size, backgroundColor: Colors.white, opacity: 0.9 }}
          />
          <Icon name="leaf" size={size === 60 ? 21 : 14} color={Colors.primaryDark} />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
