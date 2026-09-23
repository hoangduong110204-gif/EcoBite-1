import { Pressable, View } from 'react-native';

import { AppText, BottomSheet, RadioDot } from '@/components/common';
import { Spacing } from '@/constants';

interface SortOption<K extends string> {
  key: K;
  label: string;
  hint: string;
}

interface SearchSortSheetProps<K extends string> {
  visible: boolean;
  options: readonly SortOption<K>[];
  value: K;
  onSelect: (key: K) => void;
  onClose: () => void;
}

/** "Sắp xếp theo" sheet (reference 3.7): one radio row per order; picking one applies it and closes. */
export function SearchSortSheet<K extends string>({ visible, options, value, onSelect, onClose }: SearchSortSheetProps<K>) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="cardTitle">Sắp xếp theo</AppText>
      <View style={{ gap: Spacing.xs }}>
        {options.map((option) => (
          <Pressable
            key={option.key}
            accessibilityRole="radio"
            accessibilityState={{ selected: option.key === value }}
            onPress={() => onSelect(option.key)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.s10 }}>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="rowTitle">{option.label}</AppText>
              <AppText variant="caption" color="textMuted">
                {option.hint}
              </AppText>
            </View>
            <RadioDot selected={option.key === value} />
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}
