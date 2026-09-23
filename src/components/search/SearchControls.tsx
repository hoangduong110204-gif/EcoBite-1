import { View } from 'react-native';

import { Chip } from '@/components/common';
import { Spacing } from '@/constants';

interface SearchControlsProps {
  /** Number of active filters; shown as "Bộ lọc · N" and turns the chip green. */
  filterCount: number;
  sortLabel: string;
  /** The sort is not the default order: the chip turns green. */
  sortActive: boolean;
  onlyAvailable: boolean;
  onOpenFilter: () => void;
  onOpenSort: () => void;
  onToggleAvailable: () => void;
}

/** Control row under the search field (reference 3.5): [Bộ lọc] [Phù hợp nhất] [Còn túi]. */
export function SearchControls({ filterCount, sortLabel, sortActive, onlyAvailable, onOpenFilter, onOpenSort, onToggleAvailable }: SearchControlsProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
      <Chip icon="filter" label={filterCount > 0 ? `Bộ lọc · ${filterCount}` : 'Bộ lọc'} selected={filterCount > 0} onPress={onOpenFilter} accessibilityLabel="Mở bộ lọc" />
      <Chip icon="sort" label={sortLabel} selected={sortActive} onPress={onOpenSort} accessibilityLabel="Chọn cách sắp xếp" />
      <Chip label="Còn túi" selected={onlyAvailable} onPress={onToggleAvailable} />
    </View>
  );
}
