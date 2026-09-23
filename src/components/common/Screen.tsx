import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, MAX_CONTENT_WIDTH, SCREEN_PADDING } from '@/constants';

interface ScreenProps {
  children: ReactNode;
  /** Wrap the body in a ScrollView (default true). */
  scroll?: boolean;
  /** Apply the 16 px horizontal gutter to the body (default true). */
  padded?: boolean;
  /** Pinned above the body, outside the scroller (e.g. `Header`). */
  header?: ReactNode;
  /** Pinned below the body, outside the scroller (e.g. `BottomActionBar`). */
  footer?: ReactNode;
  /** Add the bottom safe-area inset when there is no footer / tab bar (default false). */
  safeBottom?: boolean;
  /** No top safe-area padding: the body draws under the status bar (full-bleed cover, Restaurant Detail 4.1). */
  edgeToEdge?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * Base page container: paper background, safe area (top), centred max width,
 * `.mh` layout of the reference (header → scrolling body → pinned footer).
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  header,
  footer,
  safeBottom = false,
  edgeToEdge = false,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const body = (
    <View style={[styles.content, padded && styles.padded, contentStyle]}>{children}</View>
  );
  return (
    <View style={[styles.root, { paddingTop: edgeToEdge ? 0 : insets.top, paddingBottom: safeBottom && !footer ? insets.bottom : 0 }]}>
      {header}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {body}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{body}</View>
      )}
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.paper },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  padded: { paddingHorizontal: SCREEN_PADDING },
});
