import { Artifact, CodeBlock } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

const sampleCode = `export function Button({ label, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  );
}`;

export function ArtifactDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Code artifact" description="Artifact container with a code snippet">
        <Artifact title="Button.tsx" type="code">
          <CodeBlock code={sampleCode} language="tsx" />
        </Artifact>
      </PreviewSection>
    </View>
  );
}
