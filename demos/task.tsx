import { Task } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function TaskDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Queued">
        <Task title="Lint codebase" description="Waiting for previous tasks" status="queued" />
      </PreviewSection>

      <PreviewSection title="Running">
        <Task title="Build project" description="Compiling TypeScript..." status="running" />
      </PreviewSection>

      <PreviewSection title="Completed">
        <Task title="Run unit tests" description="All 42 tests passed" status="completed" />
      </PreviewSection>

      <PreviewSection title="Failed">
        <Task title="Deploy to production" description="Container health check failed" status="failed" />
      </PreviewSection>

      <PreviewSection title="Cancelled">
        <Task title="Send notifications" description="Cancelled by user" status="cancelled" />
      </PreviewSection>
    </View>
  );
}
