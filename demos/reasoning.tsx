import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PreviewSection } from '@/components/showcase/preview';
import * as React from 'react';
import { View } from 'react-native';

const reasoningText =
  'Let me think about this problem step by step.\n\n' +
  'First, I need to understand what the user is asking for.\n\n' +
  'They want a reasoning component that opens automatically when streaming begins ' +
  'and closes when streaming finishes. The component should be composable and follow ' +
  'existing patterns in the codebase.\n\n' +
  'This seems like a collapsible component with state management would be the right approach. ' +
  'I should use React context to share streaming state between the trigger and content.';

function chunkIntoTokens(text: string): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const chunkSize = Math.floor(Math.random() * 2) + 3;
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize;
  }
  return chunks;
}

export function ReasoningDemo() {
  const [content, setContent] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [currentTokenIndex, setCurrentTokenIndex] = React.useState(0);
  const tokensRef = React.useRef<string[]>([]);

  const startStreaming = React.useCallback(() => {
    tokensRef.current = chunkIntoTokens(reasoningText);
    setContent('');
    setCurrentTokenIndex(0);
    setIsStreaming(true);
  }, []);

  const reset = React.useCallback(() => {
    setContent('');
    setCurrentTokenIndex(0);
    setIsStreaming(false);
  }, []);

  React.useEffect(() => {
    if (!isStreaming || currentTokenIndex >= tokensRef.current.length) {
      if (isStreaming) {
        setIsStreaming(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setContent((prev) => prev + tokensRef.current[currentTokenIndex]);
      setCurrentTokenIndex((prev) => prev + 1);
    }, 25);

    return () => clearTimeout(timer);
  }, [isStreaming, currentTokenIndex]);

  return (
    <View className="gap-6">
      <PreviewSection
        title="Streaming Simulation"
        description="Token-by-token text with auto-open/close and duration tracking"
      >
        <View className="gap-3">
          <View className="flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onPress={startStreaming}
              disabled={isStreaming}
            >
              <Text>Play</Text>
            </Button>
            <Button variant="outline" size="sm" onPress={reset}>
              <Text>Reset</Text>
            </Button>
          </View>
          <Reasoning isStreaming={isStreaming}>
            <ReasoningTrigger />
            <ReasoningContent>{content}</ReasoningContent>
          </Reasoning>
        </View>
      </PreviewSection>

      <PreviewSection
        title="Static Reasoning"
        description="Expanded reasoning block with content"
      >
        <Reasoning defaultOpen>
          <ReasoningTrigger />
          <ReasoningContent>
            The user is asking about sorting algorithms. I should compare time complexities and
            mention that quicksort is generally O(n log n) on average but O(n^2) in the worst case,
            while mergesort is always O(n log n) but requires extra space.
          </ReasoningContent>
        </Reasoning>
      </PreviewSection>
    </View>
  );
}
