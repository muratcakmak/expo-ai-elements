import { SpeechInput } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function SpeechInputDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Default state" description="Tap to start recording">
        <View className="items-center">
          <SpeechInput />
        </View>
      </PreviewSection>

      <PreviewSection title="Recording state" description="Pulsing animation while recording">
        <View className="items-center">
          <SpeechInput isRecording />
        </View>
      </PreviewSection>
    </View>
  );
}
