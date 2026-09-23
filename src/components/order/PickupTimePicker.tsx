import { ScrollView } from 'react-native';

import { Chip } from '@/components/common';
import { Spacing } from '@/constants';

export interface PickupTimeChoice {
  id: string;
  /** Time shown on the chip, e.g. "18:30". */
  label: string;
  /** Not selectable (dimmed). No reason is shown to the customer. */
  disabled?: boolean;
}

interface PickupTimePickerProps {
  times: PickupTimeChoice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Horizontal, scrollable row of pickup times (reference 5.3 / 6.6). Only the times it is given are shown. */
export function PickupTimePicker({ times, selectedId, onSelect }: PickupTimePickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="radiogroup"
      contentContainerStyle={{ gap: Spacing.sm, paddingVertical: Spacing.xs, paddingRight: Spacing.md }}>
      {times.map((time) => (
        <Chip
          key={time.id}
          label={time.label}
          selected={time.id === selectedId}
          disabled={time.disabled}
          accessibilityRole="radio"
          style={time.disabled ? { opacity: 0.45 } : undefined}
          onPress={() => onSelect(time.id)}
        />
      ))}
    </ScrollView>
  );
}
