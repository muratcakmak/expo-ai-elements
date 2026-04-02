import { Shimmer } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function ShimmerDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Default" description="Pulsing text indicator">
        <Shimmer>Thinking...</Shimmer>
      </PreviewSection>

      <PreviewSection title="Loading variant">
        <Shimmer>Loading...</Shimmer>
      </PreviewSection>

      <PreviewSection title="Generating variant">
        <Shimmer>Generating...</Shimmer>
      </PreviewSection>
    </View>
  );
}
