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
  Pressable,
  ScrollView,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';

import { cn } from '../../utils/cn';

// Language selector types (Select import deferred to avoid @gorhom/bottom-sheet crash in Expo Go)
type SelectProps = any;
type SelectTriggerProps = any;
const Select = (props: any) => props.children;
const SelectTrigger = (props: any) => props.children;
const SelectContent = (props: any) => props.children;
const SelectItem = (props: any) => props.children;
const SelectValue = (props: any) => null;

/* --------------------------------- Context -------------------------------- */

interface CodeBlockContextType {
  code: string;
}

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: '',
});

/* ------------------------------- Container -------------------------------- */

type CodeBlockContainerProps = ViewProps & {
  className?: string;
  language?: string;
  children?: React.ReactNode;
};

const CodeBlockContainer = ({
  className,
  children,
  ...props
}: CodeBlockContainerProps) => (
  <View
    className={cn(
      'w-full overflow-hidden rounded-md border border-border bg-background',
      className,
    )}
    {...props}
  >
    {children}
  </View>
);

/* --------------------------------- Header --------------------------------- */

type CodeBlockHeaderProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CodeBlockHeader = ({
  className,
  children,
  ...props
}: CodeBlockHeaderProps) => (
  <View
    className={cn(
      'flex-row items-center justify-between border-b border-border bg-muted/80 px-3 py-2',
      className,
    )}
    {...props}
  >
    {children}
  </View>
);

/* ---------------------------------- Title --------------------------------- */

type CodeBlockTitleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CodeBlockTitle = ({
  className,
  children,
  ...props
}: CodeBlockTitleProps) => (
  <View
    className={cn('flex-row items-center gap-2', className)}
    {...props}
  >
    {children}
  </View>
);

/* -------------------------------- Filename -------------------------------- */

type CodeBlockFilenameProps = TextProps & {
  className?: string;
  children?: React.ReactNode;
};

const CodeBlockFilename = ({
  className,
  children,
  ...props
}: CodeBlockFilenameProps) => (
  <Text
    className={cn('font-mono text-xs text-muted-foreground', className)}
    {...props}
  >
    {children}
  </Text>
);

/* -------------------------------- Actions --------------------------------- */

type CodeBlockActionsProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CodeBlockActions = ({
  className,
  children,
  ...props
}: CodeBlockActionsProps) => (
  <View
    className={cn('flex-row items-center gap-2', className)}
    {...props}
  >
    {children}
  </View>
);

/* -------------------------------- Content --------------------------------- */

type CodeBlockContentProps = ViewProps & {
  className?: string;
  code: string;
  language?: string;
  showLineNumbers?: boolean;
};

const CodeBlockContent = ({
  className,
  code,
  showLineNumbers = false,
}: CodeBlockContentProps) => {
  const lines = useMemo(() => code.split('\n'), [code]);

  return (
    <ScrollView horizontal className={cn('overflow-auto', className)}>
      <View className="p-4">
        {lines.map((line, idx) => (
          <View key={`line-${idx}`} className="flex-row">
            {showLineNumbers && (
              <Text className="mr-4 w-8 text-right font-mono text-sm text-muted-foreground/50">
                {idx + 1}
              </Text>
            )}
            <Text className="font-mono text-sm text-foreground">
              {line || ' '}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

/* ------------------------------ Copy Button ------------------------------- */

type CodeBlockCopyButtonProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = useCallback(async () => {
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
      className={cn('h-8 w-8 items-center justify-center', className)}
      onPress={copyToClipboard}
      accessibilityRole="button"
      accessibilityLabel="Copy code"
      {...props}
    >
      {children ?? <Icon size={14} className="text-muted-foreground" />}
    </Pressable>
  );
};

/* ----------------------------- Language Selector -------------------------- */

type CodeBlockLanguageSelectorProps = SelectProps;

const CodeBlockLanguageSelector = (props: CodeBlockLanguageSelectorProps) => (
  <Select {...props} />
);

type CodeBlockLanguageSelectorTriggerProps = SelectTriggerProps & {
  className?: string;
};

const CodeBlockLanguageSelectorTrigger = ({
  className,
  ...props
}: CodeBlockLanguageSelectorTriggerProps) => (
  <SelectTrigger
    className={cn('h-7 border-0 bg-transparent px-2', className)}
    {...props}
  />
);

const CodeBlockLanguageSelectorValue = SelectValue;

const CodeBlockLanguageSelectorContent = SelectContent;

const CodeBlockLanguageSelectorItem = SelectItem;

/* ---------------------------------- Root ---------------------------------- */

type CodeBlockProps = ViewProps & {
  className?: string;
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  children?: React.ReactNode;
};

const CodeBlock = memo(
  ({
    code,
    language = 'text',
    showLineNumbers = false,
    className,
    children,
    ...props
  }: CodeBlockProps) => {
    const contextValue = useMemo(() => ({ code }), [code]);

    return (
      <CodeBlockContext.Provider value={contextValue}>
        <CodeBlockContainer className={className} language={language} {...props}>
          {children}
          <CodeBlockContent
            code={code}
            language={language}
            showLineNumbers={showLineNumbers}
          />
        </CodeBlockContainer>
      </CodeBlockContext.Provider>
    );
  },
);

CodeBlock.displayName = 'CodeBlock';

export {
  CodeBlock,
  CodeBlockContainer,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockFilename,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockLanguageSelector,
  CodeBlockLanguageSelectorTrigger,
  CodeBlockLanguageSelectorValue,
  CodeBlockLanguageSelectorContent,
  CodeBlockLanguageSelectorItem,
  CodeBlockContext,
  type CodeBlockProps,
  type CodeBlockContainerProps,
  type CodeBlockHeaderProps,
  type CodeBlockTitleProps,
  type CodeBlockFilenameProps,
  type CodeBlockActionsProps,
  type CodeBlockContentProps,
  type CodeBlockCopyButtonProps,
  type CodeBlockLanguageSelectorProps,
};
