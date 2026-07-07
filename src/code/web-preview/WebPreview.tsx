import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { ChevronDown, RefreshCw } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';

/* --------------------------------- Context -------------------------------- */

interface WebPreviewContextValue {
  url: string;
  setUrl: (url: string) => void;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
}

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null);

const useWebPreview = () => {
  const context = useContext(WebPreviewContext);
  if (!context) {
    throw new Error('WebPreview components must be used within a WebPreview');
  }
  return context;
};

/* ---------------------------------- Root ---------------------------------- */

type WebPreviewProps = ViewProps & {
  className?: string;
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
  children?: React.ReactNode;
};

const WebPreview = ({
  className,
  children,
  defaultUrl = '',
  onUrlChange,
  ...props
}: WebPreviewProps) => {
  const [url, setUrlState] = useState(defaultUrl);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const setUrl = useCallback(
    (newUrl: string) => {
      setUrlState(newUrl);
      onUrlChange?.(newUrl);
    },
    [onUrlChange],
  );

  const contextValue = useMemo<WebPreviewContextValue>(
    () => ({
      consoleOpen,
      setConsoleOpen,
      setUrl,
      url,
    }),
    [consoleOpen, setUrl, url],
  );

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <View
        className={cn(
          'overflow-hidden rounded-lg border border-border bg-card',
          className,
        )}
        {...props}
      >
        {children}
      </View>
    </WebPreviewContext.Provider>
  );
};

/* ------------------------------- Navigation ------------------------------- */

type WebPreviewNavigationProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const WebPreviewNavigation = ({
  className,
  children,
  ...props
}: WebPreviewNavigationProps) => (
  <View
    className={cn('flex-row items-center gap-1 border-b border-border p-2', className)}
    {...props}
  >
    {children}
  </View>
);

/* ----------------------------- Navigation Button -------------------------- */

type WebPreviewNavigationButtonProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
  tooltip?: string;
};

const WebPreviewNavigationButton = ({
  children,
  className,
  ...props
}: WebPreviewNavigationButtonProps) => (
  <Pressable
    className={cn('h-8 w-8 items-center justify-center', className)}
    accessibilityRole="button"
    {...props}
  >
    {children}
  </Pressable>
);

/* ---------------------------------- URL ----------------------------------- */

type WebPreviewUrlProps = TextInputProps & {
  className?: string;
};

const WebPreviewUrl = ({
  className,
  onChangeText,
  onSubmitEditing,
  ...props
}: WebPreviewUrlProps) => {
  const { url, setUrl } = useWebPreview();
  const [inputValue, setInputValue] = useState(url);

  const handleChangeText = useCallback(
    (text: string) => {
      setInputValue(text);
      onChangeText?.(text);
    },
    [onChangeText],
  );

  const handleSubmit = useCallback(() => {
    setUrl(inputValue);
  }, [setUrl, inputValue]);

  return (
    <TextInput
      className={cn(
        'h-8 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground',
        className,
      )}
      value={inputValue}
      onChangeText={handleChangeText}
      onSubmitEditing={handleSubmit}
      placeholder="Enter URL..."
      placeholderTextColor="#9ca3af"
      autoCapitalize="none"
      autoCorrect={false}
      keyboardType="url"
      returnKeyType="go"
      {...props}
    />
  );
};

/* ---------------------------------- Body ---------------------------------- */

type WebPreviewBodyProps = ViewProps & {
  className?: string;
  height?: number;
  loading?: React.ReactNode;
};

const WebPreviewBody = ({
  className,
  height = 400,
  loading,
  ...props
}: WebPreviewBodyProps) => {
  const { url } = useWebPreview();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  if (!url) {
    return (
      <View
        className={cn('items-center justify-center bg-muted/30', className)}
        style={{ height }}
        {...props}
      >
        <Text className="text-sm text-muted-foreground">
          Enter a URL to preview
        </Text>
      </View>
    );
  }

  return (
    <View
      className={cn('relative overflow-hidden', className)}
      style={{ height }}
      {...props}
    >
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled
        style={{ flex: 1 }}
      />
      {isLoading && (
        loading ?? (
          <View className="absolute inset-0 items-center justify-center bg-background/80">
            <ActivityIndicator size="large" />
          </View>
        )
      )}
      {hasError && (
        <View className="absolute inset-0 items-center justify-center bg-background">
          <Text className="text-sm text-destructive">
            Failed to load page
          </Text>
        </View>
      )}
    </View>
  );
};

/* -------------------------------- Console --------------------------------- */

interface ConsoleLog {
  level: 'log' | 'warn' | 'error';
  message: string;
  timestamp: Date;
}

type WebPreviewConsoleProps = ViewProps & {
  className?: string;
  logs?: ConsoleLog[];
  children?: React.ReactNode;
};

const logLevelStyles: Record<string, string> = {
  error: 'text-destructive',
  log: 'text-foreground',
  warn: 'text-yellow-600',
};

const WebPreviewConsole = ({
  className,
  logs = [],
  children,
  ...props
}: WebPreviewConsoleProps) => {
  const { consoleOpen, setConsoleOpen } = useWebPreview();

  return (
    <Collapsible
      className={cn('border-t border-border bg-muted/50', className)}
      open={consoleOpen}
      onOpenChange={setConsoleOpen}
      {...props}
    >
      <CollapsibleTrigger className="flex-row w-full items-center justify-between px-4 py-3">
        <Text className="text-sm font-medium text-foreground">Console</Text>
        <ChevronDown
          size={16}
          className="text-muted-foreground"
          style={consoleOpen ? { transform: [{ rotate: '180deg' }] } : undefined}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <View className="max-h-48 gap-1">
          {logs.length === 0 ? (
            <Text className="font-mono text-sm text-muted-foreground">
              No console output
            </Text>
          ) : (
            logs.map((log) => (
              <View
                className="flex-row gap-2"
                key={`${log.timestamp.getTime()}-${log.level}-${log.message}`}
              >
                <Text className="font-mono text-xs text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </Text>
                <Text
                  className={cn(
                    'flex-1 font-mono text-xs',
                    logLevelStyles[log.level],
                  )}
                >
                  {log.message}
                </Text>
              </View>
            ))
          )}
          {children}
        </View>
      </CollapsibleContent>
    </Collapsible>
  );
};

export {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
  WebPreviewConsole,
  useWebPreview,
  type WebPreviewProps,
  type WebPreviewNavigationProps,
  type WebPreviewNavigationButtonProps,
  type WebPreviewUrlProps,
  type WebPreviewBodyProps,
  type WebPreviewConsoleProps,
  type ConsoleLog,
};
