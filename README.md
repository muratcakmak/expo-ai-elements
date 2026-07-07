# expo-ai-elements

A React Native port of [Vercel AI Elements](https://github.com/vercel/ai-elements) — a set of composable components for building AI chat interfaces on Expo. It brings the AI Elements component API to native iOS/Android, styled with Tailwind (via [Uniwind](https://github.com/nightlabs/uniwind)) and wired for streaming with the [AI SDK](https://ai-sdk.dev).

48 AI components across `chatbot/`, `code/`, `voice/`, `workflow/`, and `utilities/`, plus a set of shadcn-style primitives under `primitives/`.

Credit to the Vercel team for the original web AI Elements — this library mirrors its component names and prop shapes where practical.

## Requirements

- Expo SDK **57+**
- React Native **0.86+**
- **New Architecture (Fabric)** enabled
- **Uniwind / Tailwind CSS v4**
- A **dev client or prebuild** — the library depends on native modules and Fabric, so it does **not** run in Expo Go.

## Install

```bash
bun add expo-ai-elements
```

Peer requirements: `expo >=57`, `react >=19`, `react-native >=0.86`.

The package pulls native modules as dependencies (`react-native-reanimated` 4, `react-native-worklets`, `react-native-gesture-handler`, `@gorhom/bottom-sheet`, `react-native-streamdown`, `react-native-enriched-markdown`, `react-native-svg`, `react-native-webview`, `expo-audio`, `expo-image`, `expo-document-picker`, `expo-clipboard`, and more). After installing, rebuild the dev client (`bunx expo run:ios` / `run:android`) so autolinking picks them up.

## Required consumer setup

The library uses `react-native-worklets` **bundle mode** (a `react-native-streamdown` 0.2 requirement) and Uniwind. Three files in your app must be configured. These mirror the working setup in [`example/`](example) — read `example/babel.config.js`, `example/metro.config.js`, and `example/global.css` for the reference.

### 1. `babel.config.js`

The worklets plugin must be **last**:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Must be last (react-native-streamdown 0.2 requirement)
      ['react-native-worklets/plugin', { bundleMode: true, workletizableModules: ['remend'] }],
    ],
  };
};
```

### 2. `metro.config.js`

Wire worklets bundle mode and the Uniwind plugin:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const { getBundleModeMetroConfig } = require('react-native-worklets/bundleMode');
const path = require('path');

let config = getDefaultConfig(__dirname);

// react-native-worklets bundle mode (react-native-streamdown requirement)
config.watchFolders = [
  ...(config.watchFolders ?? []),
  path.resolve(__dirname, 'node_modules/react-native-worklets/.worklets'),
];
config = getBundleModeMetroConfig(config);

module.exports = withUniwindConfig(config, { cssEntryFile: './global.css' });
```

> In a monorepo where the library source lives outside `node_modules`, you also need `resolveRequest` singleton remapping so packages like `react-native-reanimated`, `react-native-worklets`, and `@gorhom/bottom-sheet` resolve to a single copy. See [`example/metro.config.js`](example/metro.config.js) for that full pattern.

### 3. `global.css`

Import Tailwind + Uniwind and point `@source` at the package so its `className` usages are compiled:

```css
@import 'tailwindcss';
@import 'uniwind';
@source "../node_modules/expo-ai-elements/src";
```

Then import it once at your app root (e.g. `app/_layout.tsx`):

```tsx
import '../global.css';
```

## Quickstart

```tsx
import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  useStreamingChat,
} from 'expo-ai-elements';

export default function Chat() {
  const { messages, sendMessage, status } = useStreamingChat({ api: '/api/chat' });

  return (
    <>
      <Conversation>
        <ConversationContent>
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts.map((part, i) =>
                  part.type === 'text' ? (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>

      <PromptInput onSubmit={({ text }) => text && sendMessage({ text })}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask anything…" />
          <PromptInputSubmit status={status} />
        </PromptInputBody>
      </PromptInput>
    </>
  );
}
```

`useStreamingChat` wraps `useChat` from `@ai-sdk/react` and uses `expo/fetch` so streaming works on Hermes. Point `api` at a route that returns an AI SDK UI-message stream (see [`example/app/api/chat+api.ts`](example/app/api/chat+api.ts)).

## Example app

A runnable Expo Router app lives in [`example/`](example):

```bash
cd example
bun install
bunx expo run:ios
```

## Component inventory

### Chatbot (`chatbot/`)

| Component | Purpose |
|---|---|
| `Conversation` | Auto-scrolling message list container |
| `Message` | Message row with role-based alignment |
| `MessageResponse` | Streaming markdown message body |
| `PromptInput` | Composer with attachments, tools, submit |
| `Suggestions` | Tappable suggestion chips |
| `Reasoning` | Collapsible model thinking block |
| `Sources` | Collapsible list of cited sources |
| `InlineCitation` | Inline citation with source carousel |
| `Attachments` | File/image attachment display + preview |
| `ModelSelector` | Searchable model picker |
| `Tool` | Tool call header, input, and output |
| `Confirmation` | Approve/reject tool confirmation |
| `Task` | Collapsible task list with files |
| `Plan` | Collapsible plan with header/footer |
| `ChainOfThought` | Step-by-step reasoning with search results |
| `Agent` | Agent status, instructions, and tools |
| `Checkpoint` | Conversation checkpoint marker |
| `Context` | Token usage / context window display |
| `Queue` | Queued messages and todo sections |
| `Shimmer` | Streaming-text shimmer placeholder |

### Code (`code/`)

| Component | Purpose |
|---|---|
| `CodeBlock` | Syntax-highlighted code with copy |
| `Snippet` | Inline copyable command snippet |
| `Terminal` | Terminal output with ANSI parsing |
| `FileTree` | Collapsible file/folder tree |
| `StackTrace` | Expandable error stack trace |
| `TestResults` | Test suite results with progress |
| `SchemaDisplay` | API request/response schema viewer |
| `EnvironmentVariables` | Masked env var list with copy |
| `Commit` | Git commit with file diff stats |
| `PackageInfo` | Package name, version, dependencies |
| `Artifact` | Titled artifact panel with actions |
| `JSXPreview` | Sandboxed JSX preview (WebView) |
| `Sandbox` | Sandbox container header/body |
| `WebPreview` | WebView with URL bar and console |

### Voice (`voice/`)

| Component | Purpose |
|---|---|
| `AudioPlayer` | Audio playback UI (expo-audio) |
| `SpeechInput` | Speech-to-text input |
| `Transcription` | Streaming transcription with timestamps |
| `MicSelector` | Audio input device picker |
| `VoiceSelector` | Voice picker with audio preview |
| `Persona` | Persona/avatar display |

### Workflow (`workflow/`)

| Component | Purpose |
|---|---|
| `FlowCanvas` | Node/edge flow graph (WebView + @xyflow) |

### Utilities (`utilities/`)

| Component | Purpose |
|---|---|
| `AIImage` | AI-generated image display (expo-image) |
| `OpenIn` | Deep-link "open in chat" provider menu |

### Primitives (`primitives/`)

shadcn-style building blocks used across the library: `Accordion`, `Badge`, `Button`, `Card`, `Collapsible`, `Command`, `Dialog`, `Drawer`, `DropdownMenu`, `HoverCard`, `InputGroup`, `Progress`, `ScrollArea`, `Select`, `Separator`, `Spinner`, `Tooltip`.

Plus the `useStreamingChat` hook (`hooks/`), theme tokens (`theme/`), and helpers (`utils/`).

## License

MIT — see [LICENSE](LICENSE).
