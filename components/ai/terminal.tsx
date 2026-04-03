import { cn } from '@/lib/utils';
import { MONO_STYLE } from '@/lib/fonts';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon, TerminalIcon, Trash2Icon } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

// --- Context ---

type TerminalContextValue = {
  output: string;
  isStreaming: boolean;
  autoScroll: boolean;
  onClear?: () => void;
};

const TerminalContext = React.createContext<TerminalContextValue>({
  output: '',
  isStreaming: false,
  autoScroll: true,
});

function useTerminalContext() {
  return React.useContext(TerminalContext);
}

// --- Terminal (Root) ---

type TerminalProps = {
  output: string;
  isStreaming?: boolean;
  autoScroll?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
  className?: string;
};

const Terminal = React.memo(function Terminal({
  output,
  isStreaming = false,
  autoScroll = true,
  onClear,
  children,
  className,
}: TerminalProps) {
  const contextValue = React.useMemo(
    () => ({ output, isStreaming, autoScroll, onClear }),
    [output, isStreaming, autoScroll, onClear]
  );

  return (
    <TerminalContext.Provider value={contextValue}>
      <View
        className={cn(
          'overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950',
          className
        )}
      >
        {children ?? (
          <>
            <TerminalHeader>
              <TerminalTitle />
              <TerminalActions>
                <TerminalCopyButton />
                {onClear && <TerminalClearButton />}
              </TerminalActions>
            </TerminalHeader>
            <TerminalContent />
          </>
        )}
      </View>
    </TerminalContext.Provider>
  );
});

Terminal.displayName = 'Terminal';

// --- TerminalHeader ---

type TerminalHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

const TerminalHeader = React.memo(function TerminalHeader({
  children,
  className,
}: TerminalHeaderProps) {
  return (
    <View
      className={cn(
        'flex-row items-center justify-between border-b border-zinc-800 px-4 py-2',
        className
      )}
    >
      {children}
    </View>
  );
});

TerminalHeader.displayName = 'TerminalHeader';

// --- TerminalTitle ---

type TerminalTitleProps = {
  children?: React.ReactNode;
  className?: string;
};

const TerminalTitle = React.memo(function TerminalTitle({
  children,
  className,
}: TerminalTitleProps) {
  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      <Icon as={TerminalIcon} className="size-4 text-zinc-400" />
      <Text className="text-sm text-zinc-400">{children ?? 'Terminal'}</Text>
    </View>
  );
});

TerminalTitle.displayName = 'TerminalTitle';

// --- TerminalActions ---

type TerminalActionsProps = {
  children?: React.ReactNode;
  className?: string;
};

const TerminalActions = React.memo(function TerminalActions({
  children,
  className,
}: TerminalActionsProps) {
  return (
    <View className={cn('flex-row items-center gap-1', className)}>{children}</View>
  );
});

TerminalActions.displayName = 'TerminalActions';

// --- TerminalCopyButton ---

type TerminalCopyButtonProps = {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  className?: string;
};

const TerminalCopyButton = React.memo(function TerminalCopyButton({
  onCopy,
  onError,
  timeout = 2000,
  className,
}: TerminalCopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { output } = useTerminalContext();

  const copyToClipboard = React.useCallback(async () => {
    try {
      await Clipboard.setStringAsync(output);
      setIsCopied(true);
      onCopy?.();
      timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [output, onCopy, onError, timeout]);

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
      className={cn('h-7 w-7 shrink-0', className)}
    >
      <Icon
        as={isCopied ? CheckIcon : CopyIcon}
        className={cn('size-3.5', isCopied ? 'text-green-400' : 'text-zinc-400')}
      />
    </Button>
  );
});

TerminalCopyButton.displayName = 'TerminalCopyButton';

// --- TerminalClearButton ---

type TerminalClearButtonProps = {
  className?: string;
};

const TerminalClearButton = React.memo(function TerminalClearButton({
  className,
}: TerminalClearButtonProps) {
  const { onClear } = useTerminalContext();

  if (!onClear) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={onClear}
      className={cn('h-7 w-7 shrink-0', className)}
    >
      <Icon as={Trash2Icon} className="size-3.5 text-zinc-400" />
    </Button>
  );
});

TerminalClearButton.displayName = 'TerminalClearButton';

// --- TerminalContent ---

type TerminalContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const TerminalContent = React.memo(function TerminalContent({
  children,
  className,
}: TerminalContentProps) {
  const { output, isStreaming, autoScroll } = useTerminalContext();
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleContentSizeChange = React.useCallback(() => {
    if (autoScroll) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [autoScroll]);

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={handleContentSizeChange}
      className={cn('max-h-96 p-4', className)}
    >
      {children ?? (
        <View>
          <Text style={MONO_STYLE} className="text-sm leading-relaxed text-zinc-100">{output}</Text>
          {isStreaming && (
            <View className="ml-0.5 mt-1 h-4 w-2 bg-zinc-100 opacity-50" />
          )}
        </View>
      )}
    </ScrollView>
  );
});

TerminalContent.displayName = 'TerminalContent';

export {
  Terminal,
  TerminalHeader,
  TerminalTitle,
  TerminalActions,
  TerminalCopyButton,
  TerminalClearButton,
  TerminalContent,
  useTerminalContext,
};
export type {
  TerminalProps,
  TerminalHeaderProps,
  TerminalTitleProps,
  TerminalActionsProps,
  TerminalCopyButtonProps,
  TerminalClearButtonProps,
  TerminalContentProps,
};
