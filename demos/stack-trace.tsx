import { StackTrace } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function StackTraceDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="TypeError" description="Collapsible stack frames">
        <StackTrace
          error="TypeError: Cannot read properties of undefined (reading 'map')"
          frames={[
            { file: 'src/components/UserList.tsx', line: 42, function: 'UserList' },
            { file: 'src/hooks/useUsers.ts', line: 18, function: 'useUsers' },
            { file: 'node_modules/react/cjs/react.development.js', line: 1024, function: 'renderWithHooks' },
          ]}
        />
      </PreviewSection>
    </View>
  );
}
