import { TestResults } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function TestResultsDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Test suite" description="3 passing, 1 failing">
        <TestResults
          results={[
            { name: 'should render the login form', passed: true },
            { name: 'should validate email format', passed: true },
            { name: 'should submit with valid credentials', passed: true },
            {
              name: 'should display error on invalid password',
              passed: false,
              error: 'Expected "Invalid password" but received "Unexpected error"',
            },
          ]}
        />
      </PreviewSection>
    </View>
  );
}
