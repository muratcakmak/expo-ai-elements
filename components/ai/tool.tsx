import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Shimmer } from '@/components/ai/shimmer';
import * as Collapsible from '@rn-primitives/collapsible';
import {
  ChevronRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  LoaderIcon,
  WrenchIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// --- Types ---

type ToolStatus = 'pending' | 'running' | 'success' | 'error';

type ToolProps = {
  name: string;
  args?: Record<string, unknown>;
  result?: string;
  status: ToolStatus;
  className?: string;
};

// --- Spinner ---

const Spinner = React.memo(function Spinner() {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon as={LoaderIcon} className="size-4 text-blue-500" />
    </Animated.View>
  );
});

Spinner.displayName = 'Spinner';

// --- StatusIcon ---

function StatusIcon({ status }: { status: ToolStatus }) {
  switch (status) {
    case 'pending':
      return <Icon as={ClockIcon} className="text-muted-foreground size-4" />;
    case 'running':
      return <Spinner />;
    case 'success':
      return <Icon as={CircleCheckIcon} className="size-4 text-green-500" />;
    case 'error':
      return <Icon as={CircleXIcon} className="size-4 text-red-500" />;
  }
}

// --- Tool ---

const Tool = React.memo(function Tool({
  name,
  args,
  result,
  status,
  className,
}: ToolProps) {
  return (
    <View
      className={cn(
        'bg-secondary/50 rounded-lg border',
        status === 'error' ? 'border-red-500/20' : 'border-border',
        className
      )}
    >
      {/* Header */}
      <View className="flex-row items-center gap-2 px-3 py-2">
        <Icon as={WrenchIcon} className="text-muted-foreground size-4" />
        <Text className="text-foreground flex-1 text-sm font-medium">{name}</Text>
        <StatusIcon status={status} />
      </View>

      {/* Args section */}
      {args && Object.keys(args).length > 0 && (
        <Collapsible.Root>
          <Collapsible.Trigger asChild>
            <Pressable className="border-border flex-row items-center gap-1 border-t px-3 py-1.5">
              <Icon as={ChevronRightIcon} className="text-muted-foreground size-3" />
              <Text className="text-muted-foreground text-xs">Arguments</Text>
            </Pressable>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <View className="bg-muted/50 px-3 py-2">
              <Text className="text-muted-foreground font-mono text-xs">
                {JSON.stringify(args, null, 2)}
              </Text>
            </View>
          </Collapsible.Content>
        </Collapsible.Root>
      )}

      {/* Result section */}
      {status === 'running' && (
        <View className="border-border border-t px-3 py-2">
          <Shimmer>Running...</Shimmer>
        </View>
      )}

      {result != null && (
        <Collapsible.Root>
          <Collapsible.Trigger asChild>
            <Pressable className="border-border flex-row items-center gap-1 border-t px-3 py-1.5">
              <Icon as={ChevronRightIcon} className="text-muted-foreground size-3" />
              <Text className="text-muted-foreground text-xs">Result</Text>
            </Pressable>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <View className="bg-muted/50 px-3 py-2">
              <Text
                className={cn(
                  'font-mono text-xs',
                  status === 'error' ? 'text-red-500' : 'text-muted-foreground'
                )}
              >
                {result}
              </Text>
            </View>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </View>
  );
});

Tool.displayName = 'Tool';

export { Tool };
export type { ToolProps, ToolStatus };
