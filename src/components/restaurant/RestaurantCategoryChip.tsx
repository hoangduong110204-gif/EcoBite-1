import { Chip } from '@/components/common';
import type { Category } from '@/types';

interface RestaurantCategoryChipProps {
  category: Pick<Category, 'id' | 'name'>;
  selected?: boolean;
  onPress?: (categoryId: string) => void;
}

/** Category filter chip (Tất cả · Cơm · Mì · Healthy …). */
export function RestaurantCategoryChip({ category, selected = false, onPress }: RestaurantCategoryChipProps) {
  return <Chip label={category.name} selected={selected} onPress={() => onPress?.(category.id)} />;
}
