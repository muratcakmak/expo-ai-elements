import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    // convertToModelMessages returns a Promise in ai v6
    messages: await convertToModelMessages(messages),
    system: 'You are a helpful assistant. Keep responses concise.',
  });

  return result.toUIMessageStreamResponse();
}
