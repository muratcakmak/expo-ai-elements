import { Tool } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function ToolDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Pending">
        <Tool name="web_search" args={{ query: 'expo router v4' }} status="pending" />
      </PreviewSection>

      <PreviewSection title="Running">
        <Tool name="web_search" args={{ query: 'expo router v4' }} status="running" />
      </PreviewSection>

      <PreviewSection title="Success">
        <Tool
          name="web_search"
          args={{ query: 'expo router v4' }}
          result="Found 12 results for 'expo router v4'"
          status="success"
        />
      </PreviewSection>

      <PreviewSection title="Error">
        <Tool
          name="web_search"
          args={{ query: 'expo router v4' }}
          result="NetworkError: Request timed out after 30s"
          status="error"
        />
      </PreviewSection>
    </View>
  );
}
