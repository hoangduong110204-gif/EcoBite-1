import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Colors, Spacing } from '@/constants';

import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './icons';

export interface StateAction {
  label: string;
  onPress: () => void;
  icon?: IconName;
}

export interface StateLayoutProps {
  title: string;
  message?: string;
  /** Custom illustration inside the circle. Overrides `icon`. */
  illustration?: ReactNode;
  icon?: IconName;
  /** Circle tone: mint (empty), danger (error), amber (warning/expired). */
  tone?: 'mint' | 'danger' | 'amber';
  primaryAction?: StateAction;
  secondaryAction?: StateAction;
}

const CIRCLE: Record<NonNullable<StateLayoutProps['tone']>, { bg: string; fg: string }> = {
  mint: { bg: Colors.mint, fg: Colors.primaryDark },
  danger: { bg: Colors.dangerSoft, fg: Colors.danger },
  amber: { bg: Colors.amberSoft, fg: Colors.amberText },
};

/** `.rong`: 104 px circle, title (17/800), body, then up to two full-width actions. Shared by EmptyState / ErrorState. */
export function StateLayout({
  title,
  message,
  illustration,
  icon = 'box',
  tone = 'mint',
  primaryAction,
  secondaryAction,
}: StateLayoutProps) {
  const { bg, fg } = CIRCLE[tone];
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: 40 }}>
      <View style={{ width: 104, height: 104, borderRadius: 52, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        {illustration ?? <Icon name={icon} size={44} color={fg} />}
      </View>
      <AppText variant="section" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="muted" style={{ textAlign: 'center' }}>
          {message}
        </AppText>
      ) : null}
      {primaryAction ? (
        <Button
          label={primaryAction.label}
          icon={primaryAction.icon}
          onPress={primaryAction.onPress}
          style={{ alignSelf: 'stretch', marginTop: Spacing.sm }}
        />
      ) : null}
      {secondaryAction ? (
        <Button
          label={secondaryAction.label}
          icon={secondaryAction.icon}
          variant="secondary"
          onPress={secondaryAction.onPress}
          style={{ alignSelf: 'stretch' }}
        />
      ) : null}
    </View>
  );
}
