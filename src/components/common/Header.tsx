import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Colors, HeaderStyles } from '@/constants';

import { AppText } from './AppText';
import { Icon } from './icons';

interface HeaderProps {
  title?: string;
  /** Shows the back chip when provided. Navigation stays in the caller. */
  onBack?: () => void;
  /** Right-hand action (36x36 slot). */
  right?: ReactNode;
  /** Centre the title (`.nav h4.c`). */
  centered?: boolean;
  /** Custom title node (e.g. AI header with the orb). Overrides `title`. */
  titleNode?: ReactNode;
}

/** `.nav`: back chip · title · optional right action. */
export function Header({ title, onBack, right, centered = false, titleNode }: HeaderProps) {
  return (
    <View style={HeaderStyles.container}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          onPress={onBack}
          style={HeaderStyles.backChip}>
          <Icon name="back" size={18} color={Colors.text} />
        </Pressable>
      ) : null}
      {titleNode ?? (
        <AppText
          variant="navTitle"
          numberOfLines={1}
          style={[HeaderStyles.title, centered && HeaderStyles.titleCentered]}>
          {title}
        </AppText>
      )}
      {right ? <View style={HeaderStyles.right}>{right}</View> : null}
    </View>
  );
}
