import { Plan } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function PlanDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Execution plan" description="Steps in mixed states">
        <Plan
          steps={[
            { title: 'Analyze project structure', description: 'Scan the repo for relevant files', status: 'done' },
            { title: 'Update dependencies', description: 'Bump expo-router to v4', status: 'in-progress' },
            { title: 'Migrate navigation config', status: 'pending' },
            { title: 'Run test suite', description: 'Verify nothing is broken', status: 'pending' },
          ]}
        />
      </PreviewSection>
    </View>
  );
}
