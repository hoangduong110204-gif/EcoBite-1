import { Stack } from 'expo-router';

/** Checkout → payment → pickup flow, plus order detail. */
export default function OrderLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
