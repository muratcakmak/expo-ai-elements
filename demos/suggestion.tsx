import { Suggestions, Suggestion } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function SuggestionDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Suggestion chips" description="Horizontally scrollable prompt suggestions">
        <Suggestions>
          <Suggestion suggestion="Explain quantum computing" />
          <Suggestion suggestion="Write a haiku about code" />
          <Suggestion suggestion="Debug my React app" />
          <Suggestion suggestion="Summarize this article" />
          <Suggestion suggestion="Translate to Spanish" />
        </Suggestions>
      </PreviewSection>
    </View>
  );
}
