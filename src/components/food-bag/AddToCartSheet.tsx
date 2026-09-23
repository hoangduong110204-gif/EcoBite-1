import type { ReactNode } from 'react';
import { View, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Divider } from '@/components/common';
import { SheetStyles } from '@/constants';
import type { FoodArt, Money } from '@/types';

import { FoodBagImage } from './FoodBagImage';
import { FoodBagPrice } from './FoodBagPrice';

interface AddToCartSheetProps {
  art: FoodArt;
  image?: ImageSourcePropType;
  name: string;
  /** e.g. "Bếp Nhà Lá · nhận 18:00 – 20:00". */
  subtitle: string;
  price: Money;
  originalPrice: Money;
  /** Quantity row, own-box row and button (or a message when the bag cannot be added). */
  children: ReactNode;
}

/**
 * Add-to-cart sheet body (reference 5.6): grabber, 62 px thumbnail with name,
 * restaurant / pickup line and price, a rule, then the caller's content. The
 * dimmed scrim and dismissal belong to the route.
 */
export function AddToCartSheet({ art, image, name, subtitle, price, originalPrice, children }: AddToCartSheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[SheetStyles.container, { paddingBottom: Math.max(insets.bottom, 26) }]}>
      <View style={SheetStyles.handle} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
        <FoodBagImage art={art} image={image} size={62} radius={17} />
        <View style={{ flex: 1, gap: 3 }}>
          <AppText variant="rowTitle" style={{ fontSize: 14.5 }} numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {subtitle}
          </AppText>
          <FoodBagPrice price={price} originalPrice={originalPrice} />
        </View>
      </View>
      <Divider />
      {children}
    </View>
  );
}
