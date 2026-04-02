import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
  type ToolStatus,
} from '@/components/ai';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PreviewSection } from '@/components/showcase/preview';
import * as React from 'react';
import { View } from 'react-native';

const toolInput = {
  database: 'analytics',
  params: ['2024-01-01'],
  query: 'SELECT COUNT(*) FROM users WHERE created_at >= ?',
};

const toolOutput = `| User ID | Name | Email |
|---------|------|-------|
| 1 | John Doe | john@example.com |
| 2 | Jane Smith | jane@example.com |
| 3 | Bob Wilson | bob@example.com |`;

const LIFECYCLE_STATES: { status: ToolStatus; delay: number }[] = [
  { status: 'input-streaming', delay: 0 },
  { status: 'input-available', delay: 1500 },
  { status: 'output-available', delay: 3000 },
];

export function ToolDemo() {
  const [lifecycleIndex, setLifecycleIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const currentState = LIFECYCLE_STATES[lifecycleIndex];

  const startSimulation = React.useCallback(() => {
    setLifecycleIndex(0);
    setIsPlaying(true);
  }, []);

  React.useEffect(() => {
    if (!isPlaying) return;

    if (lifecycleIndex < LIFECYCLE_STATES.length - 1) {
      const nextDelay =
        LIFECYCLE_STATES[lifecycleIndex + 1].delay - LIFECYCLE_STATES[lifecycleIndex].delay;
      timerRef.current = setTimeout(() => {
        setLifecycleIndex((prev) => prev + 1);
      }, nextDelay);
      return () => clearTimeout(timerRef.current);
    }
    setIsPlaying(false);
  }, [isPlaying, lifecycleIndex]);

  const reset = React.useCallback(() => {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setLifecycleIndex(0);
  }, []);

  return (
    <View className="gap-6">
      {/* Interactive lifecycle simulation */}
      <PreviewSection
        title="Tool Lifecycle"
        description="Simulate pending -> running -> success"
      >
        <View className="gap-3">
          <View className="flex-row gap-2">
            <Button variant="outline" size="sm" onPress={startSimulation} disabled={isPlaying}>
              <Text>Play</Text>
            </Button>
            <Button variant="outline" size="sm" onPress={reset}>
              <Text>Reset</Text>
            </Button>
          </View>
          <Tool status={currentState.status} defaultOpen>
            <ToolHeader title="database_query" />
            <ToolContent>
              <ToolInput input={toolInput} />
              {currentState.status === 'output-available' && (
                <ToolOutput output={toolOutput} />
              )}
            </ToolContent>
          </Tool>
        </View>
      </PreviewSection>

      {/* All states */}
      <PreviewSection title="Pending" description="input-streaming">
        <Tool status="input-streaming" defaultOpen>
          <ToolHeader title="database_query" />
          <ToolContent>
            <ToolInput input={{}} />
          </ToolContent>
        </Tool>
      </PreviewSection>

      <PreviewSection title="Running" description="input-available">
        <Tool status="input-available">
          <ToolHeader title="database_query" />
          <ToolContent>
            <ToolInput input={toolInput} />
          </ToolContent>
        </Tool>
      </PreviewSection>

      <PreviewSection title="Completed" description="output-available">
        <Tool status="output-available">
          <ToolHeader title="database_query" />
          <ToolContent>
            <ToolInput input={toolInput} />
            <ToolOutput output={toolOutput} />
          </ToolContent>
        </Tool>
      </PreviewSection>

      <PreviewSection title="Error" description="output-error">
        <Tool status="output-error">
          <ToolHeader title="database_query" />
          <ToolContent>
            <ToolInput input={toolInput} />
            <ToolOutput errorText="Connection timeout: Unable to reach database server" />
          </ToolContent>
        </Tool>
      </PreviewSection>
    </View>
  );
}
