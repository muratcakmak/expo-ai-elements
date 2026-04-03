import { cn } from '@/lib/utils';
import { MONO_STYLE } from '@/lib/fonts';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Shimmer } from '@/components/ai/shimmer';
import * as Collapsible from '@rn-primitives/collapsible';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  LoaderIcon,
  WrenchIcon,
  XCircleIcon,
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

type ToolStatus =
  | 'input-streaming'
  | 'input-available'
  | 'output-available'
  | 'output-error'
  | 'output-denied'
  | 'approval-requested'
  | 'approval-responded';

type ToolContextValue = {
  status: ToolStatus;
};

const ToolContext = React.createContext<ToolContextValue | null>(null);

function useToolContext() {
  const context = React.useContext(ToolContext);
  if (!context) {
    throw new Error('Tool sub-components must be used within <Tool>');
  }
  return context;
}

// --- Status helpers ---

const statusLabels: Record<ToolStatus, string> = {
  'approval-requested': 'Awaiting Approval',
  'approval-responded': 'Responded',
  'input-available': 'Running',
  'input-streaming': 'Pending',
  'output-available': 'Completed',
  'output-denied': 'Denied',
  'output-error': 'Error',
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
    case 'input-streaming':
      return <Icon as={CircleIcon} className="text-muted-foreground size-4" />;
    case 'input-available':
    case 'approval-requested':
      return <Icon as={ClockIcon} className="size-4 text-yellow-600" />;
    case 'approval-responded':
      return <Icon as={CheckCircleIcon} className="size-4 text-blue-600" />;
    case 'output-available':
      return <Icon as={CheckCircleIcon} className="size-4 text-green-600" />;
    case 'output-denied':
      return <Icon as={XCircleIcon} className="size-4 text-orange-600" />;
    case 'output-error':
      return <Icon as={XCircleIcon} className="size-4 text-red-600" />;
  }
}

// --- getStatusBadge ---

function getStatusBadge(status: ToolStatus) {
  return (
    <View className="bg-secondary flex-row items-center gap-1.5 rounded-full px-2.5 py-0.5">
      <StatusIcon status={status} />
      <Text className="text-secondary-foreground text-xs">{statusLabels[status]}</Text>
    </View>
  );
}

// --- Tool (root) ---

type ToolProps = {
  status?: ToolStatus;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const Tool = React.memo(function Tool({
  status = 'input-streaming',
  defaultOpen,
  open,
  onOpenChange,
  children,
  className,
}: ToolProps) {
  const contextValue = React.useMemo(() => ({ status }), [status]);

  return (
    <ToolContext.Provider value={contextValue}>
      <Collapsible.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        className={cn('rounded-md border', 'border-border', className)}
      >
        {children}
      </Collapsible.Root>
    </ToolContext.Provider>
  );
});

Tool.displayName = 'Tool';

// --- ToolHeader ---

type ToolHeaderProps = {
  title?: string;
  className?: string;
};

const ToolHeader = React.memo(function ToolHeader({ title, className }: ToolHeaderProps) {
  const { status } = useToolContext();
  const rotation = useSharedValue(0);

  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <Collapsible.Trigger asChild>
      <Pressable className={cn('flex-row items-center justify-between gap-4 p-3', className)}>
        <View className="flex-1 flex-row items-center gap-2">
          <Icon as={WrenchIcon} className="text-muted-foreground size-4" />
          <Text className="text-foreground text-sm font-medium">{title ?? 'Tool'}</Text>
          {getStatusBadge(status)}
        </View>
        <Animated.View style={animatedChevronStyle}>
          <Icon as={ChevronDownIcon} className="text-muted-foreground size-4" />
        </Animated.View>
      </Pressable>
    </Collapsible.Trigger>
  );
});

ToolHeader.displayName = 'ToolHeader';

// --- ToolContent ---

type ToolContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const ToolContent = React.memo(function ToolContent({ children, className }: ToolContentProps) {
  return (
    <Collapsible.Content>
      <View className={cn('gap-4 p-4', className)}>{children}</View>
    </Collapsible.Content>
  );
});

ToolContent.displayName = 'ToolContent';

// --- ToolInput ---

type ToolInputProps = {
  input: Record<string, unknown> | undefined;
  className?: string;
};

const ToolInput = React.memo(function ToolInput({ input, className }: ToolInputProps) {
  if (!input || Object.keys(input).length === 0) {
    return null;
  }

  return (
    <View className={cn('gap-2 overflow-hidden', className)}>
      <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        Parameters
      </Text>
      <View className="bg-muted/50 rounded-md p-3">
        <Text style={MONO_STYLE} className="text-muted-foreground text-xs">
          {JSON.stringify(input, null, 2)}
        </Text>
      </View>
    </View>
  );
});

ToolInput.displayName = 'ToolInput';

// --- ToolOutput ---

type ToolOutputProps = {
  output?: string | Record<string, unknown>;
  errorText?: string;
  className?: string;
};

const ToolOutput = React.memo(function ToolOutput({ output, errorText, className }: ToolOutputProps) {
  if (!output && !errorText) {
    return null;
  }

  const displayText =
    typeof output === 'object' ? JSON.stringify(output, null, 2) : output;

  return (
    <View className={cn('gap-2', className)}>
      <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {errorText ? 'Error' : 'Result'}
      </Text>
      <View
        className={cn(
          'overflow-hidden rounded-md p-3',
          errorText ? 'bg-destructive/10' : 'bg-muted/50'
        )}
      >
        {errorText ? (
          <Text style={MONO_STYLE} className="text-destructive text-xs">{errorText}</Text>
        ) : (
          <Text style={MONO_STYLE} className="text-foreground text-xs">{displayText}</Text>
        )}
      </View>
    </View>
  );
});

ToolOutput.displayName = 'ToolOutput';

export { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput, getStatusBadge, useToolContext };
export type { ToolProps, ToolHeaderProps, ToolContentProps, ToolInputProps, ToolOutputProps, ToolStatus };
