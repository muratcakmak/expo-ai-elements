import { Pressable, Text, View, type ViewProps, type PressableProps } from 'react-native';

import { cn } from '../../utils/cn';

// ============================================================================
// PromptInputTabsList — horizontal scrolling tab bar
// ============================================================================

export type PromptInputTabsListProps = ViewProps & {
  className?: string;
};

export const PromptInputTabsList = ({
  className,
  ...props
}: PromptInputTabsListProps) => (
  <View className={cn('flex-row', className)} {...props} />
);

// ============================================================================
// PromptInputTab — single tab container
// ============================================================================

export type PromptInputTabProps = ViewProps & {
  className?: string;
};

export const PromptInputTab = ({
  className,
  ...props
}: PromptInputTabProps) => <View className={cn(className)} {...props} />;

// ============================================================================
// PromptInputTabLabel — section heading
// ============================================================================

export type PromptInputTabLabelProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export const PromptInputTabLabel = ({
  className,
  children,
  ...props
}: PromptInputTabLabelProps) => (
  <View
    className={cn('mb-2 px-3', className)}
    accessibilityRole="header"
    {...props}
  >
    {typeof children === 'string' ? (
      <Text className="text-xs font-medium text-muted-foreground">
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

// ============================================================================
// PromptInputTabBody — content area below label
// ============================================================================

export type PromptInputTabBodyProps = ViewProps & {
  className?: string;
};

export const PromptInputTabBody = ({
  className,
  ...props
}: PromptInputTabBodyProps) => (
  <View className={cn('gap-1', className)} {...props} />
);

// ============================================================================
// PromptInputTabItem — individual row inside a tab body
// ============================================================================

export type PromptInputTabItemProps = PressableProps & {
  className?: string;
};

export const PromptInputTabItem = ({
  className,
  ...props
}: PromptInputTabItemProps) => (
  <Pressable
    className={cn(
      'flex-row items-center gap-2 px-3 py-2',
      className,
    )}
    {...props}
  />
);
