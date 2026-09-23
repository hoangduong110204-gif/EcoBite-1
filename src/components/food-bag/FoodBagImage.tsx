import { Text, View, type ImageSourcePropType } from 'react-native';

import { FoodImage } from '@/components/common';
import { Colors, Radius, Typography } from '@/constants';
import type { FoodArt } from '@/types';

interface FoodBagImageProps {
  art: FoodArt;
  image?: ImageSourcePropType;
  /** Square size for list rows (74 in bag lists, 70 in the cart, 62 in the sheet). */
  size?: number;
  radius?: number;
  /** Optional corner label, e.g. "-20%". */
  cornerLabel?: string;
}

/** Bag picture: the photo (or the placeholder illustration) with an optional corner label. */
export function FoodBagImage({ art, image, size = 74, radius = Radius.image, cornerLabel }: FoodBagImageProps) {
  return (
    <FoodImage art={art} image={image} width={size} height={size} radius={radius}>
      {cornerLabel ? (
        <View style={{ position: 'absolute', top: 5, right: 5, backgroundColor: Colors.primary, borderRadius: Radius.pill, paddingVertical: 2, paddingHorizontal: 6 }}>
          <Text style={[Typography.badge, { color: Colors.white }]}>{cornerLabel}</Text>
        </View>
      ) : null}
    </FoodImage>
  );
}
