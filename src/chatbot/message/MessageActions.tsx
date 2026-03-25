import React from 'react';
import { StyleSheet, View, Text, type ViewProps, type ViewStyle } from 'react-native';

import { Button, type ButtonProps } from '../../primitives/Button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../primitives/Tooltip';

/* ------------------------------- MessageActions ------------------------------ */

export type MessageActionsProps = ViewProps & {
  className?: string;
  style?: ViewStyle;
};

export const MessageActions = ({
  className,
  children,
  style,
  ...props
}: MessageActionsProps) => (
  <View
    style={[styles.actions, style]}
    {...props}
  >
    {children}
  </View>
);

/* ------------------------------- MessageAction ------------------------------ */

export type MessageActionProps = ButtonProps & {
  className?: string;
  tooltip?: string;
  label?: string;
};

export const MessageAction = ({
  tooltip,
  children,
  label,
  variant = 'ghost',
  size = 'icon-sm',
  ...props
}: MessageActionProps) => {
  const button = (
    <Button
      size={size}
      variant={variant}
      accessibilityLabel={label || tooltip}
      {...props}
    >
      {children}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        <TooltipTrigger>{button}</TooltipTrigger>
      </Tooltip>
    );
  }

  return button;
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
