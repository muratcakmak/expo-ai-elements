import { PromptInput } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function PromptInputDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Default state" description="Empty input with send button">
        <PromptInput />
      </PreviewSection>

      <PreviewSection title="Loading state" description="Shows stop button while generating">
        <PromptInput isLoading />
      </PreviewSection>
    </View>
  );
}
