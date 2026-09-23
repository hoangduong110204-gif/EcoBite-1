import { Stack } from 'expo-router';

/** Search is a stack flow, not a tab (D-14): `/search` (3.4) → `/search/results` (3.5). */
export default function SearchLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
