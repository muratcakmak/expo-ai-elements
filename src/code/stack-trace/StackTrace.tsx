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
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  type PressableProps,
  type ViewProps,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
} from 'lucide-react-native';

import { cn } from '../../utils/cn';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';

/* ------------------------------ Parsing Logic ----------------------------- */

const STACK_FRAME_WITH_PARENS_REGEX = /^at\s+(.+?)\s+\((.+):(\d+):(\d+)\)$/;
const STACK_FRAME_WITHOUT_FN_REGEX = /^at\s+(.+):(\d+):(\d+)$/;
const ERROR_TYPE_REGEX = /^(\w+Error|Error):\s*(.*)$/;
const AT_PREFIX_REGEX = /^at\s+/;

interface StackFrame {
  raw: string;
  functionName: string | null;
  filePath: string | null;
  lineNumber: number | null;
  columnNumber: number | null;
  isInternal: boolean;
}

interface ParsedStackTrace {
  errorType: string | null;
  errorMessage: string;
  frames: StackFrame[];
  raw: string;
}

const parseStackFrame = (line: string): StackFrame => {
  const trimmed = line.trim();

  const withParensMatch = trimmed.match(STACK_FRAME_WITH_PARENS_REGEX);
  if (withParensMatch) {
    const [, functionName, filePath, lineNum, colNum] = withParensMatch;
    const isInternal =
      filePath.includes('node_modules') ||
      filePath.startsWith('node:') ||
      filePath.includes('internal/');
    return {
      columnNumber: colNum ? Number.parseInt(colNum, 10) : null,
      filePath: filePath ?? null,
      functionName: functionName ?? null,
      isInternal,
      lineNumber: lineNum ? Number.parseInt(lineNum, 10) : null,
      raw: trimmed,
    };
  }

  const withoutFnMatch = trimmed.match(STACK_FRAME_WITHOUT_FN_REGEX);
  if (withoutFnMatch) {
    const [, filePath, lineNum, colNum] = withoutFnMatch;
    const isInternal =
      (filePath?.includes('node_modules') ?? false) ||
      (filePath?.startsWith('node:') ?? false) ||
      (filePath?.includes('internal/') ?? false);
    return {
      columnNumber: colNum ? Number.parseInt(colNum, 10) : null,
      filePath: filePath ?? null,
      functionName: null,
      isInternal,
      lineNumber: lineNum ? Number.parseInt(lineNum, 10) : null,
      raw: trimmed,
    };
  }

  return {
    columnNumber: null,
    filePath: null,
    functionName: null,
    isInternal: trimmed.includes('node_modules') || trimmed.includes('node:'),
    lineNumber: null,
    raw: trimmed,
  };
};

const parseStackTrace = (trace: string): ParsedStackTrace => {
  const lines = trace.split('\n').filter((line) => line.trim());

  if (lines.length === 0) {
    return { errorMessage: trace, errorType: null, frames: [], raw: trace };
  }

  const firstLine = lines[0].trim();
  let errorType: string | null = null;
  let errorMessage = firstLine;

  const errorMatch = firstLine.match(ERROR_TYPE_REGEX);
  if (errorMatch) {
    const [, type, msg] = errorMatch;
    errorType = type;
    errorMessage = msg || '';
  }

  const frames = lines
    .slice(1)
    .filter((line) => line.trim().startsWith('at '))
    .map(parseStackFrame);

  return { errorMessage, errorType, frames, raw: trace };
};

/* --------------------------------- Context -------------------------------- */

interface StackTraceContextValue {
  trace: ParsedStackTrace;
  raw: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onFilePathClick?: (filePath: string, line?: number, column?: number) => void;
}

const StackTraceContext = createContext<StackTraceContextValue | null>(null);

const useStackTrace = () => {
  const context = useContext(StackTraceContext);
  if (!context) {
    throw new Error('StackTrace components must be used within StackTrace');
  }
  return context;
};

/* ---------------------------------- Root ---------------------------------- */

type StackTraceProps = ViewProps & {
  className?: string;
  trace: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFilePathClick?: (filePath: string, line?: number, column?: number) => void;
  children?: React.ReactNode;
};

const StackTrace = memo(
  ({
    trace,
    className,
    open,
    defaultOpen = false,
    onOpenChange,
    onFilePathClick,
    children,
    ...props
  }: StackTraceProps) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = open ?? internalOpen;

    const setIsOpen = useCallback(
      (nextOpen: boolean) => {
        setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
      },
      [onOpenChange],
    );

    const parsedTrace = useMemo(() => parseStackTrace(trace), [trace]);

    const contextValue = useMemo(
      () => ({
        isOpen,
        onFilePathClick,
        raw: trace,
        setIsOpen,
        trace: parsedTrace,
      }),
      [parsedTrace, trace, isOpen, setIsOpen, onFilePathClick],
    );

    return (
      <StackTraceContext.Provider value={contextValue}>
        <View
          className={cn(
            'w-full overflow-hidden rounded-lg border border-border bg-background',
            className,
          )}
          {...props}
        >
          {children}
        </View>
      </StackTraceContext.Provider>
    );
  },
);

StackTrace.displayName = 'StackTrace';

/* --------------------------------- Header --------------------------------- */

type StackTraceHeaderProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

const StackTraceHeader = memo(
  ({ className, children, ...props }: StackTraceHeaderProps) => {
    const { isOpen, setIsOpen } = useStackTrace();

    return (
      <Pressable
        className={cn(
          'flex-row w-full items-center gap-3 p-3',
          className,
        )}
        onPress={() => setIsOpen(!isOpen)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        {...props}
      >
        {children}
      </Pressable>
    );
  },
);

StackTraceHeader.displayName = 'StackTraceHeader';

/* --------------------------------- Error ---------------------------------- */

type StackTraceErrorProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const StackTraceError = memo(
  ({ className, children, ...props }: StackTraceErrorProps) => (
    <View
      className={cn('flex-1 flex-row items-center gap-2 overflow-hidden', className)}
      {...props}
    >
      <AlertTriangle size={16} className="shrink-0 text-destructive" />
      {children}
    </View>
  ),
);

StackTraceError.displayName = 'StackTraceError';

/* -------------------------------- ErrorType ------------------------------- */

type StackTraceErrorTypeProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const StackTraceErrorType = memo(
  ({ className, children, ...props }: StackTraceErrorTypeProps) => {
    const { trace } = useStackTrace();

    return (
      <View className={cn(className)} {...props}>
        <Text className="shrink-0 font-semibold text-destructive">
          {children ?? trace.errorType}
        </Text>
      </View>
    );
  },
);

StackTraceErrorType.displayName = 'StackTraceErrorType';

/* ----------------------------- ErrorMessage ------------------------------- */

type StackTraceErrorMessageProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const StackTraceErrorMessage = memo(
  ({ className, children, ...props }: StackTraceErrorMessageProps) => {
    const { trace } = useStackTrace();

    return (
      <View className={cn(className)} {...props}>
        <Text className="text-foreground" numberOfLines={1}>
          {children ?? trace.errorMessage}
        </Text>
      </View>
    );
  },
);

StackTraceErrorMessage.displayName = 'StackTraceErrorMessage';

/* -------------------------------- Actions --------------------------------- */

type StackTraceActionsProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const StackTraceActions = memo(
  ({ className, children, ...props }: StackTraceActionsProps) => (
    <View
      className={cn('shrink-0 flex-row items-center gap-1', className)}
      {...props}
    >
      {children}
    </View>
  ),
);

StackTraceActions.displayName = 'StackTraceActions';

/* ------------------------------ Copy Button ------------------------------- */

type StackTraceCopyButtonProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

const StackTraceCopyButton = memo(
  ({
    onCopy,
    onError,
    timeout = 2000,
    className,
    children,
    ...props
  }: StackTraceCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { raw } = useStackTrace();

    const copyToClipboard = useCallback(async () => {
      try {
        await Clipboard.setStringAsync(raw);
        setIsCopied(true);
        onCopy?.();
        timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
      } catch (error) {
        onError?.(error as Error);
      }
    }, [raw, onCopy, onError, timeout]);

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
        accessibilityLabel="Copy stack trace"
        {...props}
      >
        {children ?? <Icon size={14} className="text-muted-foreground" />}
      </Pressable>
    );
  },
);

StackTraceCopyButton.displayName = 'StackTraceCopyButton';

/* ----------------------------- Expand Button ------------------------------ */

type StackTraceExpandButtonProps = ViewProps & {
  className?: string;
};

const StackTraceExpandButton = memo(
  ({ className, ...props }: StackTraceExpandButtonProps) => {
    const { isOpen } = useStackTrace();

    return (
      <View
        className={cn('h-7 w-7 items-center justify-center', className)}
        {...props}
      >
        <ChevronDown
          size={16}
          className="text-muted-foreground"
          style={isOpen ? { transform: [{ rotate: '180deg' }] } : undefined}
        />
      </View>
    );
  },
);

StackTraceExpandButton.displayName = 'StackTraceExpandButton';

/* -------------------------------- Content --------------------------------- */

type StackTraceContentProps = ViewProps & {
  className?: string;
  maxHeight?: number;
  children?: React.ReactNode;
};

const StackTraceContent = memo(
  ({
    className,
    maxHeight = 400,
    children,
    ...props
  }: StackTraceContentProps) => {
    const { isOpen } = useStackTrace();

    return (
      <Collapsible open={isOpen}>
        <CollapsibleContent
          className={cn('border-t border-border bg-muted/30', className)}
          {...props}
        >
          <ScrollView style={{ maxHeight }}>
            {children}
          </ScrollView>
        </CollapsibleContent>
      </Collapsible>
    );
  },
);

StackTraceContent.displayName = 'StackTraceContent';

/* --------------------------------- Frames --------------------------------- */

type StackTraceFramesProps = ViewProps & {
  className?: string;
  showInternalFrames?: boolean;
};

const StackTraceFrames = memo(
  ({
    className,
    showInternalFrames = true,
    ...props
  }: StackTraceFramesProps) => {
    const { trace, onFilePathClick } = useStackTrace();

    const framesToShow = showInternalFrames
      ? trace.frames
      : trace.frames.filter((f) => !f.isInternal);

    return (
      <View className={cn('gap-1 p-3', className)} {...props}>
        {framesToShow.map((frame) => (
          <View
            className={cn(
              'flex-row flex-wrap',
              frame.isInternal
                ? 'opacity-40'
                : 'opacity-90',
            )}
            key={frame.raw}
          >
            <Text className="font-mono text-xs text-muted-foreground">at </Text>
            {frame.functionName ? (
              <Text className="font-mono text-xs text-foreground">
                {frame.functionName}{' '}
              </Text>
            ) : null}
            {frame.filePath ? (
              <Pressable
                onPress={() => {
                  if (frame.filePath) {
                    onFilePathClick?.(
                      frame.filePath,
                      frame.lineNumber ?? undefined,
                      frame.columnNumber ?? undefined,
                    );
                  }
                }}
              >
                <Text className="font-mono text-xs text-muted-foreground">
                  ({frame.filePath}
                  {frame.lineNumber !== null ? `:${frame.lineNumber}` : ''}
                  {frame.columnNumber !== null ? `:${frame.columnNumber}` : ''})
                </Text>
              </Pressable>
            ) : null}
            {!(frame.filePath || frame.functionName) ? (
              <Text className="font-mono text-xs text-foreground">
                {frame.raw.replace(AT_PREFIX_REGEX, '')}
              </Text>
            ) : null}
          </View>
        ))}
        {framesToShow.length === 0 && (
          <Text className="font-mono text-xs text-muted-foreground">
            No stack frames
          </Text>
        )}
      </View>
    );
  },
);

StackTraceFrames.displayName = 'StackTraceFrames';

export {
  StackTrace,
  StackTraceHeader,
  StackTraceError,
  StackTraceErrorType,
  StackTraceErrorMessage,
  StackTraceActions,
  StackTraceCopyButton,
  StackTraceExpandButton,
  StackTraceContent,
  StackTraceFrames,
  type StackTraceProps,
  type StackTraceHeaderProps,
  type StackTraceErrorProps,
  type StackTraceErrorTypeProps,
  type StackTraceErrorMessageProps,
  type StackTraceActionsProps,
  type StackTraceCopyButtonProps,
  type StackTraceExpandButtonProps,
  type StackTraceContentProps,
  type StackTraceFramesProps,
};
