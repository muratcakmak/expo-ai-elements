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
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';

import { cn } from '../../utils/cn';

/* --------------------------------- Context -------------------------------- */

interface SnippetContextType {
  code: string;
}

const SnippetContext = createContext<SnippetContextType>({
  code: '',
});

/* ---------------------------------- Root ---------------------------------- */

type SnippetProps = ViewProps & {
  className?: string;
  code: string;
  children?: React.ReactNode;
};

const Snippet = ({
  code,
  className,
  children,
  ...props
}: SnippetProps) => {
  const contextValue = useMemo(() => ({ code }), [code]);

  return (
    <SnippetContext.Provider value={contextValue}>
      <View
        className={cn(
          'flex-row items-center rounded-md border border-border bg-muted px-3 py-2',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <SnippetText />
            <SnippetCopyButton />
          </>
        )}
      </View>
    </SnippetContext.Provider>
  );
};

/* ---------------------------------- Text ---------------------------------- */

type SnippetTextProps = TextProps & {
  className?: string;
  children?: React.ReactNode;
};

const SnippetText = ({ className, children, ...props }: SnippetTextProps) => {
  const { code } = useContext(SnippetContext);

  return (
    <Text
      className={cn('flex-1 font-mono text-sm text-foreground', className)}
      numberOfLines={1}
      {...props}
    >
      {children ?? code}
    </Text>
  );
};

/* ---------------------------------- Addon --------------------------------- */

type SnippetAddonProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SnippetAddon = ({ className, children, ...props }: SnippetAddonProps) => (
  <View className={cn('mr-2', className)} {...props}>
    {children}
  </View>
);

/* ------------------------------ Copy Button ------------------------------- */

type SnippetCopyButtonProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

const SnippetCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: SnippetCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { code } = useContext(SnippetContext);

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
      className={cn('ml-2 h-7 w-7 items-center justify-center', className)}
      onPress={copyToClipboard}
      accessibilityRole="button"
      accessibilityLabel="Copy"
      {...props}
    >
      {children ?? <Icon size={14} className="text-muted-foreground" />}
    </Pressable>
  );
};

export {
  Snippet,
  SnippetText,
  SnippetAddon,
  SnippetCopyButton,
  SnippetContext,
  type SnippetProps,
  type SnippetTextProps,
  type SnippetAddonProps,
  type SnippetCopyButtonProps,
};
