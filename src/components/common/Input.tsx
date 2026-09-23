import { useState, type ReactNode, type Ref } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, InputStyles } from '@/constants';

import { AppText } from './AppText';
import { Icon, type IconName } from './icons';

interface InputProps extends TextInputProps {
  /** Label shown above the field (`.nhap label`). */
  label?: string;
  /** Error message; also turns the field ring red. */
  error?: string;
  /** Neutral helper line under the field (hidden while `error` is shown). */
  helper?: string;
  /** Leading icon inside the field. */
  icon?: IconName;
  /** Password field with an eye toggle. */
  password?: boolean;
  disabled?: boolean;
  /** Trailing content inside the field (e.g. a "Đã xác thực" badge). */
  right?: ReactNode;
  /** Ref of the underlying TextInput (e.g. to focus it from a button). */
  inputRef?: Ref<TextInput>;
}

export function Input({
  label,
  error,
  helper,
  icon,
  password = false,
  disabled = false,
  right,
  inputRef,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  return (
    <View style={InputStyles.wrapper}>
      {label ? <AppText variant="label" color="textMuted" style={InputStyles.label}>{label}</AppText> : null}
      <View
        style={[
          InputStyles.field,
          focused && !error && InputStyles.focused,
          !!error && InputStyles.error,
          disabled && InputStyles.disabled,
        ]}>
        {icon ? <Icon name={icon} size={17} color={Colors.textFaint} /> : null}
        <TextInput
          ref={inputRef}
          editable={!disabled}
          placeholderTextColor={Colors.textFaint}
          secureTextEntry={password && !revealed}
          style={InputStyles.text}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {right}
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            hitSlop={8}
            onPress={() => setRevealed((v) => !v)}>
            <Icon name="eye" size={17} color={revealed ? Colors.primary : Colors.textFaint} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText style={InputStyles.helperError}>{error}</AppText>
      ) : helper ? (
        <AppText style={InputStyles.helper}>{helper}</AppText>
      ) : null}
    </View>
  );
}
