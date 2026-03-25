import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type PressableProps,
  type ViewProps,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy, Terminal as TerminalIcon, Trash2 } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { parseAnsi, type AnsiSegment } from '../../utils/ansi-parser';

/* --------------------------------- Context -------------------------------- */

interface TerminalContextType {
  output: string;
  isStreaming: boolean;
  autoScroll: boolean;
  onClear?: () => void;
}

const TerminalContext = createContext<TerminalContextType>({
  autoScroll: true,
  isStreaming: false,
  output: '',
});

/* --------------------------------- Header --------------------------------- */

type TerminalHeaderProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TerminalHeader = ({
  className,
  children,
  ...props
}: TerminalHeaderProps) => (
  <View
    className={cn(
      'flex-row items-center justify-between border-b border-zinc-800 px-4 py-2',
      className,
    )}
    {...props}
  >
    {children}
  </View>
);

/* ---------------------------------- Title --------------------------------- */

type TerminalTitleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TerminalTitle = ({
  className,
  children,
  ...props
}: TerminalTitleProps) => (
  <View
    className={cn('flex-row items-center gap-2', className)}
    {...props}
  >
    <TerminalIcon size={16} className="text-zinc-400" />
    <Text className="text-sm text-zinc-400">{children ?? 'Terminal'}</Text>
  </View>
);

/* --------------------------------- Status --------------------------------- */

type TerminalStatusProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TerminalStatus = ({
  className,
  children,
  ...props
}: TerminalStatusProps) => {
  const { isStreaming } = useContext(TerminalContext);

  if (!isStreaming) {
    return null;
  }

  return (
    <View
      className={cn('flex-row items-center gap-2', className)}
      {...props}
    >
      <Text className="text-xs text-zinc-400">{children}</Text>
    </View>
  );
};

/* -------------------------------- Actions --------------------------------- */

type TerminalActionsProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TerminalActions = ({
  className,
  children,
  ...props
}: TerminalActionsProps) => (
  <View className={cn('flex-row items-center gap-1', className)} {...props}>
    {children}
  </View>
);

/* ------------------------------ Copy Button ------------------------------- */

type TerminalCopyButtonProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

const TerminalCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: TerminalCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { output } = useContext(TerminalContext);

  const copyToClipboard = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(output);
      setIsCopied(true);
      onCopy?.();
      timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [output, onCopy, onError, timeout]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const Icon = isCopied ? Check : Copy;

  return (
    <Pressable
      className={cn('h-7 w-7 items-center justify-center', className)}
      onPress={copyToClipboard}
      accessibilityRole="button"
      accessibilityLabel="Copy output"
      {...props}
    >
      {children ?? <Icon size={14} className="text-zinc-400" />}
    </Pressable>
  );
};

/* ----------------------------- Clear Button ------------------------------- */

type TerminalClearButtonProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

const TerminalClearButton = ({
  children,
  className,
  ...props
}: TerminalClearButtonProps) => {
  const { onClear } = useContext(TerminalContext);

  if (!onClear) {
    return null;
  }

  return (
    <Pressable
      className={cn('h-7 w-7 items-center justify-center', className)}
      onPress={onClear}
      accessibilityRole="button"
      accessibilityLabel="Clear terminal"
      {...props}
    >
      {children ?? <Trash2 size={14} className="text-zinc-400" />}
    </Pressable>
  );
};

/* ------------------------------- ANSI Text -------------------------------- */

const AnsiText = ({ segments }: { segments: AnsiSegment[] }) => (
  <Text>
    {segments.map((segment, idx) => (
      <Text
        key={`seg-${idx}`}
        style={{
          color: segment.color,
          backgroundColor: segment.bgColor,
          fontWeight: segment.bold ? 'bold' : undefined,
          fontStyle: segment.italic ? 'italic' : undefined,
          textDecorationLine: segment.underline ? 'underline' : undefined,
          opacity: segment.dim ? 0.5 : undefined,
        }}
      >
        {segment.text}
      </Text>
    ))}
  </Text>
);

/* -------------------------------- Content --------------------------------- */

type TerminalContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TerminalContent = ({
  className,
  children,
  ...props
}: TerminalContentProps) => {
  const { output, isStreaming } = useContext(TerminalContext);
  const scrollViewRef = useRef<ScrollView>(null);
  const segments = useMemo(() => parseAnsi(output), [output]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [output]);

  return (
    <ScrollView
      ref={scrollViewRef}
      className={cn('max-h-96 p-4', className)}
      {...props}
    >
      {children ?? (
        <View>
          <Text className="font-mono text-sm leading-relaxed text-zinc-100">
            <AnsiText segments={segments} />
          </Text>
          {isStreaming && (
            <View className="ml-0.5 h-4 w-2 bg-zinc-100 opacity-50" />
          )}
        </View>
      )}
    </ScrollView>
  );
};

/* ---------------------------------- Root ---------------------------------- */

type TerminalProps = ViewProps & {
  className?: string;
  output: string;
  isStreaming?: boolean;
  autoScroll?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
};

const Terminal = ({
  output,
  isStreaming = false,
  autoScroll = true,
  onClear,
  className,
  children,
  ...props
}: TerminalProps) => {
  const contextValue = useMemo(
    () => ({ autoScroll, isStreaming, onClear, output }),
    [autoScroll, isStreaming, onClear, output],
  );

  return (
    <TerminalContext.Provider value={contextValue}>
      <View
        className={cn(
          'overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <TerminalHeader>
              <TerminalTitle />
              <View className="flex-row items-center gap-1">
                <TerminalStatus />
                <TerminalActions>
                  <TerminalCopyButton />
                  {onClear ? <TerminalClearButton /> : null}
                </TerminalActions>
              </View>
            </TerminalHeader>
            <TerminalContent />
          </>
        )}
      </View>
    </TerminalContext.Provider>
  );
};

export {
  Terminal,
  TerminalHeader,
  TerminalTitle,
  TerminalStatus,
  TerminalActions,
  TerminalCopyButton,
  TerminalClearButton,
  TerminalContent,
  TerminalContext,
  type TerminalProps,
  type TerminalHeaderProps,
  type TerminalTitleProps,
  type TerminalStatusProps,
  type TerminalActionsProps,
  type TerminalCopyButtonProps,
  type TerminalClearButtonProps,
  type TerminalContentProps,
};
