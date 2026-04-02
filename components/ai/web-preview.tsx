import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ActivityIndicator, TextInput, View, type ViewProps } from 'react-native';
import { WebView } from 'react-native-webview';

// --- Context ---

type WebPreviewContextValue = {
  url: string;
  setUrl: (url: string) => void;
};

const WebPreviewContext = React.createContext<WebPreviewContextValue | null>(null);

function useWebPreview() {
  const context = React.useContext(WebPreviewContext);
  if (!context) {
    throw new Error('WebPreview components must be used within a WebPreview');
  }
  return context;
}

// --- WebPreview (container) ---

type WebPreviewProps = ViewProps & {
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
};

function WebPreview({
  className,
  children,
  defaultUrl = '',
  onUrlChange,
  ...props
}: WebPreviewProps) {
  const [url, setUrlState] = React.useState(defaultUrl);

  const setUrl = React.useCallback(
    (newUrl: string) => {
      setUrlState(newUrl);
      onUrlChange?.(newUrl);
    },
    [onUrlChange]
  );

  const contextValue = React.useMemo<WebPreviewContextValue>(
    () => ({ url, setUrl }),
    [url, setUrl]
  );

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <View
        className={cn('bg-card border-border overflow-hidden rounded-lg border', className)}
        {...props}
      >
        {children}
      </View>
    </WebPreviewContext.Provider>
  );
}

// --- WebPreviewNavigation ---

type WebPreviewNavigationProps = ViewProps;

function WebPreviewNavigation({ className, children, ...props }: WebPreviewNavigationProps) {
  return (
    <View
      className={cn('border-border flex-row items-center gap-1 border-b p-2', className)}
      {...props}
    >
      {children}
    </View>
  );
}

// --- WebPreviewNavigationButton ---

type WebPreviewNavigationButtonProps = ButtonProps & {
  label?: string;
};

function WebPreviewNavigationButton({
  label,
  children,
  className,
  ...props
}: WebPreviewNavigationButtonProps) {
  return (
    <Button
      className={cn('h-8 w-8 p-0', className)}
      size="icon"
      variant="ghost"
      accessibilityLabel={label}
      {...props}
    >
      {children}
    </Button>
  );
}

// --- WebPreviewUrl ---

type WebPreviewUrlProps = Omit<React.ComponentProps<typeof TextInput>, 'value' | 'onChangeText'> & {
  className?: string;
};

function WebPreviewUrl({ className, ...props }: WebPreviewUrlProps) {
  const { url, setUrl } = useWebPreview();
  const [inputValue, setInputValue] = React.useState(url);
  const prevUrlRef = React.useRef(url);

  // Sync input value with context URL when it changes externally
  if (url !== prevUrlRef.current) {
    prevUrlRef.current = url;
    setInputValue(url);
  }

  const handleSubmit = React.useCallback(() => {
    setUrl(inputValue);
  }, [inputValue, setUrl]);

  return (
    <TextInput
      className={cn(
        'bg-muted/50 border-border text-foreground h-8 flex-1 rounded-md border px-2 text-sm',
        className
      )}
      value={inputValue}
      onChangeText={setInputValue}
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
}

// --- WebPreviewBody ---

type WebPreviewBodyProps = ViewProps & {
  src?: string;
  loading?: React.ReactNode;
};

function WebPreviewBody({ className, src, loading: loadingNode, ...props }: WebPreviewBodyProps) {
  const { url } = useWebPreview();
  const [isLoading, setIsLoading] = React.useState(true);
  const resolvedUrl = src ?? url;

  return (
    <View className={cn('h-64 flex-1', className)} {...props}>
      {resolvedUrl ? (
        <WebView
          source={{ uri: resolvedUrl }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          style={{ flex: 1 }}
        />
      ) : null}
      {isLoading && resolvedUrl
        ? (loadingNode ?? (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator size="small" />
            </View>
          ))
        : null}
    </View>
  );
}

WebPreview.displayName = 'WebPreview';
WebPreviewNavigation.displayName = 'WebPreviewNavigation';
WebPreviewNavigationButton.displayName = 'WebPreviewNavigationButton';
WebPreviewUrl.displayName = 'WebPreviewUrl';
WebPreviewBody.displayName = 'WebPreviewBody';

export {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
  useWebPreview,
};
export type {
  WebPreviewProps,
  WebPreviewNavigationProps,
  WebPreviewNavigationButtonProps,
  WebPreviewUrlProps,
  WebPreviewBodyProps,
  WebPreviewContextValue,
};
