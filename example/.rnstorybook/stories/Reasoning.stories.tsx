import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '../../../src/chatbot/reasoning/Reasoning';

/**
 * Reasoning — a collapsible "thinking" block.
 *
 * Auto-opens while `isStreaming`, tracks a duration, then auto-closes ~1s
 * after streaming ends. The trigger renders a Shimmer while streaming and a
 * "Thought for N seconds" label afterwards. Content children must be wrapped
 * in <Text> (CollapsibleContent renders raw children inside a <View>).
 */

const REASONING_TEXT =
  'Let me think about this problem step by step.\n\n' +
  'First, I need to understand what the user is asking for.\n\n' +
  'They want a reasoning component that opens automatically when streaming ' +
  'begins and closes when streaming finishes. The component should be ' +
  'composable and follow existing patterns in the codebase.\n\n' +
  'This seems like a collapsible component with state management would be the ' +
  'right approach. I should use React context to share streaming state between ' +
  'the trigger and content.';

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

function DemoButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>{label}</Text>
    </Pressable>
  );
}

function StreamingReasoningDemo() {
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [tokenIndex, setTokenIndex] = useState(0);
  const tokensRef = useRef<string[]>([]);

  const start = useCallback(() => {
    tokensRef.current = chunkIntoTokens(REASONING_TEXT);
    setContent('');
    setTokenIndex(0);
    setIsStreaming(true);
  }, []);

  const reset = useCallback(() => {
    setContent('');
    setTokenIndex(0);
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    if (!isStreaming || tokenIndex >= tokensRef.current.length) {
      if (isStreaming && tokenIndex >= tokensRef.current.length) {
        setIsStreaming(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setContent((prev) => prev + tokensRef.current[tokenIndex]);
      setTokenIndex((prev) => prev + 1);
    }, 25);

    return () => clearTimeout(timer);
  }, [isStreaming, tokenIndex]);

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 12, color: '#6b7280' }}>
        Token-by-token stream with auto open/close and duration tracking.
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <DemoButton label="Play" onPress={start} disabled={isStreaming} />
        <DemoButton label="Reset" onPress={reset} />
      </View>
      <Reasoning isStreaming={isStreaming}>
        <ReasoningTrigger />
        <ReasoningContent>
          <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
            {content}
          </Text>
        </ReasoningContent>
      </Reasoning>
    </View>
  );
}

const meta: Meta = {
  title: 'Chatbot/Reasoning',
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16, backgroundColor: '#fff' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

export const Streaming: StoryObj = {
  name: 'Streaming simulation',
  render: () => <StreamingReasoningDemo />,
};

export const StaticExpanded: StoryObj = {
  name: 'Static (default open)',
  render: () => (
    <Reasoning defaultOpen>
      <ReasoningTrigger />
      <ReasoningContent>
        <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
          The user is asking about sorting algorithms. I should compare time
          complexities and mention that quicksort is generally O(n log n) on
          average but O(n^2) in the worst case, while mergesort is always O(n log
          n) but requires extra space.
        </Text>
      </ReasoningContent>
    </Reasoning>
  ),
};
