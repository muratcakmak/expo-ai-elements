import {
  SchemaDisplay,
  SchemaDisplayContent,
  SchemaDisplayDescription,
  SchemaDisplayHeader,
  SchemaDisplayMethod,
  SchemaDisplayParameters,
  SchemaDisplayPath,
  SchemaDisplayResponse,
} from '@/components/ai/schema-display';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function SchemaDisplayDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="GET /api/users" description="Query params and response schema">
        <SchemaDisplay
          method="GET"
          path="/api/users"
          description="Retrieve a paginated list of users. Supports filtering by role and search query."
          parameters={[
            {
              name: 'page',
              type: 'number',
              description: 'Page number for pagination',
              location: 'query',
            },
            {
              name: 'limit',
              type: 'number',
              description: 'Number of results per page',
              location: 'query',
            },
            {
              name: 'role',
              type: 'string',
              description: 'Filter by user role (admin, user, moderator)',
              location: 'query',
            },
            {
              name: 'q',
              type: 'string',
              description: 'Search query for name or email',
              location: 'query',
            },
          ]}
          responseBody={[
            {
              name: 'data',
              type: 'array',
              required: true,
              description: 'Array of user objects',
              items: {
                name: 'user',
                type: 'object',
                properties: [
                  { name: 'id', type: 'string', required: true },
                  { name: 'name', type: 'string', required: true },
                  { name: 'email', type: 'string', required: true },
                  { name: 'role', type: 'string', required: true },
                  { name: 'avatar', type: 'string' },
                ],
              },
            },
            { name: 'total', type: 'number', required: true, description: 'Total number of users' },
            { name: 'page', type: 'number', required: true },
            { name: 'limit', type: 'number', required: true },
          ]}
        >
          <SchemaDisplayHeader>
            <SchemaDisplayMethod />
            <SchemaDisplayPath />
          </SchemaDisplayHeader>
          <SchemaDisplayDescription />
          <SchemaDisplayContent>
            <SchemaDisplayParameters />
            <SchemaDisplayResponse />
          </SchemaDisplayContent>
        </SchemaDisplay>
      </PreviewSection>
    </View>
  );
}
