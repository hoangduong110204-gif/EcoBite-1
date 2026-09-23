import { Stack } from 'expo-router';

/** Food Bag Detail, plus the Add-to-Cart bottom sheet (reference 5.6) presented over it. */
export default function FoodBagLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add-to-cart" options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
