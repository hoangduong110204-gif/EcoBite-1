import { Pressable, View } from 'react-native';

import { AppText } from '@/components/common';
import { CategoryCircle, Colors, HomeLayout, type CategoryIconKey } from '@/constants';

import { CategoryIcon } from './CategoryIcon';

interface CategoryButtonProps {
  label: string;
  /** Vector illustration inside the circle (never a photo). */
  icon: CategoryIconKey;
  selected?: boolean;
  onPress?: () => void;
}

/**
 * Home category (reference: round tinted circle + illustration + label). Selected =
 * stronger green circle with a green ring and a dark-green label.
 */
export function CategoryButton({ label, icon, selected = false, onPress }: CategoryButtonProps) {
  const size = HomeLayout.categoryCircle;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={{ flex: 1, minWidth: 0, alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? CategoryCircle.selected : CategoryCircle[icon],
          borderWidth: 2,
          borderColor: selected ? Colors.primary : 'transparent',
        }}>
        <CategoryIcon name={icon} size={HomeLayout.categoryIcon} selected={selected} />
      </View>
      <AppText variant="tabLabel" color={selected ? 'primaryDark' : 'text'} numberOfLines={1} style={{ fontSize: 11 }}>
        {label}
      </AppText>
    </Pressable>
  );
}
