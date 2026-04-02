import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { AlertTriangleIcon, ChevronDownIcon } from 'lucide-react-native';
import * as Collapsible from '@rn-primitives/collapsible';
import * as React from 'react';
import { View } from 'react-native';

type StackFrame = {
  file: string;
  line: number;
  function: string;
};

type StackTraceProps = {
  error: string;
  frames?: StackFrame[];
  className?: string;
};

const StackTrace = React.memo(function StackTrace({
  error,
  frames,
  className,
}: StackTraceProps) {
  return (
    <Collapsible.Root className={cn('bg-destructive/10 overflow-hidden rounded-lg', className)}>
      {/* Error header / trigger */}
      <Collapsible.Trigger
        className="flex-row items-center gap-2 px-3 py-3"
      >
        <Icon as={AlertTriangleIcon} className="text-destructive size-4" />
        <Text className="text-destructive flex-1 text-sm font-medium" numberOfLines={2}>
          {error}
        </Text>
        {frames && frames.length > 0 && (
          <Icon as={ChevronDownIcon} className="text-destructive size-4" />
        )}
      </Collapsible.Trigger>

      {/* Collapsible stack frames */}
      {frames && frames.length > 0 && (
        <Collapsible.Content>
          <View className="border-destructive/20 border-t px-3 py-2">
            {frames.map((frame, index) => (
              <View key={index} className="flex-row py-1">
                <Text className="text-muted-foreground font-mono text-xs">
                  {'  '}at{' '}
                </Text>
                <Text className="text-foreground font-mono text-xs font-medium">
                  {frame.function}
                </Text>
                <Text className="text-muted-foreground font-mono text-xs">
                  {' ('}
                  {frame.file}:{frame.line}
                  {')'}
                </Text>
              </View>
            ))}
          </View>
        </Collapsible.Content>
      )}
    </Collapsible.Root>
  );
});

StackTrace.displayName = 'StackTrace';

export { StackTrace };
export type { StackTraceProps, StackFrame };
