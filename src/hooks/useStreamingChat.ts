import { useChat, type UseChatOptions } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { generateAPIUrl } from '@/utils/generateAPIUrl';

/**
 * A thin wrapper around `useChat` from @ai-sdk/react that:
 *
 * 1. Swaps the default fetch transport for `expo/fetch` so that
 *    streaming works on native (Hermes) runtimes.
 * 2. Resolves the API URL in a platform-aware way via
 *    `generateAPIUrl`.
 *
 * All remaining options are forwarded verbatim to `useChat`.
 */
export function useStreamingChat(options: UseChatOptions = {}) {
  const { api = '/api/chat', fetch: userFetch, ...rest } = options;

  return useChat({
    api: generateAPIUrl(api),
    fetch: userFetch ?? expoFetch,
    ...rest,
  });
}
