import { Suggestions, Suggestion } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Alert, View } from 'react-native';

const suggestions = [
  'What are the latest trends in AI?',
  'How does machine learning work?',
  'Explain quantum computing',
  'Best practices for React development',
  'Tell me about TypeScript benefits',
  'How to optimize database queries?',
  'What is the difference between SQL and NoSQL?',
  'Explain cloud computing basics',
  'What is WebAssembly?',
  'How do microservices work?',
];

export function SuggestionDemo() {
  const [selected, setSelected] = React.useState<string | null>(null);

  const handlePress = React.useCallback((suggestion: string) => {
    setSelected(suggestion);
    Alert.alert('Suggestion selected', suggestion);
  }, []);

  return (
    <View className="gap-6">
      <PreviewSection
        title="Suggestion chips"
        description="Horizontally scrollable prompt suggestions"
      >
        <View className="gap-3">
          <Suggestions>
            {suggestions.map((s) => (
              <Suggestion key={s} suggestion={s} onPress={handlePress} />
            ))}
          </Suggestions>
          {selected ? (
            <View className="bg-muted rounded-lg px-3 py-2">
              <Text className="text-muted-foreground text-xs">Last selected:</Text>
              <Text className="text-foreground text-sm font-medium">{selected}</Text>
            </View>
          ) : null}
        </View>
      </PreviewSection>

      <PreviewSection
        title="Static suggestions"
        description="Without scroll, fewer items"
      >
        <Suggestions>
          <Suggestion suggestion="Summarize this" onPress={handlePress} />
          <Suggestion suggestion="Translate to Spanish" onPress={handlePress} />
          <Suggestion suggestion="Make it shorter" onPress={handlePress} />
        </Suggestions>
      </PreviewSection>
    </View>
  );
}
