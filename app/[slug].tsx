import { Preview } from '@/components/showcase/preview';
import { getComponent } from '@/lib/component-registry';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

// Import all demos
import { ShimmerDemo } from '@/demos/shimmer';
import { MessageDemo } from '@/demos/message';
import { MessageResponseDemo } from '@/demos/message-response';
import { ConversationDemo } from '@/demos/conversation';
import { SuggestionDemo } from '@/demos/suggestion';
import { PromptInputDemo } from '@/demos/prompt-input';
import { CodeBlockDemo } from '@/demos/code-block';
import { TerminalDemo } from '@/demos/terminal';
import { StackTraceDemo } from '@/demos/stack-trace';
import { TestResultsDemo } from '@/demos/test-results';
import { ReasoningDemo } from '@/demos/reasoning';
import { ChainOfThoughtDemo } from '@/demos/chain-of-thought';
import { ToolDemo } from '@/demos/tool';
import { PlanDemo } from '@/demos/plan';
import { TaskDemo } from '@/demos/task';
import { AgentDemo } from '@/demos/agent';
import { ArtifactDemo } from '@/demos/artifact';
import { FileTreeDemo } from '@/demos/file-tree';
import { CitationDemo } from '@/demos/citation';
import { WebPreviewDemo } from '@/demos/web-preview';
import { AttachmentsDemo } from '@/demos/attachments';
import { SchemaDisplayDemo } from '@/demos/schema-display';
import { SpeechInputDemo } from '@/demos/speech-input';
import { OpenInChatDemo } from '@/demos/open-in-chat';
import { CheckpointDemo } from '@/demos/checkpoint';
import { StreamingLatexDemo } from '@/demos/streaming-latex';

const DEMOS: Record<string, React.ComponentType> = {
  shimmer: ShimmerDemo,
  message: MessageDemo,
  'message-response': MessageResponseDemo,
  conversation: ConversationDemo,
  suggestion: SuggestionDemo,
  'prompt-input': PromptInputDemo,
  'code-block': CodeBlockDemo,
  terminal: TerminalDemo,
  'stack-trace': StackTraceDemo,
  'test-results': TestResultsDemo,
  reasoning: ReasoningDemo,
  'chain-of-thought': ChainOfThoughtDemo,
  tool: ToolDemo,
  plan: PlanDemo,
  task: TaskDemo,
  agent: AgentDemo,
  artifact: ArtifactDemo,
  'file-tree': FileTreeDemo,
  citation: CitationDemo,
  'web-preview': WebPreviewDemo,
  attachments: AttachmentsDemo,
  'schema-display': SchemaDisplayDemo,
  'speech-input': SpeechInputDemo,
  'open-in-chat': OpenInChatDemo,
  checkpoint: CheckpointDemo,
  'streaming-latex': StreamingLatexDemo,
};

// Error boundary to catch runtime crashes in individual demos
class DemoErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View className="bg-destructive/10 rounded-lg p-4">
          <Text className="text-destructive font-semibold">
            {this.props.name} crashed:
          </Text>
          <Text className="text-destructive mt-1 font-mono text-xs">
            {this.state.error.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function ComponentDemoScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const entry = getComponent(slug);
  const DemoComponent = DEMOS[slug];

  React.useEffect(() => {
    if (entry) {
      navigation.setOptions({ title: entry.name });
    }
  }, [entry, navigation]);

  if (!entry || !DemoComponent) {
    return (
      <View className="bg-background flex-1 items-center justify-center p-4">
        <Text className="text-foreground text-lg font-bold">Not found</Text>
        <Text className="text-muted-foreground mt-2">
          Component "{slug}" not found in registry.
        </Text>
      </View>
    );
  }

  return (
    <Preview title={entry.name} description={entry.description}>
      <DemoErrorBoundary name={entry.name}>
        <DemoComponent />
      </DemoErrorBoundary>
    </Preview>
  );
}
