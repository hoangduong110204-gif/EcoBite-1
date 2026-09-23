import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { BorderWidth, Colors, IconTileStyles, Spacing } from '@/constants';

import { AppText } from './AppText';
import { Icon, type IconName } from './icons';

interface ListRowProps {
  title: string;
  subtitle?: string;
  icon: IconName;
  /** Solid green icon tile + trailing check (`.bt` green in the reference). */
  selected?: boolean;
  /** Spinner in place of the trailing check. */
  busy?: boolean;
  disabled?: boolean;
  /** Extra trailing content (badge, chevron). */
  trailing?: ReactNode;
  /** Top divider between rows (`.dong + .dong`). */
  divider?: boolean;
  onPress?: () => void;
}

/** List row (`.dong`): 38 px icon tile, title (13.5/800), subtitle (11.5), trailing state. */
export function ListRow({ title, subtitle, icon, selected = false, busy = false, disabled = false, trailing, divider = false, onPress }: ListRowProps) {
  const { size, radius } = IconTileStyles.sizes.lg;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected, disabled, busy }}
      disabled={disabled || busy || !onPress}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        paddingVertical: 13,
        borderTopWidth: divider ? BorderWidth.hairline : 0,
        borderTopColor: Colors.divider,
        opacity: disabled ? 0.5 : 1,
      }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? Colors.primary : Colors.mint,
        }}>
        <Icon name={icon} size={18} color={selected ? Colors.white : Colors.primaryDark} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <AppText variant="rowTitle" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="textMuted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {busy ? <ActivityIndicator color={Colors.primary} /> : selected ? <Icon name="check" size={16} color={Colors.primary} strokeWidth={2.8} /> : null}
      {trailing ? <View style={{ marginLeft: Spacing.xs }}>{trailing}</View> : null}
    </Pressable>
  );
}
