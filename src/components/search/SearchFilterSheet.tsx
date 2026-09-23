import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, BottomSheet, Button, Chip } from '@/components/common';
import { Spacing } from '@/constants';

interface Option<K> {
  key: K;
  label: string;
}

interface SearchFilterSheetProps<P extends string> {
  visible: boolean;
  priceOptions: readonly Option<P>[];
  distanceOptions: readonly Option<number>[];
  price: P | null;
  distanceKm: number | null;
  topRatedOnly: boolean;
  topRatedLabel: string;
  /** "Xem N kết quả" with the count the current selection gives. */
  resultCount: number;
  onPrice: (key: P | null) => void;
  onDistance: (km: number | null) => void;
  onTopRated: (value: boolean) => void;
  onReset: () => void;
  onClose: () => void;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: Spacing.s10 }}>
      <AppText variant="label" color="textMuted">
        {title}
      </AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>{children}</View>
    </View>
  );
}

/** "Bộ lọc" sheet (reference 3.6): price band, distance, rating. Choosing a selected chip again clears it. */
export function SearchFilterSheet<P extends string>({
  visible,
  priceOptions,
  distanceOptions,
  price,
  distanceKm,
  topRatedOnly,
  topRatedLabel,
  resultCount,
  onPrice,
  onDistance,
  onTopRated,
  onReset,
  onClose,
}: SearchFilterSheetProps<P>) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText variant="cardTitle">Bộ lọc</AppText>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onReset}>
          <AppText variant="label" color="primaryDark">
            Đặt lại
          </AppText>
        </Pressable>
      </View>
      <Group title="Khoảng giá">
        {priceOptions.map((o) => (
          <Chip key={o.key} label={o.label} selected={price === o.key} onPress={() => onPrice(price === o.key ? null : o.key)} />
        ))}
      </Group>
      <Group title="Khoảng cách tới quán">
        {distanceOptions.map((o) => (
          <Chip key={o.key} label={o.label} selected={distanceKm === o.key} onPress={() => onDistance(distanceKm === o.key ? null : o.key)} />
        ))}
      </Group>
      <Group title="Khác">
        <Chip label={topRatedLabel} selected={topRatedOnly} onPress={() => onTopRated(!topRatedOnly)} />
      </Group>
      <Button label={resultCount > 0 ? `Xem ${resultCount} kết quả` : 'Không có kết quả'} disabled={resultCount === 0} onPress={onClose} />
    </BottomSheet>
  );
}
