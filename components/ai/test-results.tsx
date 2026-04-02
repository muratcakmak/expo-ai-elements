import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  CircleDotIcon,
  CircleIcon,
  XCircleIcon,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import * as Collapsible from '@rn-primitives/collapsible';
import * as React from 'react';
import { Pressable, View } from 'react-native';

// --- Types ---

type TestStatusType = 'passed' | 'failed' | 'skipped' | 'running';

type TestResultsSummaryData = {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  duration?: number;
};

// --- Utility ---

const formatDuration = (ms: number) => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

const statusStyles: Record<TestStatusType, string> = {
  passed: 'text-green-600 dark:text-green-400',
  failed: 'text-red-600 dark:text-red-400',
  skipped: 'text-yellow-600 dark:text-yellow-400',
  running: 'text-blue-600 dark:text-blue-400',
};

const StatusIconComponent: Record<TestStatusType, LucideIcon> = {
  passed: CheckCircle2Icon,
  failed: XCircleIcon,
  skipped: CircleIcon,
  running: CircleDotIcon,
};

// --- Contexts ---

type TestResultsContextValue = {
  summary?: TestResultsSummaryData;
};

const TestResultsContext = React.createContext<TestResultsContextValue>({});

type TestSuiteContextValue = {
  name: string;
  status: TestStatusType;
};

const TestSuiteContext = React.createContext<TestSuiteContextValue>({
  name: '',
  status: 'passed',
});

type TestContextValue = {
  name: string;
  status: TestStatusType;
  duration?: number;
};

const TestContext = React.createContext<TestContextValue>({
  name: '',
  status: 'passed',
});

// --- TestResults (Root) ---

type TestResultsProps = {
  summary?: TestResultsSummaryData;
  children?: React.ReactNode;
  className?: string;
};

const TestResults = React.memo(function TestResults({
  summary,
  children,
  className,
}: TestResultsProps) {
  const contextValue = React.useMemo(() => ({ summary }), [summary]);

  return (
    <TestResultsContext.Provider value={contextValue}>
      <View className={cn('overflow-hidden rounded-lg border border-border bg-background', className)}>
        {children ?? (
          summary && (
            <TestResultsHeader>
              <TestResultsSummary />
              <TestResultsDuration />
            </TestResultsHeader>
          )
        )}
      </View>
    </TestResultsContext.Provider>
  );
});

TestResults.displayName = 'TestResults';

// --- TestResultsHeader ---

type TestResultsHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestResultsHeader = React.memo(function TestResultsHeader({
  children,
  className,
}: TestResultsHeaderProps) {
  return (
    <View className={cn('flex-row items-center justify-between border-b border-border px-4 py-3', className)}>
      {children}
    </View>
  );
});

TestResultsHeader.displayName = 'TestResultsHeader';

// --- TestResultsSummary ---

type TestResultsSummaryProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestResultsSummary = React.memo(function TestResultsSummary({
  children,
  className,
}: TestResultsSummaryProps) {
  const { summary } = React.useContext(TestResultsContext);

  if (!summary) {
    return null;
  }

  return (
    <View className={cn('flex-row items-center gap-3', className)}>
      {children ?? (
        <>
          <View className="flex-row items-center gap-1 rounded-md bg-green-100 px-2 py-0.5 dark:bg-green-900/30">
            <Icon as={CheckCircle2Icon} className="size-3 text-green-700 dark:text-green-400" />
            <Text className="text-xs font-medium text-green-700 dark:text-green-400">
              {summary.passed} passed
            </Text>
          </View>
          {summary.failed > 0 && (
            <View className="flex-row items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 dark:bg-red-900/30">
              <Icon as={XCircleIcon} className="size-3 text-red-700 dark:text-red-400" />
              <Text className="text-xs font-medium text-red-700 dark:text-red-400">
                {summary.failed} failed
              </Text>
            </View>
          )}
          {summary.skipped > 0 && (
            <View className="flex-row items-center gap-1 rounded-md bg-yellow-100 px-2 py-0.5 dark:bg-yellow-900/30">
              <Icon as={CircleIcon} className="size-3 text-yellow-700 dark:text-yellow-400" />
              <Text className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                {summary.skipped} skipped
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
});

TestResultsSummary.displayName = 'TestResultsSummary';

// --- TestResultsDuration ---

type TestResultsDurationProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestResultsDuration = React.memo(function TestResultsDuration({
  children,
  className,
}: TestResultsDurationProps) {
  const { summary } = React.useContext(TestResultsContext);

  if (!summary?.duration) {
    return null;
  }

  return (
    <Text className={cn('text-muted-foreground text-sm', className)}>
      {children ?? formatDuration(summary.duration)}
    </Text>
  );
});

TestResultsDuration.displayName = 'TestResultsDuration';

// --- TestResultsProgress ---

type TestResultsProgressProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestResultsProgress = React.memo(function TestResultsProgress({
  children,
  className,
}: TestResultsProgressProps) {
  const { summary } = React.useContext(TestResultsContext);

  if (!summary) {
    return null;
  }

  const passedPercent = (summary.passed / summary.total) * 100;
  const failedPercent = (summary.failed / summary.total) * 100;

  return (
    <View className={cn('gap-2', className)}>
      {children ?? (
        <>
          <View className="h-2 flex-row overflow-hidden rounded-full bg-muted">
            <View className="bg-green-500" style={{ width: `${passedPercent}%` }} />
            <View className="bg-red-500" style={{ width: `${failedPercent}%` }} />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-xs">
              {summary.passed}/{summary.total} tests passed
            </Text>
            <Text className="text-muted-foreground text-xs">
              {passedPercent.toFixed(0)}%
            </Text>
          </View>
        </>
      )}
    </View>
  );
});

TestResultsProgress.displayName = 'TestResultsProgress';

// --- TestResultsContent ---

type TestResultsContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestResultsContent = React.memo(function TestResultsContent({
  children,
  className,
}: TestResultsContentProps) {
  return <View className={cn('gap-2 p-4', className)}>{children}</View>;
});

TestResultsContent.displayName = 'TestResultsContent';

// --- TestSuite ---

type TestSuiteProps = {
  name: string;
  status: TestStatusType;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
};

const TestSuite = React.memo(function TestSuite({
  name,
  status,
  defaultOpen,
  children,
  className,
}: TestSuiteProps) {
  const contextValue = React.useMemo(() => ({ name, status }), [name, status]);

  return (
    <TestSuiteContext.Provider value={contextValue}>
      <Collapsible.Root defaultOpen={defaultOpen} className={cn('overflow-hidden rounded-lg border border-border', className)}>
        {children}
      </Collapsible.Root>
    </TestSuiteContext.Provider>
  );
});

TestSuite.displayName = 'TestSuite';

// --- TestSuiteName ---

type TestSuiteNameProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestSuiteName = React.memo(function TestSuiteName({
  children,
  className,
}: TestSuiteNameProps) {
  const { name, status } = React.useContext(TestSuiteContext);

  return (
    <Collapsible.Trigger asChild>
      <Pressable className={cn('flex-row items-center gap-2 px-4 py-3', className)}>
        <Icon as={ChevronRightIcon} className="size-4 shrink-0 text-muted-foreground" />
        <Icon
          as={StatusIconComponent[status]}
          className={cn('size-4 shrink-0', statusStyles[status])}
        />
        <Text className="text-sm font-medium">{children ?? name}</Text>
      </Pressable>
    </Collapsible.Trigger>
  );
});

TestSuiteName.displayName = 'TestSuiteName';

// --- TestSuiteContent ---

type TestSuiteContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestSuiteContent = React.memo(function TestSuiteContent({
  children,
  className,
}: TestSuiteContentProps) {
  return (
    <Collapsible.Content className={cn('border-t border-border', className)}>
      <View>{children}</View>
    </Collapsible.Content>
  );
});

TestSuiteContent.displayName = 'TestSuiteContent';

// --- Test ---

type TestProps = {
  name: string;
  status: TestStatusType;
  duration?: number;
  children?: React.ReactNode;
  className?: string;
};

const Test = React.memo(function Test({
  name,
  status,
  duration,
  children,
  className,
}: TestProps) {
  const contextValue = React.useMemo(
    () => ({ name, status, duration }),
    [name, status, duration]
  );

  return (
    <TestContext.Provider value={contextValue}>
      <View className={cn('flex-row items-center gap-2 px-4 py-2', className)}>
        <TestStatus />
        <TestName />
        {duration !== undefined && <TestDuration />}
      </View>
      {children}
    </TestContext.Provider>
  );
});

Test.displayName = 'Test';

// --- TestStatus ---

type TestStatusProps = {
  className?: string;
};

const TestStatus = React.memo(function TestStatus({ className }: TestStatusProps) {
  const { status } = React.useContext(TestContext);

  return (
    <Icon
      as={StatusIconComponent[status]}
      className={cn('size-4 shrink-0', statusStyles[status], className)}
    />
  );
});

TestStatus.displayName = 'TestStatus';

// --- TestName ---

type TestNameProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestName = React.memo(function TestName({ children, className }: TestNameProps) {
  const { name } = React.useContext(TestContext);

  return (
    <Text className={cn('flex-1 text-sm', className)}>{children ?? name}</Text>
  );
});

TestName.displayName = 'TestName';

// --- TestDuration ---

type TestDurationProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestDuration = React.memo(function TestDuration({
  children,
  className,
}: TestDurationProps) {
  const { duration } = React.useContext(TestContext);

  if (duration === undefined) {
    return null;
  }

  return (
    <Text className={cn('text-muted-foreground text-xs', className)}>
      {children ?? `${duration}ms`}
    </Text>
  );
});

TestDuration.displayName = 'TestDuration';

// --- TestError ---

type TestErrorProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestError = React.memo(function TestError({ children, className }: TestErrorProps) {
  return (
    <View className={cn('mx-4 mb-2 rounded-md bg-red-50 p-3 dark:bg-red-900/20', className)}>
      {children}
    </View>
  );
});

TestError.displayName = 'TestError';

// --- TestErrorMessage ---

type TestErrorMessageProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestErrorMessage = React.memo(function TestErrorMessage({
  children,
  className,
}: TestErrorMessageProps) {
  return (
    <Text className={cn('text-sm font-medium text-red-700 dark:text-red-400', className)}>
      {children}
    </Text>
  );
});

TestErrorMessage.displayName = 'TestErrorMessage';

// --- TestErrorStack ---

type TestErrorStackProps = {
  children?: React.ReactNode;
  className?: string;
};

const TestErrorStack = React.memo(function TestErrorStack({
  children,
  className,
}: TestErrorStackProps) {
  return (
    <Text className={cn('mt-2 font-mono text-xs text-red-600 dark:text-red-400', className)}>
      {children}
    </Text>
  );
});

TestErrorStack.displayName = 'TestErrorStack';

export {
  TestResults,
  TestResultsHeader,
  TestResultsSummary,
  TestResultsDuration,
  TestResultsProgress,
  TestResultsContent,
  TestSuite,
  TestSuiteName,
  TestSuiteContent,
  Test,
  TestStatus,
  TestName,
  TestDuration,
  TestError,
  TestErrorMessage,
  TestErrorStack,
};
export type {
  TestResultsProps,
  TestResultsHeaderProps,
  TestResultsSummaryProps,
  TestResultsDurationProps,
  TestResultsProgressProps,
  TestResultsContentProps,
  TestSuiteProps,
  TestSuiteNameProps,
  TestSuiteContentProps,
  TestProps,
  TestStatusProps,
  TestNameProps,
  TestDurationProps,
  TestErrorProps,
  TestErrorMessageProps,
  TestErrorStackProps,
  TestStatusType,
  TestResultsSummaryData,
};
