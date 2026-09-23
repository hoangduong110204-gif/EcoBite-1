import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppText, Card, ErrorState, Header, ListRow, Screen, Skeleton } from '@/components/common';
import { Spacing } from '@/constants';
import { LOCATION_PERMISSION_ROUTE, selectArea, useAuthGuard } from '@/features/auth';
import { useAreas } from '@/features/location';
import { useBack } from '@/hooks';
import { AUTH_MESSAGES } from '@/utils/auth-validation';

/**
 * 05 Select Location (reference 2.2). Areas: Cầu Giấy, Đống Đa, Ba Đình,
 * Thanh Xuân. Tapping one stores it in the session and continues to Home.
 * The reference's search field and "Dùng vị trí hiện tại" row are omitted (GPS
 * and area search are out of scope).
 */
export default function SelectLocationScreen() {
  const router = useRouter();
  const goBack = useBack(LOCATION_PERMISSION_ROUTE);
  const allowed = useAuthGuard('location');
  const { areas, status, reload } = useAreas();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const choose = async (areaId: string) => {
    setError(undefined);
    setSavingId(areaId);
    const result = await selectArea(areaId);
    setSavingId(null);
    if (result.ok) router.replace(result.route);
    else setError(result.message);
  };

  if (!allowed) return null;
  const city = areas[0]?.city;
  return (
    <Screen header={<Header title="Chọn khu vực" onBack={goBack} />}>
      {status === 'error' ? (
        <ErrorState
          title="Không tải được danh sách khu vực"
          message="Kiểm tra kết nối rồi thử lại nhé."
          primaryAction={{ label: 'Thử lại', onPress: reload }}
        />
      ) : (
        <View style={{ gap: Spacing.md }}>
          <Card variant="mint">
            <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 12.5 }}>
              {AUTH_MESSAGES.areaRequired}
            </AppText>
            <AppText variant="caption" color="textMuted">
              Vị trí chỉ dùng để sắp xếp nhà hàng theo khoảng cách. EcoBite không giao hàng.
            </AppText>
          </Card>
          {city ? (
            <AppText variant="label" color="textMuted" style={{ letterSpacing: 0.7, textTransform: 'uppercase' }}>
              {city}
            </AppText>
          ) : null}
          {status === 'loading' ? (
            <View style={{ gap: Spacing.lg }}>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} height={38} radius={12} />
              ))}
            </View>
          ) : (
            <View>
              {areas.map((area, i) => (
                <ListRow
                  key={area.id}
                  icon="pin"
                  title={area.name}
                  subtitle={`${area.restaurantCount} nhà hàng`}
                  divider={i > 0}
                  busy={savingId === area.id}
                  disabled={savingId !== null && savingId !== area.id}
                  onPress={() => choose(area.id)}
                />
              ))}
            </View>
          )}
          {error ? (
            <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11.5 }}>
              {error}
            </AppText>
          ) : null}
          <AppText variant="caption" style={{ lineHeight: 18, paddingBottom: Spacing.xl }}>
            EcoBite đang thí điểm tại một số khu vực. Các khu vực khác sẽ mở dần sau giai đoạn thử nghiệm.
          </AppText>
        </View>
      )}
    </Screen>
  );
}
