import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function ReasoningDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Open reasoning" description="Expanded reasoning block with content">
        <Reasoning defaultOpen>
          <ReasoningTrigger />
          <ReasoningContent>
            The user is asking about sorting algorithms. I should compare time complexities and mention that quicksort is generally O(n log n) on average but O(n^2) in the worst case, while mergesort is always O(n log n) but requires extra space.
          </ReasoningContent>
        </Reasoning>
      </PreviewSection>
    </View>
  );
}
