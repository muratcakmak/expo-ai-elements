import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Globe, Search, Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from '../../../src/chatbot/chain-of-thought/ChainOfThought';

/**
 * ChainOfThought — a collapsible list of reasoning steps.
 *
 * Each ChainOfThoughtStep takes a `label`, optional `description`, `icon`, and
 * a `status` ('complete' | 'active' | 'pending' — which dims/highlights it).
 * Steps can embed ChainOfThoughtSearchResults badges.
 */

type StepStatus = 'complete' | 'active' | 'pending';

type StepData = {
  label: string;
  description?: string;
  icon?: typeof Search;
  searchResults?: string[];
};

const STEPS: StepData[] = [
  {
    label: 'Understanding the query',
    description: 'Parsing user intent and extracting key terms',
    icon: Sparkles,
  },
  {
    label: 'Searching for "React Native AI components"',
    icon: Search,
    searchResults: ['react-native.dev', 'expo.dev', 'github.com/vercel/ai'],
  },
  {
    label: 'Reading documentation pages',
    icon: Globe,
    description: 'Fetching and parsing 3 web pages for relevant information',
  },
  {
    label: 'Synthesizing findings',
    icon: Sparkles,
    description: 'Combining results into a coherent answer',
  },
  { label: 'Generating final response', icon: Sparkles },
];

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

function StreamingChainDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = useCallback(() => {
    setVisibleCount(0);
    setIsPlaying(true);
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsPlaying(false);
    setVisibleCount(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    if (visibleCount <= STEPS.length) {
      timerRef.current = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 900);
      return () => clearTimeout(timerRef.current);
    }
    setIsPlaying(false);
  }, [isPlaying, visibleCount]);

  const statusFor = (index: number): StepStatus => {
    if (index < visibleCount - 1) {
      return 'complete';
    }
    if (index === visibleCount - 1) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 12, color: '#6b7280' }}>
        Steps appear one by one; the active step is highlighted.
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <DemoButton label="Play" onPress={start} disabled={isPlaying} />
        <DemoButton label="Reset" onPress={reset} />
      </View>
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader>Reasoning about your query</ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          {STEPS.slice(0, Math.max(visibleCount, 0)).map((step, index) => (
            <ChainOfThoughtStep
              key={step.label}
              icon={step.icon}
              label={step.label}
              description={step.description}
              status={statusFor(index)}
            >
              {step.searchResults ? (
                <ChainOfThoughtSearchResults>
                  {step.searchResults.map((result) => (
                    <ChainOfThoughtSearchResult key={result}>
                      {result}
                    </ChainOfThoughtSearchResult>
                  ))}
                </ChainOfThoughtSearchResults>
              ) : null}
            </ChainOfThoughtStep>
          ))}
        </ChainOfThoughtContent>
      </ChainOfThought>
    </View>
  );
}

const meta: Meta = {
  title: 'Chatbot/ChainOfThought',
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
  render: () => <StreamingChainDemo />,
};

export const StaticComplete: StoryObj = {
  name: 'Static (all steps complete)',
  render: () => (
    <ChainOfThought defaultOpen>
      <ChainOfThoughtHeader>Chain of Thought</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep icon={Sparkles} label="Parse the user query" status="complete" />
        <ChainOfThoughtStep
          icon={Search}
          label="Search relevant documentation"
          status="complete"
        >
          <ChainOfThoughtSearchResults>
            <ChainOfThoughtSearchResult>docs.expo.dev</ChainOfThoughtSearchResult>
            <ChainOfThoughtSearchResult>reactnative.dev</ChainOfThoughtSearchResult>
          </ChainOfThoughtSearchResults>
        </ChainOfThoughtStep>
        <ChainOfThoughtStep icon={Sparkles} label="Synthesize information" status="complete" />
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};
