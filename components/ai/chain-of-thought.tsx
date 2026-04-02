import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CheckIcon, CircleIcon } from 'lucide-react-native';
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

type ThoughtStep = {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'complete';
};

type ChainOfThoughtProps = {
  steps: ThoughtStep[];
  className?: string;
};

// --- StepIndicator ---

const ActiveIndicator = React.memo(function ActiveIndicator() {
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

  return (
    <Animated.View style={animatedStyle}>
      <Icon as={CircleIcon} className="size-4 text-blue-500" />
    </Animated.View>
  );
});

ActiveIndicator.displayName = 'ActiveIndicator';

function StepIndicator({ status }: { status: ThoughtStep['status'] }) {
  if (status === 'complete') {
    return <Icon as={CheckIcon} className="size-4 text-green-500" />;
  }
  if (status === 'active') {
    return <ActiveIndicator />;
  }
  return <Icon as={CircleIcon} className="text-muted-foreground/40 size-4" />;
}

// --- ChainOfThought ---

const ChainOfThought = React.memo(function ChainOfThought({
  steps,
  className,
}: ChainOfThoughtProps) {
  return (
    <View className={cn('gap-2', className)}>
      {steps.map((step, index) => (
        <View key={step.id} className="flex-row items-center gap-3">
          <Text
            className={cn(
              'w-6 text-center text-xs font-medium',
              step.status === 'active' && 'text-blue-500',
              step.status === 'complete' && 'text-green-500',
              step.status === 'pending' && 'text-muted-foreground/40'
            )}
          >
            {String(index + 1)}
          </Text>
          <StepIndicator status={step.status} />
          <Text
            className={cn(
              'flex-1 text-sm',
              step.status === 'active' && 'text-foreground font-medium',
              step.status === 'complete' && 'text-muted-foreground',
              step.status === 'pending' && 'text-muted-foreground/40'
            )}
          >
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );
});

ChainOfThought.displayName = 'ChainOfThought';

export { ChainOfThought };
export type { ChainOfThoughtProps, ThoughtStep };
