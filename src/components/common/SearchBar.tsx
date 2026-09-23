import { useState } from 'react';
import { Platform, Pressable, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { BorderWidth, Colors, Radius, Shadows, Sizes, Spacing, Typography } from '@/constants';

import { AppText } from './AppText';
import { Icon, type IconName } from './icons';

/** The field draws its own focus ring; hide the browser's default outline on web. */
const NO_WEB_OUTLINE = Platform.select({ web: { outlineStyle: 'none' } as object, default: {} });

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  /** Shows the clear (x) button while there is text. */
  onClear?: () => void;
  autoFocus?: boolean;
  /**
   * Fake bar (Home 3.1): 46 px, shadowed, not editable; the whole bar is a
   * button that opens Search.
   */
  onPress?: () => void;
  /** Fake bar only: trailing icon (Home shows the filter sliders, reference 1). */
  rightIcon?: IconName;
  style?: StyleProp<ViewStyle>;
}

/** Search field: editable (3.4 / 3.5, 42 px) or a tappable fake (Home, 46 px). */
export function SearchBar({
  value = '',
  placeholder = 'Tìm món ăn, nhà hàng…',
  onChangeText,
  onSubmit,
  onClear,
  autoFocus,
  onPress,
  rightIcon,
  style,
}: SearchBarProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        onPress={onPress}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.s10,
            height: Sizes.searchHome,
            paddingHorizontal: Spacing.lg,
            borderRadius: Radius.button,
            backgroundColor: Colors.white,
            borderWidth: BorderWidth.hairline,
            borderColor: Colors.border,
          },
          Shadows.card,
          style,
        ]}>
        <Icon name="search" size={17} color={Colors.textFaint} />
        <AppText variant="input" color="textFaint" style={{ flex: 1 }}>
          {placeholder}
        </AppText>
        {rightIcon ? <Icon name={rightIcon} size={18} color={Colors.primaryDark} /> : null}
      </Pressable>
    );
  }
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.s10,
          height: Sizes.searchField,
          paddingHorizontal: Spacing.s14,
          borderRadius: Radius.md,
          backgroundColor: Colors.white,
          borderWidth: BorderWidth.ring,
          borderColor: active ? Colors.primary : Colors.border,
        },
        style,
      ]}>
      <Icon name="search" size={16} color={active ? Colors.primary : Colors.textFaint} />
      <TextInput
        accessibilityLabel="Tìm kiếm"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        placeholder={placeholder}
        placeholderTextColor={Colors.textFaint}
        style={[{ flex: 1, height: '100%', color: Colors.text }, Typography.input, NO_WEB_OUTLINE]}
      />
      {active && onClear ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Xoá từ khoá" hitSlop={8} onPress={onClear}>
          <Icon name="close" size={15} color={Colors.textFaint} />
        </Pressable>
      ) : null}
    </View>
  );
}
