import { Pressable, View } from 'react-native';

import { AppText, Icon } from '@/components/common';
import { Colors, Spacing } from '@/constants';
import type { AiSuggestion } from '@/types/ai';

interface SuggestionListProps {
  suggestions: AiSuggestion[];
  /** Opens the suggested entity; navigation stays in the caller. */
  onOpen: (suggestion: AiSuggestion) => void;
}

/**
 * Suggestions inside an assistant bubble: one plain row per suggestion (title +
 * chevron) with its reasons as short lines underneath. No card per suggestion.
 */
export function SuggestionList({ suggestions, onOpen }: SuggestionListProps) {
  return (
    <View style={{ gap: Spacing.s10, marginTop: Spacing.xs }}>
      {suggestions.map((suggestion) => (
        <Pressable
          key={suggestion.id}
          accessibilityRole="button"
          accessibilityLabel={`Xem ${suggestion.label}`}
          disabled={!suggestion.target}
          onPress={() => onOpen(suggestion)}
          style={{ gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
            <AppText variant="bodyStrong" color="primaryDark" style={{ flexShrink: 1 }}>
              {suggestion.label}
            </AppText>
            {suggestion.target ? <Icon name="chevronRight" size={13} color={Colors.primaryDark} /> : null}
          </View>
          {suggestion.reasons?.map((reason) => (
            <AppText key={reason} variant="caption" color="textMuted" style={{ lineHeight: 16 }}>
              {`• ${reason}`}
            </AppText>
          ))}
        </Pressable>
      ))}
    </View>
  );
}
