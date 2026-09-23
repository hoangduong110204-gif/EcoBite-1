import { Pressable } from 'react-native';

import { Icon } from '@/components/common';
import { HomeChrome, HomeLayout } from '@/constants';

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
  /** e.g. "Yêu thích Bếp Nhà Lá". */
  label: string;
}

/** Round white heart button laid over a photo (reference 1): outline when off, red when on. */
export function FavoriteButton({ active, onToggle, label }: FavoriteButtonProps) {
  const size = HomeLayout.heart;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={6}
      onPress={onToggle}
      style={{ position: 'absolute', top: 8, right: 8, width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: HomeChrome.heartBg }}>
      <Icon name={active ? 'heartFilled' : 'heart'} size={15} color={active ? HomeChrome.heartOn : HomeChrome.heartOff} strokeWidth={2} />
    </Pressable>
  );
}
