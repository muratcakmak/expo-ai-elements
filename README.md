# expo-ai-elements

**Open-source AI chat UI components for React Native** — bring ChatGPT-level interfaces to your mobile app in minutes.

The React Native port of [Vercel AI Elements](https://elements.ai-sdk.dev). Drop-in, composable, and ready for production.

Built with [React Native Reusables](https://reactnativereusables.com) (shadcn/ui for RN) + [Uniwind](https://uniwind.dev) (Tailwind CSS for RN).

## Why expo-ai-elements?

Building AI chat UIs on mobile is painful. You need streaming markdown, code blocks with monospace fonts, LaTeX rendering, tool call displays, reasoning traces — all performing smoothly at 60fps on native.

**expo-ai-elements** gives you 25 production-ready components that handle all of this out of the box:

- **Worklet-powered streaming** — markdown parsing runs on a separate thread via `react-native-streamdown`, zero jank on the UI thread
- **Native markdown with LaTeX** — inline `$math$` and block `$$equations$$` rendered natively
- **Copy-paste architecture** — follows the shadcn/ui pattern, you own every line of code
- **Dark/light mode** — automatic theme support via Uniwind
- **Vercel AI SDK compatible** — works with `useChat` and `useCompletion` hooks

## Components

**25 components** across 6 categories:

| Category | Components |
|---|---|
| **Chat** | Conversation, Message, MessageResponse, Suggestion, Checkpoint, Citation, Streaming LaTeX |
| **Code** | CodeBlock, Terminal, StackTrace, TestResults, SchemaDisplay |
| **Reasoning** | Reasoning, ChainOfThought, Tool, Plan, Task, Agent |
| **Content** | Artifact, FileTree, WebPreview, Attachments |
| **Input** | PromptInput, SpeechInput, OpenInChat |
| **Utilities** | Shimmer |

## Quick Start

```bash
# Install dependencies
bun install

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

The app includes a built-in component showcase (Storybook-like) with interactive demos for every component, plus a full chat demo with simulated streaming.

## Usage

Components follow the shadcn/ui copy-paste pattern. Copy any file from `components/ai/` into your project:

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

Every component is composable with sub-components for full customization:

```tsx
import { CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockCopyButton, CodeBlockContent } from '@/components/ai';

<CodeBlock code={code} language="typescript">
  <CodeBlockHeader>
    <CodeBlockTitle>typescript</CodeBlockTitle>
    <CodeBlockCopyButton />
  </CodeBlockHeader>
  <CodeBlockContent code={code} showLineNumbers />
</CodeBlock>
```

## Stack

| Layer | Technology |
|---|---|
| **Framework** | Expo SDK 55, React Native 0.83, React 19 |
| **Styling** | Uniwind (Tailwind CSS for RN) |
| **Base UI** | React Native Reusables (shadcn/ui) |
| **Markdown** | react-native-enriched-markdown + react-native-streamdown |
| **Streaming** | react-native-worklets 0.8 (bundle mode) |
| **AI SDK** | Vercel AI SDK (`ai` + `@ai-sdk/react`) |
| **Animations** | react-native-reanimated 4.3 |
| **Icons** | lucide-react-native |

## Project Structure

```
app/
  _layout.tsx          # Drawer sidebar layout
  index.tsx            # Home screen with component grid
  chat.tsx             # Full chat demo
  [slug].tsx           # Dynamic component preview route
components/
  ai/                  # AI chat components (the library)
  ui/                  # Base UI components (Reusables)
  showcase/            # Sidebar + preview wrappers
demos/                 # Interactive demos for each component
lib/
  fonts.ts             # Platform monospace font config
  component-registry.ts  # Component catalog for sidebar nav
```

## Known Limitations

- **LaTeX block math** (`$$...$$`) requires `flavor="github"` on `EnrichedMarkdownText` when used directly (handled automatically by `StreamdownText`).

## License

MIT
