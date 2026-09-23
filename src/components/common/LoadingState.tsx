import { ActivityIndicator, View } from 'react-native';

import { Colors, Spacing } from '@/constants';

import { AppText } from './AppText';

/** Full-area loading indicator with an optional line of text (reference 6.9 "Đang giữ chỗ túi cho bạn…"). */
export function LoadingState({ message }: { message?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.s14, paddingHorizontal: 34 }}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? (
        <AppText variant="muted" style={{ textAlign: 'center' }}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}
