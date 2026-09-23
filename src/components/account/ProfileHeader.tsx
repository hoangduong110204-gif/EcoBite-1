import { View } from 'react-native';

import { AppText, Button, Card } from '@/components/common';
import { Spacing } from '@/constants';

import { Avatar } from './Avatar';

interface ProfileHeaderProps {
  name: string;
  initial: string;
  /** Second line, already formatted (phone). */
  detail: string;
  /** e.g. "Thành viên từ 08/2026". Omitted when unknown. */
  memberSince?: string | null;
  onEdit: () => void;
}

/** Account header card (reference 10.1): avatar, name, phone, member since, "Sửa". */
export function ProfileHeader({ name, initial, detail, memberSince, onEdit }: ProfileHeaderProps) {
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.s14 }}>
      <Avatar initial={initial} />
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <AppText variant="cardTitle" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {detail}
        </AppText>
        {memberSince ? (
          <AppText variant="caption" color="primaryDark">
            Thành viên từ {memberSince}
          </AppText>
        ) : null}
      </View>
      <Button label="Sửa" variant="soft" size="xs" onPress={onEdit} />
    </Card>
  );
}
