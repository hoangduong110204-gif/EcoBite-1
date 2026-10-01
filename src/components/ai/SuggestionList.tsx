import { View, type ImageSourcePropType } from 'react-native';

import { Spacing } from '@/constants';

import { AiRecommendationCard } from './AiRecommendationCard';

export interface AiRecommendationItem {
  key: string;
  label: string;
  image?: ImageSourcePropType;
  price?: string;
  rating?: string;
  reasons?: string[];
  onPress: () => void;
}

interface SuggestionListProps {
  /** Already-resolved recommendation data. Presentation lookup stays in the screen —
   * `components/ai` never imports `@/data`, so it stays purely presentational. */
  items: AiRecommendationItem[];
}

/**
 * Recommendations inside an assistant turn: at most 3 compact `AiRecommendationCard`s,
 * stacked vertically so they keep scrolling with the rest of the conversation.
 */
export function SuggestionList({ items }: SuggestionListProps) {
  if (items.length === 0) return null;

  return (
    <View style={{ gap: Spacing.sm }}>
      {items.map((item) => (
        <AiRecommendationCard key={item.key} label={item.label} image={item.image} price={item.price} rating={item.rating} reasons={item.reasons} onPress={item.onPress} />
      ))}
    </View>
  );
}
