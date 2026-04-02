import { Shimmer } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function ShimmerDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Default" description="Standard shimmer text indicator">
        <Shimmer>Thinking...</Shimmer>
      </PreviewSection>

      <PreviewSection title="Different text variants" description="Multiple shimmer labels">
        <View className="gap-3">
          <Shimmer>Analyzing your code...</Shimmer>
          <Shimmer>Searching the web...</Shimmer>
          <Shimmer>Generating response...</Shimmer>
        </View>
      </PreviewSection>

      <PreviewSection title="Custom durations" description="Varying animation speeds">
        <View className="gap-3">
          <Shimmer duration={0.8}>Fast shimmer (0.8s)</Shimmer>
          <Shimmer duration={1.5}>Default shimmer (1.5s)</Shimmer>
          <Shimmer duration={3}>Slow shimmer (3s)</Shimmer>
        </View>
      </PreviewSection>

      <PreviewSection title="Composition" description="Shimmer within other elements">
        <View className="bg-muted/30 gap-2 rounded-lg p-3">
          <Shimmer>Loading results...</Shimmer>
          <View className="bg-muted h-3 w-3/4 rounded" />
          <View className="bg-muted h-3 w-1/2 rounded" />
        </View>
      </PreviewSection>
    </View>
  );
}
