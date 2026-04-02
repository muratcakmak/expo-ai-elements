import { WebPreview } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function WebPreviewDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Web preview" description="Embedded browser view">
        <WebPreview url="https://expo.dev" title="Expo - Build native apps" />
      </PreviewSection>
    </View>
  );
}
