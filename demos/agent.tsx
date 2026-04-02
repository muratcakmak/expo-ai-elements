import {
  Agent,
  AgentHeader,
  AgentContent,
  AgentInstructions,
  AgentTools,
  AgentTool,
  AgentOutput,
} from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

const webSearchTool = {
  description: 'Search the web for information',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'The search query' },
    },
    required: ['query'],
  },
};

const readUrlTool = {
  description: 'Read and parse a URL',
  inputSchema: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'The URL to read' },
    },
    required: ['url'],
  },
};

const summarizeTool = {
  description: 'Summarize text into key points',
  inputSchema: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'The text to summarize' },
      maxPoints: { type: 'number', description: 'Maximum number of key points' },
    },
    required: ['text'],
  },
};

const outputSchema = `z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  score: z.number(),
  summary: z.string(),
})`;

export function AgentDemo() {
  return (
    <View className="gap-6">
      <PreviewSection
        title="Research Assistant Agent"
        description="Agent with 3 tools, instructions, and output schema"
      >
        <Agent>
          <AgentHeader model="openai/gpt-5.2-pro" name="Research Assistant" />
          <AgentContent>
            <AgentInstructions>
              You are a helpful research assistant. Your job is to search the web for information and
              summarize findings for the user. Always cite your sources and provide accurate,
              up-to-date information.
            </AgentInstructions>
            <AgentTools>
              <AgentTool tool={webSearchTool} />
              <AgentTool tool={readUrlTool} />
              <AgentTool tool={summarizeTool} />
            </AgentTools>
            <AgentOutput schema={outputSchema} />
          </AgentContent>
        </Agent>
      </PreviewSection>

      <PreviewSection title="Minimal Agent" description="Agent with just a name">
        <Agent>
          <AgentHeader name="Code Assistant" />
          <AgentContent>
            <AgentInstructions>
              You help developers write clean, maintainable code. Focus on best practices and
              performance.
            </AgentInstructions>
          </AgentContent>
        </Agent>
      </PreviewSection>
    </View>
  );
}
