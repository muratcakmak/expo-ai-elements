import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { XIcon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

// --- Artifact (container) ---

type ArtifactProps = ViewProps;

function Artifact({ className, ...props }: ArtifactProps) {
  return (
    <View
      className={cn(
        'bg-background border-border overflow-hidden rounded-lg border shadow-sm',
        className
      )}
      {...props}
    />
  );
}

// --- ArtifactHeader ---

type ArtifactHeaderProps = ViewProps;

function ArtifactHeader({ className, ...props }: ArtifactHeaderProps) {
  return (
    <View
      className={cn(
        'bg-muted/50 border-border flex-row items-center justify-between border-b px-4 py-3',
        className
      )}
      {...props}
    />
  );
}

// --- ArtifactClose ---

type ArtifactCloseProps = ButtonProps;

function ArtifactClose({
  className,
  children,
  size = 'icon',
  variant = 'ghost',
  ...props
}: ArtifactCloseProps) {
  return (
    <Button
      className={cn('h-8 w-8 p-0', className)}
      size={size}
      variant={variant}
      accessibilityLabel="Close"
      {...props}
    >
      {children ?? <Icon as={XIcon} className="text-muted-foreground size-4" />}
    </Button>
  );
}

// --- ArtifactTitle ---

type ArtifactTitleProps = React.ComponentProps<typeof Text>;

function ArtifactTitle({ className, ...props }: ArtifactTitleProps) {
  return <Text className={cn('text-foreground text-sm font-medium', className)} {...props} />;
}

// --- ArtifactDescription ---

type ArtifactDescriptionProps = React.ComponentProps<typeof Text>;

function ArtifactDescription({ className, ...props }: ArtifactDescriptionProps) {
  return <Text className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

// --- ArtifactActions ---

type ArtifactActionsProps = ViewProps;

function ArtifactActions({ className, ...props }: ArtifactActionsProps) {
  return <View className={cn('flex-row items-center gap-1', className)} {...props} />;
}

// --- ArtifactAction ---

type ArtifactActionProps = ButtonProps & {
  label?: string;
  icon?: LucideIcon;
};

function ArtifactAction({
  label,
  icon: IconComponent,
  children,
  className,
  size = 'icon',
  variant = 'ghost',
  ...props
}: ArtifactActionProps) {
  return (
    <Button
      className={cn('h-8 w-8 p-0', className)}
      size={size}
      variant={variant}
      accessibilityLabel={label}
      {...props}
    >
      {IconComponent ? (
        <Icon as={IconComponent} className="text-muted-foreground size-4" />
      ) : (
        children
      )}
    </Button>
  );
}

// --- ArtifactContent ---

type ArtifactContentProps = ViewProps;

function ArtifactContent({ className, ...props }: ArtifactContentProps) {
  return <View className={cn('flex-1 overflow-hidden p-4', className)} {...props} />;
}

Artifact.displayName = 'Artifact';
ArtifactHeader.displayName = 'ArtifactHeader';
ArtifactClose.displayName = 'ArtifactClose';
ArtifactTitle.displayName = 'ArtifactTitle';
ArtifactDescription.displayName = 'ArtifactDescription';
ArtifactActions.displayName = 'ArtifactActions';
ArtifactAction.displayName = 'ArtifactAction';
ArtifactContent.displayName = 'ArtifactContent';

export {
  Artifact,
  ArtifactHeader,
  ArtifactClose,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactActions,
  ArtifactAction,
  ArtifactContent,
};
export type {
  ArtifactProps,
  ArtifactHeaderProps,
  ArtifactCloseProps,
  ArtifactTitleProps,
  ArtifactDescriptionProps,
  ArtifactActionsProps,
  ArtifactActionProps,
  ArtifactContentProps,
};
