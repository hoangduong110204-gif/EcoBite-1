import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors } from '@/constants';
import { useAuthGate } from '@/features/auth';

SplashScreen.preventAutoHideAsync();

/** Development-only control panel (D-17). The require keeps it out of release bundles' render path. */
const DevMenu = __DEV__ ? require('@/components/dev/DevMenu').DevMenu : null;

export default function RootLayout() {
  // Nunito only (D-12). The reference uses weights 600/700/800.
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const ready = fontsLoaded || fontError;
  useAuthGate();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.paper } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="search" />
        <Stack.Screen name="restaurant/[id]" />
        <Stack.Screen name="food-bag/[id]" />
        <Stack.Screen name="order" />
        <Stack.Screen name="account" />
        <Stack.Screen name="ai" />
      </Stack>
      {DevMenu ? <DevMenu /> : null}
    </>
  );
}
