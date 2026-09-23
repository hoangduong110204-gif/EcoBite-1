import { Pressable, TextInput, View } from 'react-native';

import { Icon } from '@/components/common';
import { BorderWidth, Colors, FontSize, Radius, Spacing } from '@/constants';

interface ChatComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  /** A reply is being produced: sending is blocked. */
  disabled?: boolean;
  placeholder?: string;
}

/** Message input row: rounded field + round green send button (disabled while empty or replying). */
export function ChatComposer({ value, onChangeText, onSend, disabled = false, placeholder = 'Nhập tin nhắn' }: ChatComposerProps) {
  const canSend = value.trim().length > 0 && !disabled;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.s10,
        backgroundColor: Colors.paper,
        borderTopWidth: BorderWidth.hairline,
        borderTopColor: Colors.divider,
      }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={canSend ? onSend : undefined}
        returnKeyType="send"
        blurOnSubmit={false}
        placeholder={placeholder}
        placeholderTextColor={Colors.textFaint}
        accessibilityLabel="Tin nhắn"
        style={{
          flex: 1,
          height: 42,
          paddingHorizontal: Spacing.md,
          borderRadius: Radius.pill,
          backgroundColor: Colors.white,
          borderWidth: BorderWidth.hairline,
          borderColor: Colors.border,
          color: Colors.text,
          fontSize: FontSize.small,
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Gửi"
        disabled={!canSend}
        onPress={onSend}
        style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: canSend ? Colors.primary : Colors.disabledFill }}>
        <Icon name="chevronRight" size={18} color={canSend ? Colors.white : Colors.disabledText} />
      </Pressable>
    </View>
  );
}
