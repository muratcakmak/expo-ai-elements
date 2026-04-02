import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  BanIcon,
  CheckCircleIcon,
  CircleIcon,
  LoaderIcon,
  XCircleIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

// --- Types ---

type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

type TaskProps = {
  title: string;
  description?: string;
  status: TaskStatus;
  className?: string;
};

// --- TaskStatusIcon ---

function TaskStatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'queued':
      return <Icon as={CircleIcon} className="text-muted-foreground size-4" />;
    case 'running':
      return <Icon as={LoaderIcon} className="size-4 text-blue-500" />;
    case 'completed':
      return <Icon as={CheckCircleIcon} className="size-4 text-green-500" />;
    case 'failed':
      return <Icon as={XCircleIcon} className="size-4 text-red-500" />;
    case 'cancelled':
      return <Icon as={BanIcon} className="text-muted-foreground size-4" />;
  }
}

// --- Status label ---

const STATUS_LABELS: Record<TaskStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

// --- Task ---

const Task = React.memo(function Task({
  title,
  description,
  status,
  className,
}: TaskProps) {
  return (
    <View
      className={cn(
        'bg-secondary/50 border-border rounded-lg border px-3 py-2.5',
        status === 'failed' && 'border-red-500/20',
        className
      )}
    >
      <View className="flex-row items-center gap-2">
        <TaskStatusIcon status={status} />
        <Text className="text-foreground flex-1 text-sm font-medium">{title}</Text>
        <Text
          className={cn(
            'text-xs',
            status === 'running' && 'text-blue-500',
            status === 'completed' && 'text-green-500',
            status === 'failed' && 'text-red-500',
            status === 'cancelled' && 'text-muted-foreground',
            status === 'queued' && 'text-muted-foreground'
          )}
        >
          {STATUS_LABELS[status]}
        </Text>
      </View>
      {description && (
        <Text className="text-muted-foreground mt-1 pl-6 text-xs">{description}</Text>
      )}
    </View>
  );
});

Task.displayName = 'Task';

export { Task };
export type { TaskProps, TaskStatus };
