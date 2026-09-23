import { Pressable, View } from 'react-native';

import { AppText, Icon } from '@/components/common';
import { Colors, HeroBannerArt } from '@/constants';

interface HomeSectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

/** Home section title (dark-green 17/800) with the grey "Xem tất cả ›" link (reference 1). */
export function HomeSectionHeader({ title, actionLabel, onActionPress }: HomeSectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <AppText variant="heading" style={{ color: HeroBannerArt.title, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 }}>
        {title}
      </AppText>
      {actionLabel && onActionPress ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onActionPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <AppText variant="caption" color="textMuted" style={{ fontSize: 11.5 }}>
            {actionLabel}
          </AppText>
          <Icon name="chevronRight" size={11} color={Colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
