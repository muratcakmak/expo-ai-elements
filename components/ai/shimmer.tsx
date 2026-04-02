import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type ShimmerProps = ViewProps & {
  children?: string;
  duration?: number;
};

const Shimmer = React.memo(function Shimmer({
  children = 'Thinking...',
  className,
  duration = 1.5,
  ...props
}: ShimmerProps) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: duration * 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className={cn('flex-row items-center', className)} {...props}>
      <Animated.View style={animatedStyle}>
        <Text className="text-muted-foreground text-sm">{children}</Text>
      </Animated.View>
    </View>
  );
});

Shimmer.displayName = 'Shimmer';

export { Shimmer };
export type { ShimmerProps };
