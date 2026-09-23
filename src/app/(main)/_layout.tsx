import { Tabs, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DraggableAiOrb } from '@/components/ai';
import { BottomTabBar } from '@/components/common';
import { TAB_ITEMS, type TabKey } from '@/constants';
import { useCartCount } from '@/features/cart';

const isTabKey = (name: string): name is TabKey => TAB_ITEMS.some((t) => t.key === name);

/**
 * Bottom tabs (D-14): Home · Orders · Cart · Account. Search is NOT a tab.
 * The AI orb is mounted here once (navigation only), so the same draggable orb,
 * at the same position, floats over all four main screens and never covers the tab bar.
 */
export default function MainLayout() {
  const cartCount = useCartCount();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tabBarHeight, setTabBarHeight] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => {
          const active = props.state.routes[props.state.index].name;
          return (
            <View onLayout={(e) => setTabBarHeight(e.nativeEvent.layout.height)}>
              <BottomTabBar
                activeKey={isTabKey(active) ? active : 'home'}
                cartCount={cartCount}
                onSelect={(key) => props.navigation.navigate(key)}
              />
            </View>
          );
        }}>
        <Tabs.Screen name="home" options={{ title: 'Trang chủ' }} />
        <Tabs.Screen name="orders" options={{ title: 'Đơn hàng' }} />
        <Tabs.Screen name="cart" options={{ title: 'Giỏ hàng' }} />
        <Tabs.Screen name="account" options={{ title: 'Tài khoản' }} />
      </Tabs>
      <DraggableAiOrb onPress={() => router.push('/ai')} reservedTop={insets.top} reservedBottom={tabBarHeight} />
    </View>
  );
}
