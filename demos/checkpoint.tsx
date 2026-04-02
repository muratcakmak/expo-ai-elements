import { Checkpoint } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function CheckpointDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Checkpoint with timestamp" description="Divider marking a point in the conversation">
        <Checkpoint label="Context updated" timestamp={new Date(2026, 3, 1, 14, 30)} />
      </PreviewSection>

      <PreviewSection title="Checkpoint without timestamp">
        <Checkpoint label="New session started" />
      </PreviewSection>
    </View>
  );
}
