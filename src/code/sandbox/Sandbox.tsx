import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Code } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';

/* ---------------------------------- Root ---------------------------------- */

type SandboxProps = ViewProps & {
  className?: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
};

const Sandbox = ({
  className,
  defaultOpen = true,
  children,
  ...props
}: SandboxProps) => (
  <Collapsible
    className={cn(
      'w-full overflow-hidden rounded-md border border-border',
      className,
    )}
    defaultOpen={defaultOpen}
    {...props}
  >
    {children}
  </Collapsible>
);

/* --------------------------------- Header --------------------------------- */

type SandboxHeaderProps = ViewProps & {
  className?: string;
  title?: string;
  children?: React.ReactNode;
};

const SandboxHeader = ({
  className,
  title,
  children,
  ...props
}: SandboxHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      'flex-row w-full items-center justify-between gap-4 p-3',
      className,
    )}
    {...props}
  >
    {children ?? (
      <View className="flex-row items-center gap-2">
        <Code size={16} className="text-muted-foreground" />
        <Text className="text-sm font-medium text-foreground">
          {title ?? 'Sandbox'}
        </Text>
      </View>
    )}
  </CollapsibleTrigger>
);

/* -------------------------------- Content --------------------------------- */

type SandboxContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SandboxContent = ({
  className,
  children,
  ...props
}: SandboxContentProps) => (
  <CollapsibleContent className={cn(className)} {...props}>
    {children}
  </CollapsibleContent>
);

/* ---------------------------------- Body ---------------------------------- */

type SandboxBodyProps = ViewProps & {
  className?: string;
  url: string;
  height?: number;
};

const SandboxBody = ({
  className,
  url,
  height = 400,
  ...props
}: SandboxBodyProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <View
      className={cn('relative overflow-hidden', className)}
      style={{ height }}
      {...props}
    >
      <WebView
        source={{ uri: url }}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled
        style={{ flex: 1 }}
      />
      {isLoading && (
        <View className="absolute inset-0 items-center justify-center bg-background/80">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-sm text-muted-foreground">
            Loading sandbox...
          </Text>
        </View>
      )}
    </View>
  );
};

export {
  Sandbox,
  SandboxHeader,
  SandboxContent,
  SandboxBody,
  type SandboxProps,
  type SandboxHeaderProps,
  type SandboxContentProps,
  type SandboxBodyProps,
};
