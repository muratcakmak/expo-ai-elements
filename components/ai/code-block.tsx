import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

// --- Context ---

type CodeBlockContextValue = {
  code: string;
};

const CodeBlockContext = React.createContext<CodeBlockContextValue>({
  code: '',
});

function useCodeBlockContext() {
  return React.useContext(CodeBlockContext);
}

// --- CodeBlock (Root) ---

type CodeBlockProps = {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  children?: React.ReactNode;
  className?: string;
};

const CodeBlock = React.memo(function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  children,
  className,
}: CodeBlockProps) {
  const contextValue = React.useMemo(() => ({ code }), [code]);

  return (
    <CodeBlockContext.Provider value={contextValue}>
      <View
        className={cn('overflow-hidden rounded-lg border border-border bg-background', className)}
      >
        {children ?? (
          <>
            <CodeBlockHeader>
              <CodeBlockTitle>{language ?? 'code'}</CodeBlockTitle>
              <CodeBlockCopyButton />
            </CodeBlockHeader>
            <CodeBlockContent code={code} showLineNumbers={showLineNumbers} />
          </>
        )}
      </View>
    </CodeBlockContext.Provider>
  );
});

CodeBlock.displayName = 'CodeBlock';

// --- CodeBlockHeader ---

type CodeBlockHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

const CodeBlockHeader = React.memo(function CodeBlockHeader({
  children,
  className,
}: CodeBlockHeaderProps) {
  return (
    <View
      className={cn(
        'flex-row items-center justify-between border-b border-border bg-muted/80 px-3 py-2',
        className
      )}
    >
      {children}
    </View>
  );
});

CodeBlockHeader.displayName = 'CodeBlockHeader';

// --- CodeBlockTitle ---

type CodeBlockTitleProps = {
  children?: React.ReactNode;
  className?: string;
};

const CodeBlockTitle = React.memo(function CodeBlockTitle({
  children,
  className,
}: CodeBlockTitleProps) {
  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      {typeof children === 'string' ? (
        <Text className="text-muted-foreground font-mono text-xs">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
});

CodeBlockTitle.displayName = 'CodeBlockTitle';

// --- CodeBlockCopyButton ---

type CodeBlockCopyButtonProps = {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  className?: string;
};

const CodeBlockCopyButton = React.memo(function CodeBlockCopyButton({
  onCopy,
  onError,
  timeout = 2000,
  className,
}: CodeBlockCopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { code } = useCodeBlockContext();

  const copyToClipboard = React.useCallback(async () => {
    try {
      if (!isCopied) {
        await Clipboard.setStringAsync(code);
        setIsCopied(true);
        onCopy?.();
        timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [code, onCopy, onError, timeout, isCopied]);

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
        className={cn('size-3.5', isCopied ? 'text-green-500' : 'text-muted-foreground')}
      />
    </Button>
  );
});

CodeBlockCopyButton.displayName = 'CodeBlockCopyButton';

// --- CodeBlockContent ---

type CodeBlockContentProps = {
  code: string;
  showLineNumbers?: boolean;
  className?: string;
};

const CodeBlockContent = React.memo(function CodeBlockContent({
  code,
  showLineNumbers = false,
  className,
}: CodeBlockContentProps) {
  const lines = React.useMemo(() => code.split('\n'), [code]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className={cn('flex-row px-3 py-3', className)}>
        {showLineNumbers && (
          <View className="mr-3 items-end">
            {lines.map((_, index) => (
              <Text
                key={`ln-${index}`}
                className="text-muted-foreground/50 font-mono text-xs leading-5"
              >
                {String(index + 1)}
              </Text>
            ))}
          </View>
        )}
        <View>
          {lines.map((line, index) => (
            <Text key={`code-${index}`} className="text-foreground font-mono text-xs leading-5">
              {line || ' '}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
});

CodeBlockContent.displayName = 'CodeBlockContent';

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockCopyButton,
  CodeBlockContent,
  useCodeBlockContext,
};
export type {
  CodeBlockProps,
  CodeBlockHeaderProps,
  CodeBlockTitleProps,
  CodeBlockCopyButtonProps,
  CodeBlockContentProps,
};
