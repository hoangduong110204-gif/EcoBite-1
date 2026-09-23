import { useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { BorderWidth, Colors, Radius, Spacing, Typography } from '@/constants';

import { AppText } from './AppText';

interface OtpInputProps {
  value: string;
  onChangeText: (next: string) => void;
  length?: number;
  /** Error message; turns the boxes red. */
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * One-time-code input (reference 1.8): N boxes (60 px, radius 15, 23/800).
 * A single hidden TextInput captures the digits; the boxes only display them.
 * The next empty box has the green focus ring.
 */
export function OtpInput({ value, onChangeText, length = 4, error, disabled = false, autoFocus = false }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const activeIndex = Math.min(value.length, length - 1);
  return (
    <View style={{ gap: Spacing.s6 }}>
      <Pressable accessibilityLabel="Nhập mã xác thực" onPress={() => inputRef.current?.focus()}>
        <View style={{ flexDirection: 'row', gap: Spacing.s11 }}>
          {Array.from({ length }, (_, i) => {
            const active = i === activeIndex && !error && !disabled;
            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 60,
                  borderRadius: Radius.button,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.white,
                  borderWidth: active ? BorderWidth.ringStrong : BorderWidth.ring,
                  borderColor: error ? Colors.danger : active ? Colors.primary : Colors.border,
                  opacity: disabled ? 0.6 : 1,
                }}>
                <AppText style={Typography.title}>{value[i] ?? ''}</AppText>
              </View>
            );
          })}
        </View>
      </Pressable>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        editable={!disabled}
        autoFocus={autoFocus}
        caretHidden
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />
      {error ? (
        <AppText variant="bodyStrong" style={{ color: Colors.danger, textAlign: 'center', fontSize: 11.5 }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
