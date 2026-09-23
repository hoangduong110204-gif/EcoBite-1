import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomBarStyles, TAB_ITEMS, TabBarStyles, type TabKey } from '@/constants';

import { Icon, type IconName } from './icons';

const FILLED: Record<TabKey, IconName> = {
  home: 'homeFilled',
  orders: 'ordersFilled',
  cart: 'cartFilled',
  account: 'accountFilled',
};

interface BottomTabBarProps {
  activeKey: TabKey;
  /** Number of bags in the cart (red badge on the Cart tab). */
  cartCount?: number;
  onSelect: (key: TabKey) => void;
}

/**
 * Bottom tab bar: EXACTLY Home · Orders · Cart · Account (D-14, reference `.tab`).
 * Search is not a tab. Active tab uses the filled icon and the dark-green label.
 */
export function BottomTabBar({ activeKey, cartCount = 0, onSelect }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[TabBarStyles.container, { paddingBottom: Math.max(insets.bottom, BottomBarStyles.minBottomPadding) }]}>
      {TAB_ITEMS.map((tab) => {
        const active = tab.key === activeKey;
        const tint = active ? TabBarStyles.activeTint : TabBarStyles.inactiveTint;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => onSelect(tab.key)}
            style={TabBarStyles.item}>
            <Icon name={active ? FILLED[tab.key] : tab.icon} size={TabBarStyles.iconSize} color={tint} />
            {tab.key === 'cart' && cartCount > 0 ? (
              <View style={TabBarStyles.badge}>
                <Text style={TabBarStyles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
              </View>
            ) : null}
            <Text style={[TabBarStyles.label, { color: tint }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
