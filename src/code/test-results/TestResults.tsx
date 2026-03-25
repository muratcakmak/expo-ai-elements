import React, { createContext, useContext, useMemo } from 'react';
import {
  Text,
  View,
  type ViewProps,
} from 'react-native';
import {
  CheckCircle,
  ChevronRight,
  Circle,
  XCircle,
} from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Badge } from '../../primitives/Badge';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';

/* ---------------------------------- Types --------------------------------- */

type TestStatus = 'passed' | 'failed' | 'skipped' | 'running';

interface TestResultsSummaryData {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  duration?: number;
}

/* --------------------------------- Context -------------------------------- */

interface TestResultsContextType {
  summary?: TestResultsSummaryData;
}

const TestResultsContext = createContext<TestResultsContextType>({});

/* --------------------------------- Helpers -------------------------------- */

const formatDuration = (ms: number) => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

const statusIcons: Record<TestStatus, React.ReactNode> = {
  failed: <XCircle size={16} className="text-red-500" />,
  passed: <CheckCircle size={16} className="text-green-500" />,
  running: <Circle size={16} className="text-blue-500" />,
  skipped: <Circle size={16} className="text-yellow-500" />,
};

/* --------------------------------- Header --------------------------------- */

type TestResultsHeaderProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestResultsHeader = ({
  className,
  children,
  ...props
}: TestResultsHeaderProps) => (
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

/* ------------------------------- Duration --------------------------------- */

type TestResultsDurationProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestResultsDuration = ({
  className,
  children,
  ...props
}: TestResultsDurationProps) => {
  const { summary } = useContext(TestResultsContext);

  if (!summary?.duration) {
    return null;
  }

  return (
    <View className={cn(className)} {...props}>
      <Text className="text-sm text-muted-foreground">
        {children ?? formatDuration(summary.duration)}
      </Text>
    </View>
  );
};

/* ------------------------------- Summary ---------------------------------- */

type TestResultsSummaryProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestResultsSummary = ({
  className,
  children,
  ...props
}: TestResultsSummaryProps) => {
  const { summary } = useContext(TestResultsContext);

  if (!summary) {
    return null;
  }

  return (
    <View className={cn('flex-row items-center gap-3', className)} {...props}>
      {children ?? (
        <>
          <Badge className="bg-green-100 dark:bg-green-900/30">
            <View className="flex-row items-center gap-1">
              <CheckCircle size={12} className="text-green-600" />
              <Text className="text-xs text-green-700 dark:text-green-400">
                {summary.passed} passed
              </Text>
            </View>
          </Badge>
          {summary.failed > 0 && (
            <Badge className="bg-red-100 dark:bg-red-900/30">
              <View className="flex-row items-center gap-1">
                <XCircle size={12} className="text-red-600" />
                <Text className="text-xs text-red-700 dark:text-red-400">
                  {summary.failed} failed
                </Text>
              </View>
            </Badge>
          )}
          {summary.skipped > 0 && (
            <Badge className="bg-yellow-100 dark:bg-yellow-900/30">
              <View className="flex-row items-center gap-1">
                <Circle size={12} className="text-yellow-600" />
                <Text className="text-xs text-yellow-700 dark:text-yellow-400">
                  {summary.skipped} skipped
                </Text>
              </View>
            </Badge>
          )}
        </>
      )}
    </View>
  );
};

/* ---------------------------------- Root ---------------------------------- */

type TestResultsProps = ViewProps & {
  className?: string;
  summary?: TestResultsSummaryData;
  children?: React.ReactNode;
};

const TestResults = ({
  summary,
  className,
  children,
  ...props
}: TestResultsProps) => {
  const contextValue = useMemo(() => ({ summary }), [summary]);

  return (
    <TestResultsContext.Provider value={contextValue}>
      <View
        className={cn('rounded-lg border border-border bg-background', className)}
        {...props}
      >
        {children ??
          (summary ? (
            <TestResultsHeader>
              <TestResultsSummary />
              <TestResultsDuration />
            </TestResultsHeader>
          ) : null)}
      </View>
    </TestResultsContext.Provider>
  );
};

/* -------------------------------- Progress -------------------------------- */

type TestResultsProgressProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestResultsProgress = ({
  className,
  children,
  ...props
}: TestResultsProgressProps) => {
  const { summary } = useContext(TestResultsContext);

  if (!summary) {
    return null;
  }

  const passedPercent = (summary.passed / summary.total) * 100;
  const failedPercent = (summary.failed / summary.total) * 100;

  return (
    <View className={cn('gap-2', className)} {...props}>
      {children ?? (
        <>
          <View className="h-2 flex-row overflow-hidden rounded-full bg-muted">
            <View
              className="bg-green-500"
              style={{ width: `${passedPercent}%` }}
            />
            <View
              className="bg-red-500"
              style={{ width: `${failedPercent}%` }}
            />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted-foreground">
              {summary.passed}/{summary.total} tests passed
            </Text>
            <Text className="text-xs text-muted-foreground">
              {passedPercent.toFixed(0)}%
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

/* -------------------------------- Content --------------------------------- */

type TestResultsContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestResultsContent = ({
  className,
  children,
  ...props
}: TestResultsContentProps) => (
  <View className={cn('gap-2 p-4', className)} {...props}>
    {children}
  </View>
);

/* --------------------------------- Suite ---------------------------------- */

interface TestSuiteContextType {
  name: string;
  status: TestStatus;
}

const TestSuiteContext = createContext<TestSuiteContextType>({
  name: '',
  status: 'passed',
});

type TestSuiteProps = ViewProps & {
  className?: string;
  name: string;
  status: TestStatus;
  defaultOpen?: boolean;
  children?: React.ReactNode;
};

const TestSuite = ({
  name,
  status,
  className,
  defaultOpen,
  children,
  ...props
}: TestSuiteProps) => {
  const contextValue = useMemo(() => ({ name, status }), [name, status]);

  return (
    <TestSuiteContext.Provider value={contextValue}>
      <Collapsible
        className={cn('rounded-lg border border-border', className)}
        defaultOpen={defaultOpen}
        {...props}
      >
        {children}
      </Collapsible>
    </TestSuiteContext.Provider>
  );
};

/* -------------------------------- Suite Name ------------------------------ */

type TestSuiteNameProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestSuiteName = ({
  className,
  children,
  ...props
}: TestSuiteNameProps) => {
  const { name, status } = useContext(TestSuiteContext);

  return (
    <CollapsibleTrigger
      className={cn(
        'flex-row w-full items-center gap-2 px-4 py-3',
        className,
      )}
      {...props}
    >
      <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
      {statusIcons[status]}
      <Text className="text-sm font-medium text-foreground">
        {children ?? name}
      </Text>
    </CollapsibleTrigger>
  );
};

/* ------------------------------ Suite Stats ------------------------------- */

type TestSuiteStatsProps = ViewProps & {
  className?: string;
  passed?: number;
  failed?: number;
  skipped?: number;
  children?: React.ReactNode;
};

const TestSuiteStats = ({
  passed = 0,
  failed = 0,
  skipped = 0,
  className,
  children,
  ...props
}: TestSuiteStatsProps) => (
  <View
    className={cn('ml-auto flex-row items-center gap-2', className)}
    {...props}
  >
    {children ?? (
      <>
        {passed > 0 && (
          <Text className="text-xs text-green-600 dark:text-green-400">
            {passed} passed
          </Text>
        )}
        {failed > 0 && (
          <Text className="text-xs text-red-600 dark:text-red-400">
            {failed} failed
          </Text>
        )}
        {skipped > 0 && (
          <Text className="text-xs text-yellow-600 dark:text-yellow-400">
            {skipped} skipped
          </Text>
        )}
      </>
    )}
  </View>
);

/* ----------------------------- Suite Content ------------------------------ */

type TestSuiteContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestSuiteContent = ({
  className,
  children,
  ...props
}: TestSuiteContentProps) => (
  <CollapsibleContent className={cn('border-t border-border', className)} {...props}>
    <View className="divide-y divide-border">{children}</View>
  </CollapsibleContent>
);

/* ---------------------------------- Test ---------------------------------- */

interface TestContextType {
  name: string;
  status: TestStatus;
  duration?: number;
}

const TestContext = createContext<TestContextType>({
  name: '',
  status: 'passed',
});

type TestProps = ViewProps & {
  className?: string;
  name: string;
  status: TestStatus;
  duration?: number;
  children?: React.ReactNode;
};

const Test = ({
  name,
  status,
  duration,
  className,
  children,
  ...props
}: TestProps) => {
  const contextValue = useMemo(
    () => ({ duration, name, status }),
    [duration, name, status],
  );

  return (
    <TestContext.Provider value={contextValue}>
      <View
        className={cn('flex-row items-center gap-2 px-4 py-2', className)}
        {...props}
      >
        {children ?? (
          <>
            <TestStatusIcon />
            <TestName />
            {duration !== undefined && <TestDuration />}
          </>
        )}
      </View>
    </TestContext.Provider>
  );
};

/* -------------------------------- Test Name ------------------------------- */

type TestNameProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestName = ({ className, children, ...props }: TestNameProps) => {
  const { name } = useContext(TestContext);

  return (
    <View className={cn('flex-1', className)} {...props}>
      <Text className="text-sm text-foreground">{children ?? name}</Text>
    </View>
  );
};

/* ------------------------------ Test Duration ----------------------------- */

type TestDurationProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestDuration = ({
  className,
  children,
  ...props
}: TestDurationProps) => {
  const { duration } = useContext(TestContext);

  if (duration === undefined) {
    return null;
  }

  return (
    <View className={cn('ml-auto', className)} {...props}>
      <Text className="text-xs text-muted-foreground">
        {children ?? `${duration}ms`}
      </Text>
    </View>
  );
};

/* ----------------------------- Test Status -------------------------------- */

type TestStatusIconProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestStatusIcon = ({
  className,
  children,
  ...props
}: TestStatusIconProps) => {
  const { status } = useContext(TestContext);

  return (
    <View className={cn('shrink-0', className)} {...props}>
      {children ?? statusIcons[status]}
    </View>
  );
};

/* ------------------------------- Test Error ------------------------------- */

type TestErrorProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestError = ({ className, children, ...props }: TestErrorProps) => (
  <View
    className={cn('mt-2 rounded-md bg-red-50 p-3 dark:bg-red-900/20', className)}
    {...props}
  >
    {children}
  </View>
);

/* ----------------------------- Test Error Message ------------------------- */

type TestErrorMessageProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestErrorMessage = ({
  className,
  children,
  ...props
}: TestErrorMessageProps) => (
  <View className={cn(className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="text-sm font-medium text-red-700 dark:text-red-400">
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

/* ----------------------------- Test Error Stack --------------------------- */

type TestErrorStackProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const TestErrorStack = ({
  className,
  children,
  ...props
}: TestErrorStackProps) => (
  <View className={cn('mt-2', className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="font-mono text-xs text-red-600 dark:text-red-400">
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

export {
  TestResults,
  TestResultsHeader,
  TestResultsDuration,
  TestResultsSummary,
  TestResultsProgress,
  TestResultsContent,
  TestSuite,
  TestSuiteName,
  TestSuiteStats,
  TestSuiteContent,
  Test,
  TestName,
  TestDuration,
  TestStatusIcon,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  type TestResultsProps,
  type TestResultsHeaderProps,
  type TestResultsDurationProps,
  type TestResultsSummaryProps,
  type TestResultsProgressProps,
  type TestResultsContentProps,
  type TestSuiteProps,
  type TestSuiteNameProps,
  type TestSuiteStatsProps,
  type TestSuiteContentProps,
  type TestProps,
  type TestNameProps,
  type TestDurationProps,
  type TestStatusIconProps,
  type TestErrorProps,
  type TestErrorMessageProps,
  type TestErrorStackProps,
  type TestStatus,
};
