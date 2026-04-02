import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

type CheckpointProps = {
  label: string;
  timestamp?: Date;
  className?: string;
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const Checkpoint = React.memo(function Checkpoint({
  label,
  timestamp,
  className,
}: CheckpointProps) {
  return (
    <View className={cn('flex-row items-center gap-3 px-4 py-2', className)}>
      <View className="bg-border h-px flex-1" />
      <View className="bg-muted flex-row items-center gap-1.5 rounded-full px-3 py-1">
        <Text className="text-muted-foreground text-xs font-medium">{label}</Text>
        {timestamp ? (
          <Text className="text-muted-foreground/70 text-xs">{formatTime(timestamp)}</Text>
        ) : null}
      </View>
      <View className="bg-border h-px flex-1" />
    </View>
  );
});

Checkpoint.displayName = 'Checkpoint';

export { Checkpoint };
export type { CheckpointProps };
