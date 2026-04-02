import { Agent } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function AgentDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Thinking">
        <Agent name="Code Assistant" status="thinking" action="Analyzing your codebase..." />
      </PreviewSection>

      <PreviewSection title="Acting">
        <Agent name="Code Assistant" status="acting" action="Refactoring UserList component" />
      </PreviewSection>

      <PreviewSection title="Complete">
        <Agent name="Code Assistant" status="complete" />
      </PreviewSection>
    </View>
  );
}
