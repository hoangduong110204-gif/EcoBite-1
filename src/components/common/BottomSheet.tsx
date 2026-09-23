import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, SheetStyles } from '@/constants';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Bottom-sheet container (reference 5.6, 3.6, 3.7, 9.6): dimmed scrim, top
 * radius 26, 38x4 grabber. Content and rules belong to the caller.
 */
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' }}>
        <Pressable accessibilityLabel="Đóng" style={{ flex: 1 }} onPress={onClose} />
        <View style={[SheetStyles.container, { paddingBottom: Math.max(insets.bottom, 26) }]}>
          <View style={SheetStyles.handle} />
          {children}
        </View>
      </View>
    </Modal>
  );
}
