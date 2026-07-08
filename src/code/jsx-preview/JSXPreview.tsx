import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { AlertCircle } from 'lucide-react-native';

import { cn } from '../../utils/cn';

/* --------------------------------- Context -------------------------------- */

interface JSXPreviewContextValue {
  jsx: string;
  processedJsx: string;
  isStreaming: boolean;
  error: Error | null;
  setError: (error: Error | null) => void;
}

const JSXPreviewContext = createContext<JSXPreviewContextValue | null>(null);

const useJSXPreview = () => {
  const context = useContext(JSXPreviewContext);
  if (!context) {
    throw new Error('JSXPreview components must be used within JSXPreview');
  }
  return context;
};

/* ------------------------------ JSX Completion ----------------------------- */

const TAG_REGEX = /<\/?([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*?)(\/)?>/;

const matchJsxTag = (code: string) => {
  if (code.trim() === '') {
    return null;
  }
  const match = code.match(TAG_REGEX);
  if (!match || match.index === undefined) {
    return null;
  }
  const [fullMatch, tagName, , selfClosing] = match;

  let type: 'self-closing' | 'closing' | 'opening';
  if (selfClosing) {
    type = 'self-closing';
  } else if (fullMatch.startsWith('</')) {
    type = 'closing';
  } else {
    type = 'opening';
  }

  return {
    endIndex: match.index + fullMatch.length,
    tagName,
    type,
  };
};

const stripIncompleteTag = (text: string) => {
  const lastOpen = text.lastIndexOf('<');
  if (lastOpen === -1) {
    return text;
  }
  const afterOpen = text.slice(lastOpen);
  if (!afterOpen.includes('>')) {
    return text.slice(0, lastOpen);
  }
  return text;
};

const completeJsxTag = (code: string) => {
  const stack: string[] = [];
  let result = '';
  let currentPosition = 0;

  while (currentPosition < code.length) {
    const match = matchJsxTag(code.slice(currentPosition));
    if (!match) {
      result += stripIncompleteTag(code.slice(currentPosition));
      break;
    }
    const { tagName, type, endIndex } = match;
    result += code.slice(currentPosition, currentPosition + endIndex);

    if (type === 'opening') {
      stack.push(tagName);
    } else if (type === 'closing') {
      stack.pop();
    }
    currentPosition += endIndex;
  }

  return (
    result +
    [...stack]
      .reverse()
      .map((tag) => `</${tag}>`)
      .join('')
  );
};

/* ---------------------------------- Root ---------------------------------- */

type JSXPreviewProps = ViewProps & {
  className?: string;
  jsx: string;
  isStreaming?: boolean;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
};

const JSXPreview = memo(
  ({
    jsx,
    isStreaming = false,
    onError,
    className,
    children,
    ...props
  }: JSXPreviewProps) => {
    const [prevJsx, setPrevJsx] = useState(jsx);
    const [error, setError] = useState<Error | null>(null);

    // Clear error when jsx changes
    if (jsx !== prevJsx) {
      setPrevJsx(jsx);
      setError(null);
    }

    const processedJsx = useMemo(
      () => (isStreaming ? completeJsxTag(jsx) : jsx),
      [jsx, isStreaming],
    );

    const contextValue = useMemo(
      () => ({
        error,
        isStreaming,
        jsx,
        processedJsx,
        setError,
      }),
      [error, isStreaming, jsx, processedJsx],
    );

    return (
      <JSXPreviewContext.Provider value={contextValue}>
        <View className={cn('relative', className)} {...props}>
          {children}
        </View>
      </JSXPreviewContext.Provider>
    );
  },
);

JSXPreview.displayName = 'JSXPreview';

/* -------------------------------- Content --------------------------------- */

const createHtmlContent = (jsx: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; padding: 16px; font-family: -apple-system, system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      const App = () => (${jsx});
      ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    } catch (err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message }));
    }
  </script>
</body>
</html>
`;

type JSXPreviewContentProps = ViewProps & {
  className?: string;
  height?: number;
};

const JSXPreviewContent = memo(
  ({ className, height = 300, ...props }: JSXPreviewContentProps) => {
    const { processedJsx, setError } = useJSXPreview();

    const html = useMemo(
      () => createHtmlContent(processedJsx),
      [processedJsx],
    );

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'error') {
            setError(new Error(data.message));
          }
        } catch {
          // Ignore non-JSON messages
        }
      },
      [setError],
    );

    return (
      <View
        className={cn('overflow-hidden', className)}
        style={{ height }}
        {...props}
      >
        <WebView
          source={{ html }}
          onMessage={handleMessage}
          originWhitelist={['*']}
          javaScriptEnabled
          style={{ flex: 1 }}
        />
      </View>
    );
  },
);

JSXPreviewContent.displayName = 'JSXPreviewContent';

/* --------------------------------- Error ---------------------------------- */

type JSXPreviewErrorProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const JSXPreviewError = memo(
  ({ className, children, ...props }: JSXPreviewErrorProps) => {
    const { error } = useJSXPreview();

    if (!error) {
      return null;
    }

    return (
      <View
        className={cn(
          'flex-row items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <AlertCircle size={16} className="shrink-0 text-destructive" />
            <Text className="text-sm text-destructive">{error.message}</Text>
          </>
        )}
      </View>
    );
  },
);

JSXPreviewError.displayName = 'JSXPreviewError';

export {
  JSXPreview,
  JSXPreviewContent,
  JSXPreviewError,
  useJSXPreview,
  type JSXPreviewProps,
  type JSXPreviewContentProps,
  type JSXPreviewErrorProps,
};
