import { Pressable, View } from 'react-native';

import { Colors } from '@/constants';

import { AppText } from './AppText';
import { Icon } from './icons';

interface SectionHeaderProps {
  title: string;
  /** "Xem tất cả" style link on the right. Omit when there is nowhere to go. */
  actionLabel?: string;
  onActionPress?: () => void;
}

/** `.muc`: section title (16/800) with an optional green "Xem tất cả ›" link. */
export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <AppText variant="heading" style={{ fontSize: 16 }}>
        {title}
      </AppText>
      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          hitSlop={8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <AppText variant="label" color="primaryDark" style={{ fontSize: 12 }}>
            {actionLabel}
          </AppText>
          <Icon name="chevronRight" size={12} color={Colors.primaryDark} />
        </Pressable>
      ) : null}
    </View>
  );
}
