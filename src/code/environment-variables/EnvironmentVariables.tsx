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
  Switch,
  Text,
  View,
  type PressableProps,
  type ViewProps,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy, Eye, EyeOff } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Badge } from '../../primitives/Badge';

/* --------------------------------- Context -------------------------------- */

interface EnvironmentVariablesContextType {
  showValues: boolean;
  setShowValues: (show: boolean) => void;
}

const noop = () => {};

const EnvironmentVariablesContext =
  createContext<EnvironmentVariablesContextType>({
    setShowValues: noop,
    showValues: false,
  });

/* ---------------------------------- Root ---------------------------------- */

type EnvironmentVariablesProps = ViewProps & {
  className?: string;
  showValues?: boolean;
  defaultShowValues?: boolean;
  onShowValuesChange?: (show: boolean) => void;
  children?: React.ReactNode;
};

const EnvironmentVariables = ({
  showValues: controlledShowValues,
  defaultShowValues = false,
  onShowValuesChange,
  className,
  children,
  ...props
}: EnvironmentVariablesProps) => {
  const [internalShowValues, setInternalShowValues] =
    useState(defaultShowValues);
  const showValues = controlledShowValues ?? internalShowValues;

  const setShowValues = useCallback(
    (show: boolean) => {
      setInternalShowValues(show);
      onShowValuesChange?.(show);
    },
    [onShowValuesChange],
  );

  const contextValue = useMemo(
    () => ({ setShowValues, showValues }),
    [setShowValues, showValues],
  );

  return (
    <EnvironmentVariablesContext.Provider value={contextValue}>
      <View
        className={cn('rounded-lg border border-border bg-background', className)}
        {...props}
      >
        {children}
      </View>
    </EnvironmentVariablesContext.Provider>
  );
};

/* --------------------------------- Header --------------------------------- */

type EnvironmentVariablesHeaderProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const EnvironmentVariablesHeader = ({
  className,
  children,
  ...props
}: EnvironmentVariablesHeaderProps) => (
  <View
    className={cn(
      'flex-row items-center justify-between border-b border-border px-4 py-3',
      className,
    )}
    {...props}
  >
    {children}
  </View>
);

/* ---------------------------------- Title --------------------------------- */

type EnvironmentVariablesTitleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const EnvironmentVariablesTitle = ({
  className,
  children,
  ...props
}: EnvironmentVariablesTitleProps) => (
  <View className={cn(className)} {...props}>
    <Text className="text-sm font-medium text-foreground">
      {children ?? 'Environment Variables'}
    </Text>
  </View>
);

/* --------------------------------- Toggle --------------------------------- */

type EnvironmentVariablesToggleProps = ViewProps & {
  className?: string;
};

const EnvironmentVariablesToggle = ({
  className,
  ...props
}: EnvironmentVariablesToggleProps) => {
  const { showValues, setShowValues } = useContext(EnvironmentVariablesContext);

  const Icon = showValues ? Eye : EyeOff;

  return (
    <View className={cn('flex-row items-center gap-2', className)} {...props}>
      <Icon size={14} className="text-muted-foreground" />
      <Switch
        value={showValues}
        onValueChange={setShowValues}
        accessibilityLabel="Toggle value visibility"
      />
    </View>
  );
};

/* -------------------------------- Content --------------------------------- */

type EnvironmentVariablesContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const EnvironmentVariablesContent = ({
  className,
  children,
  ...props
}: EnvironmentVariablesContentProps) => (
  <View className={cn(className)} {...props}>
    {children}
  </View>
);

/* ----------------------------- Variable Context --------------------------- */

interface EnvironmentVariableContextType {
  name: string;
  value: string;
}

const EnvironmentVariableContext =
  createContext<EnvironmentVariableContextType>({
    name: '',
    value: '',
  });

/* -------------------------------- Variable -------------------------------- */

type EnvironmentVariableProps = ViewProps & {
  className?: string;
  name: string;
  value: string;
  children?: React.ReactNode;
};

const EnvironmentVariable = ({
  name,
  value,
  className,
  children,
  ...props
}: EnvironmentVariableProps) => {
  const envVarContextValue = useMemo(() => ({ name, value }), [name, value]);

  return (
    <EnvironmentVariableContext.Provider value={envVarContextValue}>
      <View
        className={cn(
          'flex-row items-center justify-between gap-4 border-b border-border px-4 py-3',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <View className="flex-row items-center gap-2">
              <EnvironmentVariableName />
            </View>
            <EnvironmentVariableValue />
          </>
        )}
      </View>
    </EnvironmentVariableContext.Provider>
  );
};

/* ------------------------------ Variable Name ----------------------------- */

type EnvironmentVariableNameProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const EnvironmentVariableName = ({
  className,
  children,
  ...props
}: EnvironmentVariableNameProps) => {
  const { name } = useContext(EnvironmentVariableContext);

  return (
    <View className={cn(className)} {...props}>
      <Text className="font-mono text-sm text-foreground">
        {children ?? name}
      </Text>
    </View>
  );
};

/* ----------------------------- Variable Value ----------------------------- */

type EnvironmentVariableValueProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const EnvironmentVariableValue = ({
  className,
  children,
  ...props
}: EnvironmentVariableValueProps) => {
  const { value } = useContext(EnvironmentVariableContext);
  const { showValues } = useContext(EnvironmentVariablesContext);

  const displayValue = showValues
    ? value
    : '\u2022'.repeat(Math.min(value.length, 20));

  return (
    <View className={cn(className)} {...props}>
      <Text className="font-mono text-sm text-muted-foreground">
        {children ?? displayValue}
      </Text>
    </View>
  );
};

/* ------------------------------ Variable Group ----------------------------- */

type EnvironmentVariableGroupProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const EnvironmentVariableGroup = ({
  className,
  children,
  ...props
}: EnvironmentVariableGroupProps) => (
  <View className={cn('flex-row items-center gap-2', className)} {...props}>
    {children}
  </View>
);

/* ----------------------------- Copy Button -------------------------------- */

type EnvironmentVariableCopyButtonProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  copyFormat?: 'name' | 'value' | 'export';
};

const EnvironmentVariableCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  copyFormat = 'value',
  children,
  className,
  ...props
}: EnvironmentVariableCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { name, value } = useContext(EnvironmentVariableContext);

  const getTextToCopy = useCallback((): string => {
    const formatMap = {
      export: () => `export ${name}="${value}"`,
      name: () => name,
      value: () => value,
    };
    return formatMap[copyFormat]();
  }, [name, value, copyFormat]);

  const copyToClipboard = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(getTextToCopy());
      setIsCopied(true);
      onCopy?.();
      timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [getTextToCopy, onCopy, onError, timeout]);

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
      className={cn('h-6 w-6 shrink-0 items-center justify-center', className)}
      onPress={copyToClipboard}
      accessibilityRole="button"
      accessibilityLabel="Copy"
      {...props}
    >
      {children ?? <Icon size={12} className="text-muted-foreground" />}
    </Pressable>
  );
};

/* ------------------------------ Required Badge ----------------------------- */

type EnvironmentVariableRequiredProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const EnvironmentVariableRequired = ({
  className,
  children,
  ...props
}: EnvironmentVariableRequiredProps) => (
  <Badge className={cn(className)} variant="secondary" {...props}>
    {children ?? 'Required'}
  </Badge>
);

export {
  EnvironmentVariables,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariablesContent,
  EnvironmentVariable,
  EnvironmentVariableName,
  EnvironmentVariableValue,
  EnvironmentVariableGroup,
  EnvironmentVariableCopyButton,
  EnvironmentVariableRequired,
  type EnvironmentVariablesProps,
  type EnvironmentVariablesHeaderProps,
  type EnvironmentVariablesTitleProps,
  type EnvironmentVariablesToggleProps,
  type EnvironmentVariablesContentProps,
  type EnvironmentVariableProps,
  type EnvironmentVariableNameProps,
  type EnvironmentVariableValueProps,
  type EnvironmentVariableGroupProps,
  type EnvironmentVariableCopyButtonProps,
  type EnvironmentVariableRequiredProps,
};
