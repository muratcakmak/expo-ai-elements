import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
  ChainOfThoughtContent,
  type ChainOfThoughtStepStatus,
} from '@/components/ai';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PreviewSection } from '@/components/showcase/preview';
import { GlobeIcon, SearchIcon, SparklesIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

type StepData = {
  label: string;
  description?: string;
  icon?: typeof SearchIcon;
  searchResults?: string[];
};

const STEPS: StepData[] = [
  {
    label: 'Understanding the query',
    description: 'Parsing user intent and extracting key terms',
    icon: SparklesIcon,
  },
  {
    label: 'Searching for "React Native AI components"',
    icon: SearchIcon,
    searchResults: ['react-native.dev', 'expo.dev', 'github.com/vercel/ai'],
  },
  {
    label: 'Reading documentation pages',
    icon: GlobeIcon,
    description: 'Fetching and parsing 3 web pages for relevant information',
  },
  {
    label: 'Synthesizing findings',
    icon: SparklesIcon,
    description: 'Combining results into a coherent answer',
  },
  {
    label: 'Generating final response',
    icon: SparklesIcon,
  },
];

export function ChainOfThoughtDemo() {
  const [visibleCount, setVisibleCount] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startSimulation = React.useCallback(() => {
    setVisibleCount(0);
    setIsPlaying(true);
  }, []);

  React.useEffect(() => {
    if (!isPlaying) return;

    if (visibleCount <= STEPS.length) {
      timerRef.current = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timerRef.current);
    }
    setIsPlaying(false);
  }, [isPlaying, visibleCount]);

  const reset = React.useCallback(() => {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setVisibleCount(0);
  }, []);

  const getStepStatus = (index: number): ChainOfThoughtStepStatus => {
    if (index < visibleCount - 1) return 'complete';
    if (index === visibleCount - 1) return 'active';
    return 'pending';
  };

  return (
    <View className="gap-6">
      <PreviewSection
        title="Streaming Simulation"
        description="Steps appear one by one with active step pulsing"
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
          <ChainOfThought defaultOpen>
            <ChainOfThoughtHeader>Reasoning about your query</ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              {STEPS.slice(0, Math.max(visibleCount, 0)).map((step, index) => (
                <ChainOfThoughtStep
                  key={step.label}
                  icon={step.icon}
                  label={step.label}
                  description={step.description}
                  status={getStepStatus(index)}
                >
                  {step.searchResults && (
                    <ChainOfThoughtSearchResults>
                      {step.searchResults.map((result) => (
                        <ChainOfThoughtSearchResult key={result}>
                          <Text className="text-secondary-foreground text-xs">{result}</Text>
                        </ChainOfThoughtSearchResult>
                      ))}
                    </ChainOfThoughtSearchResults>
                  )}
                </ChainOfThoughtStep>
              ))}
            </ChainOfThoughtContent>
          </ChainOfThought>
        </View>
      </PreviewSection>

      <PreviewSection
        title="Static Chain of Thought"
        description="All steps complete with search results"
      >
        <ChainOfThought defaultOpen>
          <ChainOfThoughtHeader>Chain of Thought</ChainOfThoughtHeader>
          <ChainOfThoughtContent>
            <ChainOfThoughtStep
              icon={SparklesIcon}
              label="Parse the user query"
              status="complete"
            />
            <ChainOfThoughtStep
              icon={SearchIcon}
              label="Search relevant documentation"
              status="complete"
            >
              <ChainOfThoughtSearchResults>
                <ChainOfThoughtSearchResult>
                  <Text className="text-secondary-foreground text-xs">docs.expo.dev</Text>
                </ChainOfThoughtSearchResult>
                <ChainOfThoughtSearchResult>
                  <Text className="text-secondary-foreground text-xs">reactnative.dev</Text>
                </ChainOfThoughtSearchResult>
              </ChainOfThoughtSearchResults>
            </ChainOfThoughtStep>
            <ChainOfThoughtStep
              icon={SparklesIcon}
              label="Synthesize information"
              status="complete"
            />
          </ChainOfThoughtContent>
        </ChainOfThought>
      </PreviewSection>
    </View>
  );
}
