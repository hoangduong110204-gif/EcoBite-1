import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomBarStyles } from '@/constants';

/** `.day`: pinned bottom action area (total + primary button). Pass to `Screen footer`. */
export function BottomActionBar({ children, transparent = false }: { children: ReactNode; transparent?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        BottomBarStyles.container,
        transparent && BottomBarStyles.transparent,
        { paddingBottom: Math.max(insets.bottom, BottomBarStyles.minBottomPadding) },
      ]}>
      {children}
    </View>
  );
}
