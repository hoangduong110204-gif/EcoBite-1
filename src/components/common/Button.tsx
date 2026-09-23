import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { ButtonStyles, Colors } from '@/constants';

import { Icon, type IconName } from './icons';

type ButtonVariant = keyof typeof ButtonStyles.variants;
type ButtonSize = keyof typeof ButtonStyles.sizes;

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  /**
   * `primary` (green), `secondary` (white + mint ring), `soft` (mint),
   * `destructive` (red outline), `danger` (solid red), `neutral` (grey).
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon (stroked in the label colour). */
  icon?: IconName;
  /** Shows a spinner instead of the label and blocks presses. */
  loading?: boolean;
}

const SPINNER: Record<ButtonVariant, string> = {
  primary: Colors.textOnPrimary,
  secondary: Colors.primaryDark,
  soft: Colors.primaryDark,
  destructive: Colors.danger,
  danger: Colors.textOnPrimary,
  neutral: Colors.disabledText,
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const inactive = disabled || loading;
  const labelColor = disabled ? ButtonStyles.disabledLabel.color : ButtonStyles.labels[variant].color;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: loading }}
      disabled={inactive}
      style={(state) => [
        ButtonStyles.base,
        ButtonStyles.sizes[size],
        ButtonStyles.variants[variant],
        disabled && ButtonStyles.disabled,
        state.pressed && { opacity: 0.85 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={SPINNER[variant]} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={size === 'md' ? 18 : 15} color={labelColor} /> : null}
          <Text style={[ButtonStyles.label, ButtonStyles.labelSizes[size], { color: labelColor }]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
