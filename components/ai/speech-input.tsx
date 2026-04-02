import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { MicIcon, SquareIcon } from 'lucide-react-native';
import * as React from 'react';
import { type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

type SpeechInputProps = ViewProps & {
  isRecording?: boolean;
  onToggleRecording?: () => void;
  onTranscript?: (text: string) => void;
  disabled?: boolean;
  className?: string;
};

const AnimatedPulseRing = React.memo(function AnimatedPulseRing({
  index,
}: {
  index: number;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    const delay = index * 300;
    const startAnimation = () => {
      scale.value = withRepeat(
        withTiming(2, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      opacity.value = withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    };

    const timeout = setTimeout(startAnimation, delay);
    return () => clearTimeout(timeout);
  }, [index, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  }));

  return <Animated.View style={animatedStyle} />;
});

const SpeechInput = React.memo(function SpeechInput({
  isRecording = false,
  onToggleRecording,
  disabled = false,
  className,
}: SpeechInputProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className="relative items-center justify-center"
      style={animatedStyle}
    >
      {/* Animated pulse rings */}
      {isRecording && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="absolute inset-0"
        >
          {[0, 1, 2].map((index) => (
            <AnimatedPulseRing key={index} index={index} />
          ))}
        </Animated.View>
      )}

      {/* Main record button */}
      <Button
        size="icon"
        variant={isRecording ? 'destructive' : 'secondary'}
        className={cn('z-10 size-10 rounded-full', className)}
        onPress={onToggleRecording}
        disabled={disabled}
      >
        <Icon
          as={isRecording ? SquareIcon : MicIcon}
          className={cn(
            'size-5',
            isRecording ? 'text-white' : 'text-secondary-foreground'
          )}
        />
      </Button>
    </Animated.View>
  );
});

SpeechInput.displayName = 'SpeechInput';

export { SpeechInput };
export type { SpeechInputProps };
