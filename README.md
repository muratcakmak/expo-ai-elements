# expo-ai-elements

AI chat UI components for React Native — the mobile equivalent of [Vercel AI Elements](https://elements.ai-sdk.dev).

Built with [React Native Reusables](https://reactnativereusables.com) (shadcn/ui for RN) + [Uniwind](https://uniwind.dev) (Tailwind CSS for RN).

## Components

**25 components** across 6 categories:

| Category | Components |
|---|---|
| **Chatbot** | Conversation, Message, MessageResponse, Suggestion, Checkpoint, Citation, Streaming LaTeX |
| **Code** | CodeBlock, Terminal, StackTrace, TestResults, SchemaDisplay |
| **Reasoning** | Reasoning, ChainOfThought, Tool, Plan, Task, Agent |
| **Content** | Artifact, FileTree, WebPreview, Attachments |
| **Input** | PromptInput, SpeechInput, OpenInChat |
| **Utilities** | Shimmer |

## Features

- Streaming markdown rendering with LaTeX math support (`$inline$` and `$$block$$`)
- Dark/light mode with Uniwind theming
- Drawer sidebar with component showcase (Storybook-like)
- Full chat demo with simulated streaming
- Built on Expo SDK 55, React Native 0.83, React 19

## Getting Started

```bash
# Install dependencies
bun install

# Generate native directories
npx expo prebuild

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

## Stack

- **Expo SDK 55** (ejected via prebuild)
- **React Native 0.83** + React 19.2
- **Uniwind 1.6** — Tailwind CSS bindings for RN
- **React Native Reusables** — shadcn/ui base components
- **react-native-enriched-markdown** — native markdown + code highlighting + LaTeX
- **Vercel AI SDK** (`ai` + `@ai-sdk/react`) — `useChat` / `useCompletion` hooks
- **react-native-reanimated** — animations
- **lucide-react-native** — icons

## Project Structure

```
app/
  _layout.tsx          # Drawer sidebar layout
  index.tsx            # Home screen with component grid
  chat.tsx             # Full chat demo
  [slug].tsx           # Dynamic component preview route
components/
  ai/                  # AI chat components (the library)
    message.tsx
    conversation.tsx
    prompt-input.tsx
    reasoning.tsx
    code-block.tsx
    ... (25 total)
  ui/                  # Base UI components (Reusables)
  showcase/            # Sidebar + preview wrappers
demos/                 # Demo files for each component
lib/
  component-registry.ts  # Component catalog for sidebar nav
```

## Adding Components to Your App

Components follow the shadcn/ui copy-paste pattern. Copy any file from `components/ai/` into your project and import it:

```tsx
import { Message, MessageContent, MessageResponse } from '@/components/ai';
import { PromptInput } from '@/components/ai';

<Message role="assistant">
  <MessageContent>
    <MessageResponse isStreaming={isLoading}>
      {streamingText}
    </MessageResponse>
  </MessageContent>
</Message>
<PromptInput onSubmit={sendMessage} isLoading={isLoading} />
```

## Known Limitations

- **Streaming jank**: `EnrichedMarkdownText` recalculates native layout on every prop change. Updates are throttled to ~80ms to mitigate. The proper fix (`react-native-streamdown` with worklet-based processing) requires `react-native-worklets` 0.8.0-bundle-mode-preview which crashes on Expo SDK 55 due to Hermes incompatibility. Will be resolved when worklets bundle mode reaches stable.
- **LaTeX block math** (`$$...$$`) requires `flavor="github"` on `EnrichedMarkdownText`.

## License

MIT
