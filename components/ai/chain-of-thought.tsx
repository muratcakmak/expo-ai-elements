import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Collapsible from '@rn-primitives/collapsible';
import { BrainIcon, ChevronDownIcon, CircleIcon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// --- Context ---

type ChainOfThoughtContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const ChainOfThoughtContext = React.createContext<ChainOfThoughtContextValue | null>(null);

function useChainOfThought() {
  const context = React.useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error('ChainOfThought sub-components must be used within <ChainOfThought>');
  }
  return context;
}

// --- ChainOfThought (root) ---

type ChainOfThoughtProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const ChainOfThought = React.memo(function ChainOfThought({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: ChainOfThoughtProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setIsOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const contextValue = React.useMemo(
    () => ({ isOpen, setIsOpen }),
    [isOpen, setIsOpen]
  );

  return (
    <ChainOfThoughtContext.Provider value={contextValue}>
      <View className={cn('gap-4', className)}>{children}</View>
    </ChainOfThoughtContext.Provider>
  );
});

ChainOfThought.displayName = 'ChainOfThought';

// --- ChainOfThoughtHeader ---

type ChainOfThoughtHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

const ChainOfThoughtHeader = React.memo(function ChainOfThoughtHeader({
  children,
  className,
}: ChainOfThoughtHeaderProps) {
  const { isOpen, setIsOpen } = useChainOfThought();

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <Collapsible.Trigger asChild>
        <Pressable
          className={cn(
            'flex-row items-center gap-2',
            className
          )}
        >
          <Icon as={BrainIcon} className="text-muted-foreground size-4" />
          <Text className="text-muted-foreground flex-1 text-sm">
            {typeof children === 'string' ? children : children ?? 'Chain of Thought'}
          </Text>
          <Icon
            as={ChevronDownIcon}
            className={cn('text-muted-foreground size-4', isOpen && 'rotate-180')}
          />
        </Pressable>
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
});

ChainOfThoughtHeader.displayName = 'ChainOfThoughtHeader';

// --- ChainOfThoughtStep ---

type ChainOfThoughtStepStatus = 'complete' | 'active' | 'pending';

type ChainOfThoughtStepProps = {
  icon?: LucideIcon;
  label: string;
  description?: string;
  status?: ChainOfThoughtStepStatus;
  children?: React.ReactNode;
  className?: string;
};

const stepStatusStyles: Record<ChainOfThoughtStepStatus, string> = {
  active: 'text-foreground',
  complete: 'text-muted-foreground',
  pending: 'text-muted-foreground/50',
};

const ActivePulse = React.memo(function ActivePulse({
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

ActivePulse.displayName = 'ActivePulse';

const ChainOfThoughtStep = React.memo(function ChainOfThoughtStep({
  icon: IconComponent = CircleIcon,
  label,
  description,
  status = 'complete',
  children,
  className,
}: ChainOfThoughtStepProps) {
  const stepIcon = <Icon as={IconComponent} className="size-4" />;

  return (
    <View className={cn('flex-row gap-2', stepStatusStyles[status], className)}>
      <View className="relative mt-0.5">
        {status === 'active' ? <ActivePulse>{stepIcon}</ActivePulse> : stepIcon}
        <View className="bg-border absolute top-7 bottom-0 left-1/2 w-px -translate-x-px" />
      </View>
      <View className="flex-1 gap-2 overflow-hidden">
        <Text className={cn('text-sm', stepStatusStyles[status])}>{label}</Text>
        {description ? (
          <Text className="text-muted-foreground text-xs">{description}</Text>
        ) : null}
        {children}
      </View>
    </View>
  );
});

ChainOfThoughtStep.displayName = 'ChainOfThoughtStep';

// --- ChainOfThoughtSearchResults ---

type ChainOfThoughtSearchResultsProps = {
  children?: React.ReactNode;
  className?: string;
};

const ChainOfThoughtSearchResults = React.memo(function ChainOfThoughtSearchResults({
  children,
  className,
}: ChainOfThoughtSearchResultsProps) {
  return (
    <View className={cn('flex-row flex-wrap items-center gap-2', className)}>
      {children}
    </View>
  );
});

ChainOfThoughtSearchResults.displayName = 'ChainOfThoughtSearchResults';

// --- ChainOfThoughtSearchResult ---

type ChainOfThoughtSearchResultProps = {
  children?: React.ReactNode;
  className?: string;
};

const ChainOfThoughtSearchResult = React.memo(function ChainOfThoughtSearchResult({
  children,
  className,
}: ChainOfThoughtSearchResultProps) {
  return (
    <View
      className={cn(
        'bg-secondary flex-row items-center gap-1 rounded-full px-2 py-0.5',
        className
      )}
    >
      {typeof children === 'string' ? (
        <Text className="text-secondary-foreground text-xs">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
});

ChainOfThoughtSearchResult.displayName = 'ChainOfThoughtSearchResult';

// --- ChainOfThoughtContent ---

type ChainOfThoughtContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const ChainOfThoughtContent = React.memo(function ChainOfThoughtContent({
  children,
  className,
}: ChainOfThoughtContentProps) {
  const { isOpen } = useChainOfThought();

  return (
    <Collapsible.Root open={isOpen}>
      <Collapsible.Content>
        <View className={cn('mt-2 gap-3', className)}>{children}</View>
      </Collapsible.Content>
    </Collapsible.Root>
  );
});

ChainOfThoughtContent.displayName = 'ChainOfThoughtContent';

export {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
  ChainOfThoughtContent,
  useChainOfThought,
};
export type {
  ChainOfThoughtProps,
  ChainOfThoughtHeaderProps,
  ChainOfThoughtStepProps,
  ChainOfThoughtStepStatus,
  ChainOfThoughtSearchResultsProps,
  ChainOfThoughtSearchResultProps,
  ChainOfThoughtContentProps,
};
