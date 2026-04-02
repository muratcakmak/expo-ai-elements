import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  BotIcon,
  CheckCircleIcon,
  CircleAlertIcon,
  CircleIcon,
  ClockIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// --- Types ---

type AgentStatus = 'idle' | 'thinking' | 'acting' | 'waiting' | 'complete' | 'error';

type AgentProps = {
  name: string;
  status: AgentStatus;
  action?: string;
  className?: string;
};

// --- Animated indicator for active states ---

const PulseIndicator = React.memo(function PulseIndicator({
  children,
}: {
  children: React.ReactNode;
}) {
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});

PulseIndicator.displayName = 'PulseIndicator';

// --- StatusIndicator ---

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: 'Idle',
  thinking: 'Thinking',
  acting: 'Acting',
  waiting: 'Waiting',
  complete: 'Complete',
  error: 'Error',
};

const ACTIVE_STATUSES: Set<AgentStatus> = new Set(['thinking', 'acting', 'waiting']);

function StatusIndicator({ status }: { status: AgentStatus }) {
  const iconElement = (() => {
    switch (status) {
      case 'idle':
        return <Icon as={CircleIcon} className="text-muted-foreground size-3" />;
      case 'thinking':
        return <Icon as={BotIcon} className="size-3 text-blue-500" />;
      case 'acting':
        return <Icon as={BotIcon} className="size-3 text-purple-500" />;
      case 'waiting':
        return <Icon as={ClockIcon} className="size-3 text-yellow-500" />;
      case 'complete':
        return <Icon as={CheckCircleIcon} className="size-3 text-green-500" />;
      case 'error':
        return <Icon as={CircleAlertIcon} className="size-3 text-red-500" />;
    }
  })();

  if (ACTIVE_STATUSES.has(status)) {
    return <PulseIndicator>{iconElement}</PulseIndicator>;
  }

  return iconElement;
}

// --- Agent ---

const Agent = React.memo(function Agent({
  name,
  status,
  action,
  className,
}: AgentProps) {
  return (
    <View
      className={cn(
        'bg-secondary/50 border-border flex-row items-center gap-3 rounded-lg border px-3 py-2.5',
        status === 'error' && 'border-red-500/20',
        className
      )}
    >
      <StatusIndicator status={status} />
      <View className="flex-1 gap-0.5">
        <Text className="text-foreground text-sm font-medium">{name}</Text>
        {action ? (
          <Text className="text-muted-foreground text-xs">{action}</Text>
        ) : (
          <Text
            className={cn(
              'text-xs',
              status === 'thinking' && 'text-blue-500',
              status === 'acting' && 'text-purple-500',
              status === 'waiting' && 'text-yellow-500',
              status === 'complete' && 'text-green-500',
              status === 'error' && 'text-red-500',
              status === 'idle' && 'text-muted-foreground'
            )}
          >
            {STATUS_LABELS[status]}
          </Text>
        )}
      </View>
    </View>
  );
});

Agent.displayName = 'Agent';

export { Agent };
export type { AgentProps, AgentStatus };
