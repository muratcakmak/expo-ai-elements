import { Terminal } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

const npmOutput = `$ npm install expo-router
added 127 packages in 4.2s

12 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities`;

export function TerminalDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="npm install output" description="Terminal with title bar">
        <Terminal title="Terminal">{npmOutput}</Terminal>
      </PreviewSection>
    </View>
  );
}
