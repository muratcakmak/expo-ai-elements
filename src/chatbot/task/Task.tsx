import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { SearchIcon, ChevronDownIcon } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  useCollapsible,
} from '../../primitives/Collapsible';

/* -------------------------------- TaskItemFile ----------------------------- */

export type TaskItemFileProps = ViewProps & {
  className?: string;
};

export const TaskItemFile = ({
  children,
  className,
  ...props
}: TaskItemFileProps) => (
  <View
    className={cn(
      'flex-row items-center gap-1 rounded-md border border-border bg-secondary px-1.5 py-0.5',
      className,
    )}
    {...props}
  >
    {typeof children === 'string' ? (
      <Text className="text-xs text-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

/* --------------------------------- TaskItem -------------------------------- */

export type TaskItemProps = ViewProps & {
  className?: string;
};

export const TaskItem = ({ children, className, ...props }: TaskItemProps) => (
  <View className={cn(className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="text-sm text-muted-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

/* ----------------------------------- Task ---------------------------------- */

export type TaskProps = React.ComponentProps<typeof Collapsible>;

export const Task = ({
  defaultOpen = true,
  className,
  ...props
}: TaskProps) => (
  <Collapsible className={cn(className)} defaultOpen={defaultOpen} {...props} />
);

/* -------------------------------- TaskTrigger ------------------------------ */

export type TaskTriggerProps = React.ComponentProps<typeof CollapsibleTrigger> & {
  title: string;
};

export const TaskTrigger = ({
  children,
  className,
  title,
  ...props
}: TaskTriggerProps) => {
  const { open } = useCollapsible();

  return (
    <CollapsibleTrigger className={cn('flex-row w-full items-center gap-2', className)} {...props}>
      {children ?? (
        <>
          <SearchIcon size={16} className="text-muted-foreground" />
          <Text className="flex-1 text-sm text-muted-foreground">{title}</Text>
          <View
            style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
          >
            <ChevronDownIcon size={16} className="text-muted-foreground" />
          </View>
        </>
      )}
    </CollapsibleTrigger>
  );
};

/* ------------------------------- TaskContent ------------------------------- */

export type TaskContentProps = React.ComponentProps<typeof CollapsibleContent>;

export const TaskContent = ({
  children,
  className,
  ...props
}: TaskContentProps) => (
  <CollapsibleContent className={cn(className)} {...props}>
    <View className="mt-4 gap-2 border-l-2 border-muted pl-4">
      {children}
    </View>
  </CollapsibleContent>
);
