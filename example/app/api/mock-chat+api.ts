import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai';

/**
 * Keyless mock chat endpoint.
 *
 * Instead of calling a real provider (which needs an API key), this builds a
 * valid UIMessage stream by hand with `createUIMessageStream` and serializes it
 * to SSE with `createUIMessageStreamResponse` — the same wire format that
 * `streamText().toUIMessageStreamResponse()` produces, so it is fully
 * compatible with `DefaultChatTransport` / `useChat` on the client.
 *
 * The chunk sequence mirrors a real assistant turn:
 *   start -> text-start -> text-delta* -> text-end -> finish
 */
export async function POST(request: Request) {
  const body = (await request.json()) as { messages?: UIMessage[] };

  const lastUserMessage = body.messages
    ?.filter((message) => message.role === 'user')
    .at(-1);

  const userText = (lastUserMessage?.parts ?? [])
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim();

  const reply = userText
    ? `You said: "${userText}". This is a canned, keyless streaming reply produced by the mock endpoint — no API key required.`
    : 'Hello! This is a canned, keyless streaming reply produced by the mock endpoint — no API key required.';

  const words = reply.split(' ');

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = 'mock-assistant-text';

      writer.write({ type: 'start' });
      writer.write({ type: 'text-start', id });

      for (let index = 0; index < words.length; index += 1) {
        writer.write({
          type: 'text-delta',
          id,
          delta: index === 0 ? words[index] : ` ${words[index]}`,
        });
        await new Promise((resolve) => setTimeout(resolve, 40));
      }

      writer.write({ type: 'text-end', id });
      writer.write({ type: 'finish' });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
