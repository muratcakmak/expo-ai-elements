import React from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type ViewProps,
} from 'react-native';
import { X } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';

/* ---------------------------------- Root ---------------------------------- */

type ArtifactProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const Artifact = ({ className, children, ...props }: ArtifactProps) => (
  <View
    className={cn(
      'overflow-hidden rounded-lg border border-border bg-background shadow-sm',
      className,
    )}
    {...props}
  >
    {children}
  </View>
);

/* --------------------------------- Header --------------------------------- */

type ArtifactHeaderProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const ArtifactHeader = ({
  className,
  children,
  ...props
}: ArtifactHeaderProps) => (
  <View
    className={cn(
      'flex-row items-center justify-between border-b border-border bg-muted/50 px-4 py-3',
      className,
    )}
    {...props}
  >
    {children}
  </View>
);

/* --------------------------------- Close ---------------------------------- */

type ArtifactCloseProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

const ArtifactClose = ({
  className,
  children,
  ...props
}: ArtifactCloseProps) => (
  <Pressable
    className={cn(
      'h-8 w-8 items-center justify-center',
      className,
    )}
    accessibilityRole="button"
    accessibilityLabel="Close"
    {...props}
  >
    {children ?? <X size={16} className="text-muted-foreground" />}
  </Pressable>
);

/* ---------------------------------- Title --------------------------------- */

type ArtifactTitleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const ArtifactTitle = ({
  className,
  children,
  ...props
}: ArtifactTitleProps) => (
  <View className={cn(className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="text-sm font-medium text-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

/* ------------------------------ Description ------------------------------- */

type ArtifactDescriptionProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const ArtifactDescription = ({
  className,
  children,
  ...props
}: ArtifactDescriptionProps) => (
  <View className={cn(className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="text-sm text-muted-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

/* -------------------------------- Actions --------------------------------- */

type ArtifactActionsProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const ArtifactActions = ({
  className,
  children,
  ...props
}: ArtifactActionsProps) => (
  <View
    className={cn('flex-row items-center gap-1', className)}
    {...props}
  >
    {children}
  </View>
);

/* --------------------------------- Action --------------------------------- */

type ArtifactActionProps = PressableProps & {
  className?: string;
  label?: string;
  children?: React.ReactNode;
};

const ArtifactAction = ({
  label,
  children,
  className,
  ...props
}: ArtifactActionProps) => (
  <Pressable
    className={cn(
      'h-8 w-8 items-center justify-center',
      className,
    )}
    accessibilityRole="button"
    accessibilityLabel={label}
    {...props}
  >
    {children}
  </Pressable>
);

/* -------------------------------- Content --------------------------------- */

type ArtifactContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const ArtifactContent = ({
  className,
  children,
  ...props
}: ArtifactContentProps) => (
  <View className={cn('flex-1 overflow-hidden p-4', className)} {...props}>
    {children}
  </View>
);

export {
  Artifact,
  ArtifactHeader,
  ArtifactClose,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactActions,
  ArtifactAction,
  ArtifactContent,
  type ArtifactProps,
  type ArtifactHeaderProps,
  type ArtifactCloseProps,
  type ArtifactTitleProps,
  type ArtifactDescriptionProps,
  type ArtifactActionsProps,
  type ArtifactActionProps,
  type ArtifactContentProps,
};
