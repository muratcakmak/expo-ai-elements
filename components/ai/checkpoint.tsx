import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Bookmark as BookmarkIcon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

// ============================================================================
// Checkpoint - Container with separator lines
// ============================================================================

type CheckpointProps = ViewProps;

const Checkpoint = React.memo(function Checkpoint({
  className,
  children,
  ...props
}: CheckpointProps) {
  return (
    <View
      className={cn('flex-row items-center gap-1 overflow-hidden', className)}
      {...props}
    >
      {children}
      <View className="bg-border h-px flex-1" />
    </View>
  );
});

Checkpoint.displayName = 'Checkpoint';

// ============================================================================
// CheckpointIcon - Customizable icon
// ============================================================================

type CheckpointIconProps = {
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
};

const CheckpointIcon = React.memo(function CheckpointIcon({
  icon = BookmarkIcon,
  className,
  children,
}: CheckpointIconProps) {
  if (children) {
    return <>{children}</>;
  }

  return <Icon as={icon} className={cn('text-muted-foreground size-4 shrink-0', className)} />;
});

CheckpointIcon.displayName = 'CheckpointIcon';

// ============================================================================
// CheckpointTrigger - Tappable label button
// ============================================================================

type CheckpointTriggerProps = Omit<ButtonProps, 'variant' | 'size'> & {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
};

const CheckpointTrigger = React.memo(function CheckpointTrigger({
  children,
  variant = 'ghost',
  size = 'sm',
  className,
  ...props
}: CheckpointTriggerProps) {
  return (
    <Button variant={variant} size={size} className={cn(className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="text-muted-foreground text-xs font-medium">{children}</Text>
      ) : (
        children
      )}
    </Button>
  );
});

CheckpointTrigger.displayName = 'CheckpointTrigger';

export { Checkpoint, CheckpointIcon, CheckpointTrigger };
export type { CheckpointProps, CheckpointIconProps, CheckpointTriggerProps };
