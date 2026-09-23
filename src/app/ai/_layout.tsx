import { Stack } from 'expo-router';

/** AI Assistant module — isolated from the core ordering routes. */
export default function AiLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
