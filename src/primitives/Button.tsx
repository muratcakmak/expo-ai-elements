import React from 'react';
import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';

type ButtonProps = PressableProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  default: { backgroundColor: '#18181b' },
  destructive: { backgroundColor: '#ef4444' },
  outline: { borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff' },
  secondary: { backgroundColor: '#f3f4f6' },
  ghost: {},
  link: {},
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: { height: 36, paddingHorizontal: 16, paddingVertical: 8 },
  sm: { height: 32, paddingHorizontal: 12, borderRadius: 6 },
  lg: { height: 40, paddingHorizontal: 24, borderRadius: 6 },
  icon: { height: 36, width: 36 },
  'icon-sm': { height: 32, width: 32 },
  'icon-lg': { height: 40, width: 40 },
};

function Button({
  variant = 'default',
  size = 'default',
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style as ViewStyle,
      ]}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 6,
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Button, type ButtonProps };
