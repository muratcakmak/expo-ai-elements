import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    system: 'You are a helpful assistant. Keep responses concise.',
  });

  return result.toDataStreamResponse();
}
