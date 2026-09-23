import { Stack } from 'expo-router';

/** Account sub-screens (Edit Profile). The Account tab itself lives in `(main)/account`. */
export default function AccountLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
