import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, Text, type ViewProps, type ViewStyle, type PressableProps } from 'react-native';
import { ChevronDown, Brain } from 'lucide-react-native';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleProps,
  type CollapsibleContentProps,
} from '../../primitives/Collapsible';
import { Shimmer } from '../shimmer/Shimmer';

/* --------------------------------- Types ---------------------------------- */

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error('Reasoning components must be used within Reasoning');
  }
  return context;
};

/* ------------------------------ useControllableState ----------------------- */

/**
 * Lightweight controllable-state hook replacing @radix-ui/react-use-controllable-state.
 */
function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T;
  defaultProp: T;
  onChange?: (value: T) => void;
}): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternal(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}

/* -------------------------------- Constants ------------------------------- */

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

/* -------------------------------- Reasoning ------------------------------- */

export type ReasoningProps = CollapsibleProps & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    open,
    defaultOpen,
    onOpenChange,
    duration: durationProp,
    children,
    style,
    ...props
  }: ReasoningProps) => {
    const resolvedDefaultOpen = defaultOpen ?? isStreaming;
    // Track if defaultOpen was explicitly set to false (to prevent auto-open)
    const isExplicitlyClosed = defaultOpen === false;

    const [isOpen, setIsOpen] = useControllableState<boolean>({
      defaultProp: resolvedDefaultOpen,
      onChange: onOpenChange,
      prop: open,
    });
    const [duration, setDuration] = useControllableState<number | undefined>({
      defaultProp: undefined,
      prop: durationProp,
    });

    const hasEverStreamedRef = useRef(isStreaming);
    const [hasAutoClosed, setHasAutoClosed] = useState(false);
    const startTimeRef = useRef<number | null>(null);

    // Track when streaming starts and compute duration
    useEffect(() => {
      if (isStreaming) {
        hasEverStreamedRef.current = true;
        if (startTimeRef.current === null) {
          startTimeRef.current = Date.now();
        }
      } else if (startTimeRef.current !== null) {
        setDuration(Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S));
        startTimeRef.current = null;
      }
    }, [isStreaming, setDuration]);

    // Auto-open when streaming starts (unless explicitly closed)
    useEffect(() => {
      if (isStreaming && !isOpen && !isExplicitlyClosed) {
        setIsOpen(true);
      }
    }, [isStreaming, isOpen, setIsOpen, isExplicitlyClosed]);

    // Auto-close when streaming ends (once only, and only if it ever streamed)
    useEffect(() => {
      if (
        hasEverStreamedRef.current &&
        !isStreaming &&
        isOpen &&
        !hasAutoClosed
      ) {
        const timer = setTimeout(() => {
          setIsOpen(false);
          setHasAutoClosed(true);
        }, AUTO_CLOSE_DELAY);

        return () => clearTimeout(timer);
      }
    }, [isStreaming, isOpen, setIsOpen, hasAutoClosed]);

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        setIsOpen(newOpen);
      },
      [setIsOpen],
    );

    const contextValue = useMemo(
      () => ({ duration, isOpen, isStreaming, setIsOpen }),
      [duration, isOpen, isStreaming, setIsOpen],
    );

    return (
      <ReasoningContext.Provider value={contextValue}>
        <Collapsible
          style={[reasoningStyles.root, style as ViewStyle]}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </Collapsible>
      </ReasoningContext.Provider>
    );
  },
);

const reasoningStyles = StyleSheet.create({
  root: {
    marginBottom: 16,
  },
});

/* ----------------------------- ReasoningTrigger ---------------------------- */

export type ReasoningTriggerProps = PressableProps & {
  className?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
  getThinkingMessage?: (
    isStreaming: boolean,
    duration?: number,
  ) => React.ReactNode;
};

const DefaultThinkingMessage = ({
  isStreaming,
  duration,
}: {
  isStreaming: boolean;
  duration?: number;
}) => {
  if (isStreaming || duration === 0) {
    return <Shimmer duration={1}>Thinking...</Shimmer>;
  }
  if (duration === undefined) {
    return (
      <Text style={triggerStyles.thinkingText}>
        Thought for a few seconds
      </Text>
    );
  }
  return (
    <Text style={triggerStyles.thinkingText}>
      Thought for {duration} seconds
    </Text>
  );
};

export const ReasoningTrigger = memo(
  ({
    className,
    children,
    getThinkingMessage,
    style,
    ...props
  }: ReasoningTriggerProps) => {
    const { isStreaming, isOpen, duration } = useReasoning();

    return (
      <CollapsibleTrigger
        style={[triggerStyles.trigger, style]}
        {...props}
      >
        {children ?? (
          <>
            <Brain size={16} color="#6b7280" />
            {getThinkingMessage ? (
              getThinkingMessage(isStreaming, duration)
            ) : (
              <DefaultThinkingMessage
                isStreaming={isStreaming}
                duration={duration}
              />
            )}
            <View
              style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
            >
              <ChevronDown size={16} color="#6b7280" />
            </View>
          </>
        )}
      </CollapsibleTrigger>
    );
  },
);

const triggerStyles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  thinkingText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

/* ----------------------------- ReasoningContent ---------------------------- */

export type ReasoningContentProps = CollapsibleContentProps & {
  children: React.ReactNode;
};

export const ReasoningContent = memo(
  ({ className, children, style, ...props }: ReasoningContentProps) => (
    <CollapsibleContent style={[contentStyles.content, style]} {...props}>
      {children}
    </CollapsibleContent>
  ),
);

const contentStyles = StyleSheet.create({
  content: {
    marginTop: 16,
  },
});

Reasoning.displayName = 'Reasoning';
ReasoningTrigger.displayName = 'ReasoningTrigger';
ReasoningContent.displayName = 'ReasoningContent';
