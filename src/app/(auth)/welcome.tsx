import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { BrandMark } from '@/components/auth';
import { AppText, BottomActionBar, Button, Screen } from '@/components/common';
import { LOGIN_ROUTE, REGISTER_ROUTE, useAuthGuard } from '@/features/auth';

/**
 * 03 Login / Register entry (reference 1.5). The Google / Apple buttons and
 * the guest-preview link of the reference are NOT rendered: no social login
 * exists and guest preview is unsupported in the MVP (D-9).
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const allowed = useAuthGuard('public');
  if (!allowed) return null;
  return (
    <Screen
      scroll={false}
      footer={
        <BottomActionBar>
          <Button label="Đăng nhập" onPress={() => router.push(LOGIN_ROUTE)} />
          <Button label="Tạo tài khoản mới" variant="secondary" onPress={() => router.push(REGISTER_ROUTE)} />
        </BottomActionBar>
      }>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 10 }}>
        <BrandMark tileSize={90} tone="mint" />
        <AppText variant="title" style={{ marginTop: 10, textAlign: 'center' }}>
          Chào mừng tới EcoBite
        </AppText>
        <AppText variant="muted" style={{ textAlign: 'center', maxWidth: 260 }}>
          Ăn ngon hơn. Tiết kiệm hơn.{'\n'}Tốt hơn cho bạn và hành tinh.
        </AppText>
      </View>
    </Screen>
  );
}
