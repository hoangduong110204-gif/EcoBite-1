import { useState } from 'react';
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

/** Message input row: rounded field (green ring on focus) + round green send button (disabled while empty or replying). */
export function ChatComposer({ value, onChangeText, onSend, disabled = false, placeholder = 'Nhập tin nhắn' }: ChatComposerProps) {
  const [focused, setFocused] = useState(false);
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="send"
        blurOnSubmit={false}
        placeholder={placeholder}
        placeholderTextColor={Colors.textFaint}
        accessibilityLabel="Tin nhắn"
        style={{
          flex: 1,
          height: 44,
          paddingHorizontal: Spacing.md,
          borderRadius: Radius.pill,
          backgroundColor: Colors.white,
          borderWidth: focused ? BorderWidth.ringStrong : BorderWidth.hairline,
          borderColor: focused ? Colors.primary : Colors.border,
          color: Colors.text,
          fontSize: FontSize.small,
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Gửi"
        disabled={!canSend}
        onPress={onSend}
        style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: canSend ? Colors.primary : Colors.disabledFill }}>
        <Icon name="chevronRight" size={18} color={canSend ? Colors.white : Colors.disabledText} />
      </Pressable>
    </View>
  );
}
