import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Collapsible from '@rn-primitives/collapsible';
import { ChevronDownIcon, SearchIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

// --- TaskItemFile ---

type TaskItemFileProps = {
  children?: React.ReactNode;
  className?: string;
};

const TaskItemFile = React.memo(function TaskItemFile({
  children,
  className,
}: TaskItemFileProps) {
  return (
    <View
      className={cn(
        'bg-secondary border-border flex-row items-center gap-1 rounded-md border px-1.5 py-0.5',
        className
      )}
    >
      {typeof children === 'string' ? (
        <Text className="text-foreground text-xs">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
});

TaskItemFile.displayName = 'TaskItemFile';

// --- TaskItem ---

type TaskItemProps = {
  children?: React.ReactNode;
  className?: string;
};

const TaskItem = React.memo(function TaskItem({ children, className }: TaskItemProps) {
  return (
    <View className={cn('flex-row items-center', className)}>
      {typeof children === 'string' ? (
        <Text className="text-muted-foreground text-sm">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
});

TaskItem.displayName = 'TaskItem';

// --- Task (root with collapsible) ---

type TaskProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const Task = React.memo(function Task({
  defaultOpen = true,
  open,
  onOpenChange,
  children,
  className,
}: TaskProps) {
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn(className)}
    >
      {children}
    </Collapsible.Root>
  );
});

Task.displayName = 'Task';

// --- TaskTrigger ---

type TaskTriggerProps = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

const TaskTrigger = React.memo(function TaskTrigger({
  title,
  children,
  className,
}: TaskTriggerProps) {
  return (
    <Collapsible.Trigger asChild>
      <Pressable className={cn('flex-row items-center gap-2', className)}>
        {children ?? (
          <>
            <Icon as={SearchIcon} className="text-muted-foreground size-4" />
            <Text className="text-muted-foreground flex-1 text-sm">{title}</Text>
            <Icon as={ChevronDownIcon} className="text-muted-foreground size-4" />
          </>
        )}
      </Pressable>
    </Collapsible.Trigger>
  );
});

TaskTrigger.displayName = 'TaskTrigger';

// --- TaskContent ---

type TaskContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const TaskContent = React.memo(function TaskContent({ children, className }: TaskContentProps) {
  return (
    <Collapsible.Content>
      <View className={cn('border-muted mt-4 gap-2 border-l-2 pl-4', className)}>
        {children}
      </View>
    </Collapsible.Content>
  );
});

TaskContent.displayName = 'TaskContent';

export { Task, TaskTrigger, TaskContent, TaskItem, TaskItemFile };
export type { TaskProps, TaskTriggerProps, TaskContentProps, TaskItemProps, TaskItemFileProps };
