import { OpenInChat } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function OpenInChatDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Open in chat" description="Continue the conversation in another app">
        <OpenInChat prompt="Explain the difference between REST and GraphQL APIs" />
      </PreviewSection>
    </View>
  );
}
