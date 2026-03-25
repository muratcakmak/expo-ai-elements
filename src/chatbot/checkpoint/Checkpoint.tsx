import React from 'react';
import { View, Text, type ViewProps, type PressableProps } from 'react-native';
import { BookmarkIcon } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';
import { Separator } from '../../primitives/Separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../primitives/Tooltip';

/* ------------------------------- Checkpoint ------------------------------- */

export type CheckpointProps = ViewProps & {
  className?: string;
};

export const Checkpoint = ({
  className,
  children,
  ...props
}: CheckpointProps) => (
  <View
    className={cn(
      'flex-row items-center gap-1 overflow-hidden',
      className,
    )}
    {...props}
  >
    {children}
    <Separator />
  </View>
);

/* ----------------------------- CheckpointIcon ----------------------------- */

export type CheckpointIconProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export const CheckpointIcon = ({
  className,
  children,
  ...props
}: CheckpointIconProps) =>
  children ? (
    <View className={cn(className)} {...props}>
      {children}
    </View>
  ) : (
    <View className={cn(className)} {...props}>
      <BookmarkIcon size={16} className="text-muted-foreground shrink-0" />
    </View>
  );

/* -------------------------- CheckpointTrigger ---------------------------- */

export type CheckpointTriggerProps = ButtonProps & {
  tooltip?: string;
};

export const CheckpointTrigger = ({
  children,
  variant = 'ghost',
  size = 'sm',
  tooltip,
  ...props
}: CheckpointTriggerProps) =>
  tooltip ? (
    <Tooltip content={tooltip}>
      <TooltipTrigger>
        <Button size={size} variant={variant} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
    </Tooltip>
  ) : (
    <Button size={size} variant={variant} {...props}>
      {children}
    </Button>
  );
