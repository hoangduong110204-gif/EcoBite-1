import type { ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius, Shadows, Sizes, Spacing } from '@/constants';
import type { FoodArt } from '@/types';

import { FoodImage } from './FoodImage';
import { Icon } from './icons';

interface CoverImageProps {
  art: FoodArt;
  image?: ImageSourcePropType;
  /** 236 on Restaurant Detail (4.1), 250 on Food Bag Detail (5.1). */
  height: number;
  onBack: () => void;
  /** Bottom-left badge (availability, stock). */
  badge?: ReactNode;
}

/**
 * Full-bleed cover of the detail screens: food illustration under the status
 * bar, a white 36 px back chip at top-left and an optional badge bottom-left.
 * Use with `Screen edgeToEdge`.
 */
export function CoverImage({ art, image, height, onBack, badge }: CoverImageProps) {
  const insets = useSafeAreaInsets();
  return (
    <FoodImage art={art} image={image} height={height} radius={0}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
        onPress={onBack}
        style={[
          {
            position: 'absolute',
            top: insets.top + Spacing.s6,
            left: Spacing.lg,
            width: Sizes.backChip,
            height: Sizes.backChip,
            borderRadius: Radius.sm,
            backgroundColor: Colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          },
          Shadows.card,
        ]}>
        <Icon name="back" size={18} color={Colors.text} />
      </Pressable>
      {badge ? <View style={{ position: 'absolute', left: Spacing.lg, bottom: Spacing.s14 }}>{badge}</View> : null}
    </FoodImage>
  );
}
