import { Modal, View } from 'react-native';

import { Colors, DialogStyles } from '@/constants';

import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './icons';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Icon in the circle (default: trash for destructive). */
  icon?: IconName;
  /** `danger` = red circle + solid red confirm (6.3); `primary` = mint circle + green confirm (10.9). */
  tone?: 'danger' | 'primary';
}

/** Centred confirmation dialog (reference 6.3 "Xoá túi khỏi giỏ?", 10.9 "Đăng xuất"). */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  icon,
  tone = 'danger',
}: ConfirmDialogProps) {
  const danger = tone === 'danger';
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={DialogStyles.scrim}>
        <View style={DialogStyles.card}>
          <View style={[DialogStyles.iconCircle, { backgroundColor: danger ? Colors.dangerSoft : Colors.mint }]}>
            <Icon
              name={icon ?? (danger ? 'trash' : 'check')}
              size={28}
              color={danger ? Colors.danger : Colors.primaryDark}
            />
          </View>
          <AppText variant="section" style={{ textAlign: 'center' }}>
            {title}
          </AppText>
          {message ? (
            <AppText variant="muted" style={{ textAlign: 'center' }}>
              {message}
            </AppText>
          ) : null}
          <View style={DialogStyles.actions}>
            <Button label={confirmLabel} variant={danger ? 'danger' : 'primary'} onPress={onConfirm} />
            <Button label={cancelLabel} variant="neutral" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
