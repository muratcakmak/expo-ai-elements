import { ChainOfThought } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function ChainOfThoughtDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Multi-step reasoning" description="2 complete, 1 active, 1 pending">
        <ChainOfThought
          steps={[
            { id: '1', title: 'Parse the user query', status: 'complete' },
            { id: '2', title: 'Search relevant documentation', status: 'complete' },
            { id: '3', title: 'Synthesize information', status: 'active' },
            { id: '4', title: 'Generate final response', status: 'pending' },
          ]}
        />
      </PreviewSection>
    </View>
  );
}
