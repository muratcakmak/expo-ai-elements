import * as React from 'react';
import {
  View,
  TextInput,
  Pressable,
  type ViewProps,
  type TextInputProps,
  type PressableProps,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
} from 'react-native';

import { cn } from '../utils/cn';

/* ---------------------------------- Root ----------------------------------- */

type InputGroupProps = ViewProps & {
  className?: string;
};

function InputGroup({ children, className, ...props }: InputGroupProps) {
  return (
    <View
      className={cn(
        'flex-row items-center rounded-md border border-input shadow-sm',
        className,
      )}
      accessibilityRole="none"
      {...props}
    >
      {children}
    </View>
  );
}

/* -------------------------------- Textarea --------------------------------- */

type InputGroupTextareaProps = TextInputProps & {
  className?: string;
  minHeight?: number;
  maxHeight?: number;
};

function InputGroupTextarea({
  className,
  minHeight = 40,
  maxHeight = 200,
  style,
  onContentSizeChange,
  ...props
}: InputGroupTextareaProps) {
  const [height, setHeight] = React.useState(minHeight);

  const handleContentSizeChange = React.useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const contentHeight = e.nativeEvent.contentSize.height;
      setHeight(Math.min(Math.max(contentHeight, minHeight), maxHeight));
      onContentSizeChange?.(e);
    },
    [minHeight, maxHeight, onContentSizeChange],
  );

  return (
    <TextInput
      multiline
      className={cn(
        'flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
        className,
      )}
      style={[{ height }, style]}
      onContentSizeChange={handleContentSizeChange}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

/* ---------------------------------- Addon ---------------------------------- */

type InputGroupAddonProps = ViewProps & {
  className?: string;
  align?: 'start' | 'end';
};

function InputGroupAddon({ children, className, align = 'start', ...props }: InputGroupAddonProps) {
  return (
    <View
      className={cn(
        'items-center justify-center px-3 py-1.5',
        align === 'start' && 'order-first',
        align === 'end' && 'order-last',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}

/* --------------------------------- Button ---------------------------------- */

type InputGroupButtonProps = PressableProps & {
  className?: string;
};

function InputGroupButton({ children, className, ...props }: InputGroupButtonProps) {
  return (
    <Pressable
      className={cn(
        'items-center justify-center px-3 py-1.5',
        className,
      )}
      accessibilityRole="button"
      {...props}
    >
      {children}
    </Pressable>
  );
}

export {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
};
export type {
  InputGroupProps,
  InputGroupTextareaProps,
  InputGroupAddonProps,
  InputGroupButtonProps,
};
