import { useChat, type UseChatOptions } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';

import { generateAPIUrl } from '../utils/generateAPIUrl';

export type UseStreamingChatOptions<UI_MESSAGE extends UIMessage = UIMessage> =
  UseChatOptions<UI_MESSAGE> & {
    /**
     * API route path (e.g. "/api/chat") or absolute URL. Resolved to an
     * absolute URL on native via `generateAPIUrl`. Defaults to "/api/chat".
     */
    api?: string;
  };

/**
 * A thin wrapper around `useChat` from @ai-sdk/react (v3) that:
 *
 * 1. Wires a `DefaultChatTransport` using `expo/fetch` so that streaming
 *    works on native (Hermes) runtimes — the built-in transport uses the
 *    global `fetch`, which does not stream on Hermes.
 * 2. Resolves the API URL in a platform-aware way via `generateAPIUrl`
 *    (native `fetch` cannot resolve relative URLs).
 *
 * A caller-supplied `transport` takes precedence. All remaining options are
 * forwarded verbatim to `useChat`, whose v3 return shape exposes
 * `sendMessage`, `status` (ready | submitted | streaming | error) and
 * `messages[].parts`.
 */
export function useStreamingChat<UI_MESSAGE extends UIMessage = UIMessage>(
  options: UseStreamingChatOptions<UI_MESSAGE> = {},
) {
  const { api = '/api/chat', ...rest } = options;

  return useChat<UI_MESSAGE>({
    transport: new DefaultChatTransport({
      api: generateAPIUrl(api),
      fetch: expoFetch as unknown as typeof globalThis.fetch,
    }),
    ...rest,
  });
}
