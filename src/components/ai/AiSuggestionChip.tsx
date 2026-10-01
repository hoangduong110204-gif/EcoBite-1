import { Pressable } from 'react-native';

import { AppText } from '@/components/common';
import { BorderWidth, Colors, Radius, Spacing } from '@/constants';

interface AiSuggestionChipProps {
  /** Full prompt text, already carrying its own leading emoji (e.g. "🌶️ Đang thèm món cay"). */
  label: string;
  onPress: () => void;
}

/** A tappable conversation starter, not a navigation menu button. */
export function AiSuggestionChip({ label, onPress }: AiSuggestionChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: Spacing.s9,
          paddingHorizontal: Spacing.s13,
          borderRadius: Radius.pill,
          backgroundColor: Colors.mint,
          borderWidth: BorderWidth.hairline,
          borderColor: Colors.mintBorder,
        },
        pressed && { opacity: 0.85 },
      ]}>
      <AppText variant="label" color="primaryDark" numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}
