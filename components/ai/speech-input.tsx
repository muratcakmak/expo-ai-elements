import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { MicIcon, MicOffIcon } from 'lucide-react-native';
import * as React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type SpeechInputProps = {
  onTranscript?: (text: string) => void;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  className?: string;
};

const AnimatedButton = Animated.createAnimatedComponent(Button);

const SpeechInput = React.memo(function SpeechInput({
  isRecording = false,
  onToggleRecording,
  className,
}: SpeechInputProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
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
    <AnimatedButton
      size="icon"
      variant={isRecording ? 'destructive' : 'secondary'}
      className={cn('size-10 rounded-full', className)}
      onPress={onToggleRecording}
      style={animatedStyle}
    >
      <Icon
        as={isRecording ? MicOffIcon : MicIcon}
        className={cn('size-5', isRecording ? 'text-white' : 'text-secondary-foreground')}
      />
    </AnimatedButton>
  );
});

SpeechInput.displayName = 'SpeechInput';

export { SpeechInput };
export type { SpeechInputProps };
