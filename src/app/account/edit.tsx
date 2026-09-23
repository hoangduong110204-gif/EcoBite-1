import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Avatar } from '@/components/account';
import { AppText, BottomActionBar, Badge, Button, Card, ErrorState, Header, Input, ListRow, Screen } from '@/components/common';
import { Spacing } from '@/constants';
import { getInitial, updateProfile } from '@/features/account';
import { useAuth } from '@/features/auth';
import { useAreas } from '@/features/location';
import { useBack } from '@/hooks';
import { formatPhone } from '@/utils/format';

/**
 * 10.2 Edit Profile (reference): name and default area are editable and saved to
 * the session user (`updateProfile`); phone (verified) and email are read-only,
 * because changing a phone would need a new OTP. Birth date and change-password
 * are not part of the mock user model.
 */
export default function EditProfileScreen() {
  const router = useRouter();
  const goBack = useBack('/account');
  const { profile, area } = useAuth();
  const { areas, status: areasStatus, reload } = useAreas();
  const [name, setName] = useState(profile?.name ?? '');
  const [areaId, setAreaId] = useState(area?.id ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ field: string; message: string } | undefined>();
  const header = <Header title="Thông tin cá nhân" onBack={goBack} />;

  useEffect(() => {
    if (!areaId && area) setAreaId(area.id);
  }, [area, areaId]);

  if (!profile) {
    return (
      <Screen header={header}>
        <ErrorState title="Chưa có hồ sơ" message="Hãy đăng nhập lại để sửa thông tin." primaryAction={{ label: 'Quay lại', onPress: goBack }} />
      </Screen>
    );
  }

  const changed = name.trim() !== profile.name || areaId !== (area?.id ?? '');
  const save = async () => {
    setBusy(true);
    setError(undefined);
    const result = await updateProfile({ name, areaId });
    setBusy(false);
    if (result.ok) router.back();
    else setError({ field: result.field, message: result.message });
  };

  return (
    <Screen
      header={header}
      footer={
        <BottomActionBar>
          {error?.field === 'form' || error?.field === 'area' ? (
            <AppText variant="bodyStrong" color="danger" style={{ fontSize: 11.5 }}>
              {error.message}
            </AppText>
          ) : null}
          <Button label="Lưu thay đổi" loading={busy} disabled={!changed} onPress={save} />
        </BottomActionBar>
      }>
      <View style={{ gap: Spacing.md, paddingBottom: Spacing.lg }}>
        <View style={{ alignItems: 'center', paddingVertical: Spacing.s10 }}>
          <Avatar initial={getInitial(name || profile.name)} size={88} />
        </View>
        <Input
          label="Họ và tên"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          error={error?.field === 'name' ? error.message : undefined}
        />
        <Input
          label="Số điện thoại"
          value={formatPhone(profile.phone)}
          disabled
          right={<Badge label="Đã xác thực" tone="green" />}
          helper="Đổi số sẽ cần nhập lại mã OTP"
        />
        <Input label="Email" value={profile.email} disabled />

        <AppText variant="label" color="textMuted" style={{ marginTop: Spacing.xs }}>
          Khu vực mặc định
        </AppText>
        {areasStatus === 'error' ? (
          <ErrorState title="Không tải được khu vực" message="Kiểm tra kết nối rồi thử lại nhé." primaryAction={{ label: 'Thử lại', onPress: reload }} />
        ) : (
          <Card style={{ paddingVertical: 2 }}>
            {areas.map((a, i) => (
              <ListRow key={a.id} icon="pin" title={a.name} subtitle={a.city} selected={a.id === areaId} divider={i > 0} onPress={() => setAreaId(a.id)} />
            ))}
          </Card>
        )}
      </View>
    </Screen>
  );
}
