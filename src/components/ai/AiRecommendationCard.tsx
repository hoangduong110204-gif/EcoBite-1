import { Image, View, type ImageSourcePropType } from 'react-native';

import { AppText, Button, Icon } from '@/components/common';
import { Colors, Radius, Shadows, Spacing } from '@/constants';

const IMAGE_SIZE = 64;

interface AiRecommendationCardProps {
  label: string;
  image?: ImageSourcePropType;
  /** Pre-formatted display string, e.g. "45.000đ". */
  price?: string;
  /** Pre-formatted display string, e.g. "4.7". */
  rating?: string;
  /** Short "why this fits" lines; at most 3 are shown. */
  reasons?: string[];
  onPress: () => void;
}

/**
 * One compact, unified AI recommendation panel: photo + name/price/rating at the
 * top, a small pale-blue "why I suggest this" block with check-marked reasons, then
 * the CTA — all inside a single white card, not two separate large blocks. No
 * restaurant name, distance or tags: a light conversational aside, not a listing.
 */
export function AiRecommendationCard({ label, image, price, rating, reasons = [], onPress }: AiRecommendationCardProps) {
  return (
    <View style={[{ backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.sm, gap: Spacing.sm }, Shadows.card]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        {image ? (
          <Image source={image} resizeMode="cover" style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: Radius.image }} />
        ) : (
          <View style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: Radius.image, backgroundColor: Colors.mint }} />
        )}
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
            <AppText variant="rowTitle" numberOfLines={1} style={{ flex: 1, fontSize: 15 }}>
              {label}
            </AppText>
            {rating ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Icon name="star" size={11} color={Colors.warning} />
                <AppText variant="label" color="textMuted" style={{ fontSize: 11 }}>
                  {rating}
                </AppText>
              </View>
            ) : null}
          </View>
          {price ? (
            <AppText variant="price" style={{ fontSize: 15 }}>
              {price}
            </AppText>
          ) : null}
        </View>
      </View>

      {reasons.length > 0 ? (
        <View style={{ backgroundColor: Colors.tileBlue, borderRadius: Radius.sm, padding: Spacing.sm, gap: 6 }}>
          <AppText variant="label" style={{ fontSize: 13 }}>
            Vì sao mình gợi ý món này?
          </AppText>
          <View style={{ gap: 5 }}>
            {reasons.slice(0, 3).map((reason) => (
              <View key={reason} style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
                <View style={{ width: 13, height: 13, marginTop: 1, borderRadius: 7, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={7} color={Colors.white} strokeWidth={3.2} />
                </View>
                <AppText variant="caption" color="textMuted" style={{ flex: 1, lineHeight: 15 }}>
                  {reason}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <Button label="Xem chi tiết món →" variant="primary" size="sm" onPress={onPress} style={{ width: '100%' }} />
    </View>
  );
}
