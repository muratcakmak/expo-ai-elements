import { cn } from '@/lib/utils';
import { MONO_STYLE } from '@/lib/fonts';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Collapsible from '@rn-primitives/collapsible';
import * as React from 'react';
import { Pressable, View } from 'react-native';

// --- Parsing ---

const STACK_FRAME_WITH_PARENS_REGEX = /^at\s+(.+?)\s+\((.+):(\d+):(\d+)\)$/;
const STACK_FRAME_WITHOUT_FN_REGEX = /^at\s+(.+):(\d+):(\d+)$/;
const ERROR_TYPE_REGEX = /^(\w+Error|Error):\s*(.*)$/;

type StackFrame = {
  raw: string;
  functionName: string | null;
  filePath: string | null;
  lineNumber: number | null;
  columnNumber: number | null;
  isInternal: boolean;
};

type ParsedStackTrace = {
  errorType: string | null;
  errorMessage: string;
  frames: StackFrame[];
  raw: string;
};

const parseStackFrame = (line: string): StackFrame => {
  const trimmed = line.trim();

  const withParensMatch = trimmed.match(STACK_FRAME_WITH_PARENS_REGEX);
  if (withParensMatch) {
    const [, functionName, filePath, lineNum, colNum] = withParensMatch;
    const isInternal =
      (filePath?.includes('node_modules') ?? false) ||
      (filePath?.startsWith('node:') ?? false) ||
      (filePath?.includes('internal/') ?? false);
    return {
      raw: trimmed,
      functionName: functionName ?? null,
      filePath: filePath ?? null,
      lineNumber: lineNum ? Number.parseInt(lineNum, 10) : null,
      columnNumber: colNum ? Number.parseInt(colNum, 10) : null,
      isInternal,
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
      raw: trimmed,
      functionName: null,
      filePath: filePath ?? null,
      lineNumber: lineNum ? Number.parseInt(lineNum, 10) : null,
      columnNumber: colNum ? Number.parseInt(colNum, 10) : null,
      isInternal,
    };
  }

  return {
    raw: trimmed,
    functionName: null,
    filePath: null,
    lineNumber: null,
    columnNumber: null,
    isInternal: trimmed.includes('node_modules') || trimmed.includes('node:'),
  };
};

const parseStackTrace = (trace: string): ParsedStackTrace => {
  const lines = trace.split('\n').filter((line) => line.trim());

  if (lines.length === 0) {
    return { errorType: null, errorMessage: trace, frames: [], raw: trace };
  }

  const firstLine = lines[0].trim();
  let errorType: string | null = null;
  let errorMessage = firstLine;

  const errorMatch = firstLine.match(ERROR_TYPE_REGEX);
  if (errorMatch) {
    const [, type, msg] = errorMatch;
    errorType = type ?? null;
    errorMessage = msg || '';
  }

  const frames = lines
    .slice(1)
    .filter((line) => line.trim().startsWith('at '))
    .map(parseStackFrame);

  return { errorType, errorMessage, frames, raw: trace };
};

// --- Context ---

type StackTraceContextValue = {
  trace: ParsedStackTrace;
  raw: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const StackTraceContext = React.createContext<StackTraceContextValue | null>(null);

function useStackTraceContext() {
  const context = React.useContext(StackTraceContext);
  if (!context) {
    throw new Error('StackTrace components must be used within StackTrace');
  }
  return context;
}

// --- StackTrace (Root) ---

type StackTraceProps = {
  trace: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
};

const StackTrace = React.memo(function StackTrace({
  trace,
  defaultOpen = false,
  children,
  className,
}: StackTraceProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const parsedTrace = React.useMemo(() => parseStackTrace(trace), [trace]);

  const contextValue = React.useMemo(
    () => ({ trace: parsedTrace, raw: trace, isOpen, setIsOpen }),
    [parsedTrace, trace, isOpen]
  );

  return (
    <StackTraceContext.Provider value={contextValue}>
      <View
        className={cn(
          'overflow-hidden rounded-lg border border-border bg-background font-mono',
          className
        )}
      >
        {children ?? (
          <>
            <StackTraceHeader>
              <StackTraceError>
                <StackTraceErrorType />
                <StackTraceErrorMessage />
              </StackTraceError>
              <StackTraceActions>
                <StackTraceCopyButton />
                <StackTraceExpandButton />
              </StackTraceActions>
            </StackTraceHeader>
            <StackTraceContent>
              <StackTraceFrames />
            </StackTraceContent>
          </>
        )}
      </View>
    </StackTraceContext.Provider>
  );
});

StackTrace.displayName = 'StackTrace';

// --- StackTraceHeader ---

type StackTraceHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

const StackTraceHeader = React.memo(function StackTraceHeader({
  children,
  className,
}: StackTraceHeaderProps) {
  const { isOpen, setIsOpen } = useStackTraceContext();

  return (
    <Pressable
      onPress={() => setIsOpen(!isOpen)}
      className={cn('flex-row items-center gap-3 p-3', className)}
    >
      {children}
    </Pressable>
  );
});

StackTraceHeader.displayName = 'StackTraceHeader';

// --- StackTraceError ---

type StackTraceErrorProps = {
  children?: React.ReactNode;
  className?: string;
};

const StackTraceError = React.memo(function StackTraceError({
  children,
  className,
}: StackTraceErrorProps) {
  return (
    <View className={cn('flex-1 flex-row items-center gap-2 overflow-hidden', className)}>
      <Icon as={AlertTriangleIcon} className="size-4 shrink-0 text-destructive" />
      {children}
    </View>
  );
});

StackTraceError.displayName = 'StackTraceError';

// --- StackTraceErrorType ---

type StackTraceErrorTypeProps = {
  children?: React.ReactNode;
  className?: string;
};

const StackTraceErrorType = React.memo(function StackTraceErrorType({
  children,
  className,
}: StackTraceErrorTypeProps) {
  const { trace } = useStackTraceContext();

  return (
    <Text className={cn('shrink-0 font-semibold text-destructive text-sm', className)}>
      {children ?? trace.errorType}
    </Text>
  );
});

StackTraceErrorType.displayName = 'StackTraceErrorType';

// --- StackTraceErrorMessage ---

type StackTraceErrorMessageProps = {
  children?: React.ReactNode;
  className?: string;
};

const StackTraceErrorMessage = React.memo(function StackTraceErrorMessage({
  children,
  className,
}: StackTraceErrorMessageProps) {
  const { trace } = useStackTraceContext();

  return (
    <Text className={cn('text-foreground text-sm', className)} numberOfLines={1}>
      {children ?? trace.errorMessage}
    </Text>
  );
});

StackTraceErrorMessage.displayName = 'StackTraceErrorMessage';

// --- StackTraceActions ---

type StackTraceActionsProps = {
  children?: React.ReactNode;
  className?: string;
};

const StackTraceActions = React.memo(function StackTraceActions({
  children,
  className,
}: StackTraceActionsProps) {
  return (
    <View className={cn('shrink-0 flex-row items-center gap-1', className)}>{children}</View>
  );
});

StackTraceActions.displayName = 'StackTraceActions';

// --- StackTraceCopyButton ---

type StackTraceCopyButtonProps = {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  className?: string;
};

const StackTraceCopyButton = React.memo(function StackTraceCopyButton({
  onCopy,
  onError,
  timeout = 2000,
  className,
}: StackTraceCopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { raw } = useStackTraceContext();

  const copyToClipboard = React.useCallback(async () => {
    try {
      await Clipboard.setStringAsync(raw);
      setIsCopied(true);
      onCopy?.();
      timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [raw, onCopy, onError, timeout]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={copyToClipboard}
      className={cn('h-7 w-7', className)}
    >
      <Icon
        as={isCopied ? CheckIcon : CopyIcon}
        className={cn('size-3.5', isCopied ? 'text-green-500' : 'text-muted-foreground')}
      />
    </Button>
  );
});

StackTraceCopyButton.displayName = 'StackTraceCopyButton';

// --- StackTraceExpandButton ---

type StackTraceExpandButtonProps = {
  className?: string;
};

const StackTraceExpandButton = React.memo(function StackTraceExpandButton({
  className,
}: StackTraceExpandButtonProps) {
  const { isOpen } = useStackTraceContext();

  return (
    <View className={cn('h-7 w-7 items-center justify-center', className)}>
      <Icon
        as={ChevronDownIcon}
        className={cn('size-4 text-muted-foreground', isOpen ? 'rotate-180' : 'rotate-0')}
      />
    </View>
  );
});

StackTraceExpandButton.displayName = 'StackTraceExpandButton';

// --- StackTraceContent ---

type StackTraceContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const StackTraceContent = React.memo(function StackTraceContent({
  children,
  className,
}: StackTraceContentProps) {
  const { isOpen } = useStackTraceContext();

  if (!isOpen) {
    return null;
  }

  return (
    <View className={cn('border-t border-border bg-muted/30', className)}>{children}</View>
  );
});

StackTraceContent.displayName = 'StackTraceContent';

// --- StackTraceFrames ---

type StackTraceFramesProps = {
  showInternalFrames?: boolean;
  className?: string;
};

const StackTraceFrames = React.memo(function StackTraceFrames({
  showInternalFrames = true,
  className,
}: StackTraceFramesProps) {
  const { trace } = useStackTraceContext();

  const framesToShow = showInternalFrames
    ? trace.frames
    : trace.frames.filter((f) => !f.isInternal);

  return (
    <View className={cn('gap-1 p-3', className)}>
      {framesToShow.map((frame) => (
        <View key={frame.raw} className="flex-row flex-wrap">
          <Text
            style={MONO_STYLE}
            className={cn(
              'text-xs',
              frame.isInternal ? 'text-muted-foreground/50' : 'text-muted-foreground'
            )}
          >
            at{' '}
          </Text>
          {frame.functionName && (
            <Text
              style={MONO_STYLE}
              className={cn(
                'text-xs',
                frame.isInternal ? 'text-muted-foreground/50' : 'text-foreground'
              )}
            >
              {frame.functionName}{' '}
            </Text>
          )}
          {frame.filePath && (
            <Text
              style={MONO_STYLE}
              className={cn(
                'text-xs',
                frame.isInternal ? 'text-muted-foreground/50' : 'text-muted-foreground'
              )}
            >
              ({frame.filePath}
              {frame.lineNumber !== null ? `:${frame.lineNumber}` : ''}
              {frame.columnNumber !== null ? `:${frame.columnNumber}` : ''})
            </Text>
          )}
        </View>
      ))}
      {framesToShow.length === 0 && (
        <Text className="text-muted-foreground text-xs">No stack frames</Text>
      )}
    </View>
  );
});

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
  useStackTraceContext,
};
export type {
  StackTraceProps,
  StackTraceHeaderProps,
  StackTraceErrorProps,
  StackTraceErrorTypeProps,
  StackTraceErrorMessageProps,
  StackTraceActionsProps,
  StackTraceCopyButtonProps,
  StackTraceExpandButtonProps,
  StackTraceContentProps,
  StackTraceFramesProps,
  StackFrame,
  ParsedStackTrace,
};
