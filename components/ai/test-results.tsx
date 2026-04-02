import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { CheckCircle2Icon, XCircleIcon, ChevronDownIcon } from 'lucide-react-native';
import * as Collapsible from '@rn-primitives/collapsible';
import * as React from 'react';
import { View } from 'react-native';

type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

type TestResultsProps = {
  results: TestResult[];
  className?: string;
};

function TestResultItem({ result }: { result: TestResult }) {
  if (result.passed || !result.error) {
    return (
      <View className="flex-row items-center gap-2 px-3 py-2">
        <Icon
          as={result.passed ? CheckCircle2Icon : XCircleIcon}
          className={cn('size-4', result.passed ? 'text-green-500' : 'text-destructive')}
        />
        <Text
          className={cn(
            'flex-1 text-sm',
            result.passed ? 'text-foreground' : 'text-destructive'
          )}
        >
          {result.name}
        </Text>
      </View>
    );
  }

  return (
    <Collapsible.Root>
      <Collapsible.Trigger className="flex-row items-center gap-2 px-3 py-2">
        <Icon as={XCircleIcon} className="text-destructive size-4" />
        <Text className="text-destructive flex-1 text-sm">{result.name}</Text>
        <Icon as={ChevronDownIcon} className="text-muted-foreground size-3.5" />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <View className="bg-destructive/5 mx-3 mb-2 rounded px-3 py-2">
          <Text className="text-destructive font-mono text-xs">{result.error}</Text>
        </View>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

const TestResults = React.memo(function TestResults({
  results,
  className,
}: TestResultsProps) {
  const passedCount = React.useMemo(
    () => results.filter((r) => r.passed).length,
    [results]
  );
  const failedCount = results.length - passedCount;

  return (
    <View className={cn('bg-muted overflow-hidden rounded-lg', className)}>
      {/* Summary header */}
      <View className="border-border flex-row items-center gap-3 border-b px-3 py-2">
        <Text className="text-foreground text-sm font-medium">Test Results</Text>
        <View className="flex-row items-center gap-2">
          {passedCount > 0 && (
            <Text className="text-xs font-medium text-green-500">
              {passedCount} passed
            </Text>
          )}
          {failedCount > 0 && (
            <Text className="text-destructive text-xs font-medium">
              {failedCount} failed
            </Text>
          )}
        </View>
      </View>

      {/* Results list */}
      <View>
        {results.map((result, index) => (
          <TestResultItem key={index} result={result} />
        ))}
      </View>
    </View>
  );
});

TestResults.displayName = 'TestResults';

export { TestResults };
export type { TestResultsProps, TestResult };
