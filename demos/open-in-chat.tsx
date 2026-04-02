import {
  OpenIn,
  OpenInTrigger,
  OpenInContent,
  OpenInChatGPT,
  OpenInClaude,
  OpenInGemini,
} from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function OpenInChatDemo() {
  return (
    <View className="gap-6">
      <PreviewSection
        title="Open in chat"
        description="Dropdown with platform options to continue conversation"
      >
        <OpenIn query="Explain the difference between REST and GraphQL APIs">
          <OpenInTrigger />
          <OpenInContent>
            <OpenInChatGPT />
            <OpenInClaude />
            <OpenInGemini />
          </OpenInContent>
        </OpenIn>
      </PreviewSection>
    </View>
  );
}
