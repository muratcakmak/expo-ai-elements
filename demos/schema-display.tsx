import { SchemaDisplay } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

const userProfile = {
  name: 'Jane Doe',
  age: 28,
  email: 'jane@example.com',
  isVerified: true,
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
  },
  tags: ['developer', 'designer'],
};

export function SchemaDisplayDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Nested JSON object" description="User profile with address">
        <SchemaDisplay data={userProfile} />
      </PreviewSection>
    </View>
  );
}
