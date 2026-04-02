import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Shimmer } from '@/components/ai/shimmer';
import * as Collapsible from '@rn-primitives/collapsible';
import { ChevronRightIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// --- Context ---

type ReasoningContextValue = {
  isStreaming: boolean;
  durationText: string | null;
};

const ReasoningContext = React.createContext<ReasoningContextValue>({
  isStreaming: false,
  durationText: null,
});

function useReasoningContext() {
  return React.useContext(ReasoningContext);
}

// --- Reasoning (Root) ---

type ReasoningProps = {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const Reasoning = React.memo(function Reasoning({
  isStreaming = false,
  open,
  defaultOpen,
  onOpenChange,
  children,
  className,
}: ReasoningProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const streamStartRef = React.useRef<number | null>(null);
  const [durationText, setDurationText] = React.useState<string | null>(null);

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  // Auto-open when streaming starts, auto-close 1s after streaming ends
  React.useEffect(() => {
    if (isStreaming) {
      streamStartRef.current = Date.now();
      setDurationText(null);
      handleOpenChange(true);
    } else if (streamStartRef.current !== null) {
      const elapsed = Math.round((Date.now() - streamStartRef.current) / 1000);
      setDurationText(`Thought for ${elapsed} second${elapsed !== 1 ? 's' : ''}`);
      streamStartRef.current = null;
      const timeout = setTimeout(() => handleOpenChange(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isStreaming, handleOpenChange]);

  const contextValue = React.useMemo(
    () => ({ isStreaming, durationText }),
    [isStreaming, durationText]
  );

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Collapsible.Root
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn('rounded-lg', className)}
      >
        {children}
      </Collapsible.Root>
    </ReasoningContext.Provider>
  );
});

Reasoning.displayName = 'Reasoning';

// --- ReasoningTrigger ---

type ReasoningTriggerProps = {
  className?: string;
};

const ReasoningTrigger = React.memo(function ReasoningTrigger({
  className,
}: ReasoningTriggerProps) {
  const { isStreaming, durationText } = useReasoningContext();
  const rotation = useSharedValue(0);

  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <Collapsible.Trigger asChild>
      <Pressable
        className={cn('flex-row items-center gap-2 py-2', className)}
        onPress={() => {
          // Collapsible handles open state; we just animate the chevron
        }}
      >
        {({ pressed }: { pressed: boolean }) => (
          <>
            <Animated.View style={animatedChevronStyle}>
              <Icon as={ChevronRightIcon} className="text-muted-foreground size-4" />
            </Animated.View>
            {isStreaming ? (
              <Shimmer>Thinking...</Shimmer>
            ) : (
              <Text className="text-muted-foreground text-sm">
                {durationText ?? 'Reasoning'}
              </Text>
            )}
          </>
        )}
      </Pressable>
    </Collapsible.Trigger>
  );
});

ReasoningTrigger.displayName = 'ReasoningTrigger';

// --- ReasoningContent ---

type ReasoningContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const ReasoningContent = React.memo(function ReasoningContent({
  children,
  className,
}: ReasoningContentProps) {
  return (
    <Collapsible.Content>
      <View className={cn('border-muted-foreground/20 border-l-2 pl-4 pt-1 pb-2', className)}>
        {typeof children === 'string' ? (
          <Text className="text-muted-foreground text-sm">{children}</Text>
        ) : (
          children
        )}
      </View>
    </Collapsible.Content>
  );
});

ReasoningContent.displayName = 'ReasoningContent';

export { Reasoning, ReasoningTrigger, ReasoningContent, useReasoningContext };
export type { ReasoningProps, ReasoningTriggerProps, ReasoningContentProps };
