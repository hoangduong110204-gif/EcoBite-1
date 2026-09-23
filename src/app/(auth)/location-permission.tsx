import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { LocationIllustration } from '@/components/auth';
import { AppText, BottomActionBar, Button, Card, Icon, Screen } from '@/components/common';
import { Colors } from '@/constants';
import { SELECT_LOCATION_ROUTE, useAuthGuard } from '@/features/auth';

/**
 * 04 Location Permission (reference 2.1). MOCK: no OS permission API, no GPS,
 * no expo-location. Both buttons continue to Select Location, as in the reference.
 */
export default function LocationPermissionScreen() {
  const router = useRouter();
  const allowed = useAuthGuard('location');
  const goNext = () => router.push(SELECT_LOCATION_ROUTE);

  if (!allowed) return null;
  return (
    <Screen
      scroll={false}
      padded={false}
      footer={
        <BottomActionBar transparent>
          <Button label="Cho phép truy cập vị trí" onPress={goNext} />
          <Button label="Để sau, tôi tự chọn khu vực" variant="neutral" onPress={goNext} />
        </BottomActionBar>
      }>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22, paddingHorizontal: 30 }}>
        <LocationIllustration />
        <View style={{ alignItems: 'center', gap: 10 }}>
          <AppText variant="title" style={{ textAlign: 'center' }}>
            Cho phép truy cập vị trí
          </AppText>
          <AppText variant="muted" style={{ textAlign: 'center', maxWidth: 270 }}>
            EcoBite dùng vị trí để tìm nhà hàng gần bạn nhất và tính quãng đường tới quán lấy hàng.
          </AppText>
        </View>
        <Card style={{ alignSelf: 'stretch', gap: 10 }}>
          <Bullet>Chỉ dùng khi bạn đang mở app</Bullet>
          <Bullet>Không chia sẻ vị trí cho nhà hàng hay bên thứ ba</Bullet>
          <Bullet>
            <AppText variant="label" style={{ fontSize: 11.5 }}>
              Không dùng để giao hàng
            </AppText>{' '}
            — EcoBite là mô hình tự tới quán lấy
          </Bullet>
        </Card>
      </View>
    </Screen>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 9 }}>
      <View style={{ marginTop: 1 }}>
        <Icon name="check" size={14} color={Colors.primary} strokeWidth={2.8} />
      </View>
      <AppText variant="caption" color="textMuted" style={{ flex: 1, lineHeight: 17 }}>
        {children}
      </AppText>
    </View>
  );
}
