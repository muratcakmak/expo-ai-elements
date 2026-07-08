import { useChat, type UseChatOptions } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  type ChatTransport,
  type UIMessage,
} from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useMemo } from 'react';

import { generateAPIUrl } from '../utils/generateAPIUrl';

/**
 * Options for {@link useStreamingChat}.
 *
 * A mutually-exclusive union so the streaming guarantee can't be silently
 * voided by a caller-supplied transport:
 *
 * - Let the hook build the streaming `expo/fetch` transport for you, optionally
 *   pointing it at a route/host via `api` / `baseUrl`. `transport` is disallowed.
 * - Own the transport entirely by passing `transport`. `api` / `baseUrl` are
 *   then disallowed because the hook no longer resolves the URL.
 *
 * All other `useChat` options are forwarded verbatim.
 */
export type UseStreamingChatOptions<UI_MESSAGE extends UIMessage = UIMessage> =
  UseChatOptions<UI_MESSAGE> &
    (
      | {
          /**
           * API route path (e.g. "/api/chat") or absolute URL. Resolved to an
           * absolute URL on native via `generateAPIUrl`. Defaults to "/api/chat".
           */
          api?: string;
          /** Override for the API host (e.g. a hosted API origin). */
          baseUrl?: string;
          transport?: never;
        }
      | {
          /** Caller-owned transport. The hook forwards it as-is. */
          transport: ChatTransport<UI_MESSAGE>;
          api?: never;
          baseUrl?: never;
        }
    );

/**
 * A thin wrapper around `useChat` from @ai-sdk/react (v3) that:
 *
 * 1. Wires a `DefaultChatTransport` using `expo/fetch` so that streaming
 *    works on native (Hermes) runtimes — the built-in transport uses the
 *    global `fetch`, which does not stream on Hermes.
 * 2. Resolves the API URL in a platform-aware way via `generateAPIUrl`
 *    (native `fetch` cannot resolve relative URLs).
 *
 * Note: `api`/`baseUrl` are captured at mount — `useChat` snapshots the
 * transport, so changing them after mount has no effect. Pass your own
 * `transport` instead to opt out of the built-in one. The v3 return shape
 * exposes `sendMessage`, `status` (ready | submitted | streaming | error) and
 * `messages[].parts`.
 */
export function useStreamingChat<UI_MESSAGE extends UIMessage = UIMessage>(
  options: UseStreamingChatOptions<UI_MESSAGE> = {},
) {
  const { api = '/api/chat', baseUrl, transport: callerTransport, ...rest } =
    options;

  // Memoized so the transport keeps a stable identity across re-renders.
  // `callerTransport` is included so we never call `generateAPIUrl` (which can
  // throw in a production build without an origin) when the caller owns the
  // transport; in that case `api`/`baseUrl` are `never`, so this is the guard.
  const transport = useMemo(
    () =>
      callerTransport ??
      new DefaultChatTransport<UI_MESSAGE>({
        api: generateAPIUrl(api, baseUrl),
        // expo/fetch streams on Hermes; its FetchResponse isn't structurally a
        // DOM `Response`, hence the cast to the transport's expected fetch type.
        fetch: expoFetch as unknown as typeof globalThis.fetch,
      }),
    [api, baseUrl, callerTransport],
  );

  return useChat<UI_MESSAGE>({
    transport,
    ...rest,
  });
}
