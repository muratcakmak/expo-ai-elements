# Expo AI Elements — Architecture Plan

## Full-Parity React Native Rebuild of Vercel AI Elements

**Target Stack:** Expo SDK 55 (dev client) · Uniwind (Tailwind CSS v4) · React Native New Architecture (Fabric)

---

## 1. Complete Component Inventory

The web AI Elements library exports **55+ components** across 5 categories. Every one of them is mapped below to its React Native implementation strategy.

### 1.1 Chatbot Components (17)

| Web Component | RN Strategy | Key RN Primitives / Libraries |
|---|---|---|
| **Conversation** | Rewrite → `ScrollView`/`FlashList` with stick-to-bottom behavior | `@shopify/flash-list`, `react-native-reanimated` for scroll animation |
| **ConversationContent** | Rewrite → inner content wrapper | `View` with Uniwind className |
| **ConversationEmptyState** | Rewrite → simple View/Text composition | `View`, `Text`, `MotiView` for fade-in |
| **ConversationScrollButton** | Rewrite → floating `Pressable` with animated show/hide | `Pressable`, `MotiView` |
| **ConversationDownload** | Rewrite → Share sheet integration | `expo-sharing`, `expo-file-system` |
| **Message** | Rewrite → View wrapper with role-based styling | `View` with Uniwind variants |
| **MessageContent** | Rewrite → content container | `View` |
| **MessageResponse** | Rewrite → streaming markdown renderer | **`react-native-streamdown`** (Software Mansion) |
| **MessageActions** | Rewrite → action bar | `View` + `Pressable` |
| **MessageAction** | Rewrite → icon button with tooltip | `Pressable`, `@gorhom/tooltip` or custom |
| **MessageBranch** + sub-components (5) | Rewrite → branch navigation UI | `View`, `Pressable`, `Text` with swipe gesture support via `react-native-gesture-handler` |
| **MessageToolbar** | Rewrite → toolbar container | `View` |
| **PromptInput** (+ 30 sub-components) | Rewrite → composable input system | See Section 2.1 |
| **Reasoning** | Rewrite → collapsible thinking block | `react-native-collapsible` or custom `MotiView` |
| **ChainOfThought** | Rewrite → step-by-step expandable list | `FlatList` + `MotiView` |
| **Shimmer** | Rewrite → skeleton loading | `react-native-skeleton-placeholder` or `MotiView` shimmer |
| **Sources** / **InlineCitation** | Rewrite → tappable citation chips | `Pressable`, `Linking` |
| **Suggestion** | Rewrite → tappable suggestion pills | `ScrollView` horizontal + `Pressable` |
| **ModelSelector** | Rewrite → bottom sheet selector | `@gorhom/bottom-sheet` |
| **Queue** | Rewrite → message queue display | `FlatList` |
| **Checkpoint** | Rewrite → status indicator | `View`, `Text`, icons |
| **Confirmation** | Rewrite → approval dialog | `Modal` or `@gorhom/bottom-sheet` |
| **Context** | Rewrite → context display | `View`, `Text` |
| **Plan** | Rewrite → plan step display | `FlatList` + status icons |
| **Task** + sub-components (5) | Rewrite → collapsible task list | `Pressable`, `MotiView` for collapse animation |
| **Tool** + sub-components (5) | Rewrite → collapsible tool invocation display | Same pattern as Task |
| **Attachments** + sub-components (9) | Rewrite → file/image/video/audio attachment display | `expo-image`, `expo-video`, `expo-audio`, `Pressable` for remove, long-press popover for preview |

### 1.2 Code Components (15)

| Web Component | RN Strategy | Key RN Primitives / Libraries |
|---|---|---|
| **CodeBlock** | Rewrite → syntax-highlighted code view | **WebView + shiki** (pre-rendered HTML) or `react-native-syntax-highlighter` |
| **Agent** | Rewrite → agent status/activity display | `View`, `Text`, `MotiView` |
| **Artifact** | Rewrite → artifact preview card | `View`, `Image`, `Pressable` |
| **Commit** | Rewrite → commit info display | `View`, `Text`, icons |
| **EnvironmentVariables** | Rewrite → key-value display with masking | `FlatList`, `Text` |
| **FileTree** | Rewrite → recursive tree view | Custom recursive `FlatList` or `react-native-collapsible-tree` |
| **JSXPreview** | WebView fallback → render JSX in sandboxed WebView | `react-native-webview` with injected React runtime |
| **PackageInfo** | Rewrite → package card display | `View`, `Text` |
| **Sandbox** | WebView fallback → embedded code sandbox | `react-native-webview` pointing to sandbox URL |
| **SchemaDisplay** | Rewrite → API schema visualization | Custom tree renderer with collapsible sections |
| **Snippet** | Rewrite → inline code display | `Text` with monospace font + background |
| **StackTrace** | Rewrite → error stack display | `FlatList` with tappable frames |
| **Terminal** | Rewrite → ANSI-aware terminal output | Custom ANSI parser → `Text` with colored spans (see Section 3.3) |
| **TestResults** | Rewrite → pass/fail test display | `FlatList` with status icons |
| **WebPreview** | WebView fallback → iframe equivalent | `react-native-webview` |

### 1.3 Voice Components (6)

| Web Component | RN Strategy | Key RN Primitives / Libraries |
|---|---|---|
| **AudioPlayer** | Rewrite → custom audio player UI | `expo-audio` (SDK 55) + custom controls via `Pressable` + `Slider` |
| **MicSelector** | Rewrite → audio input device picker | `expo-av` audio input APIs + `@gorhom/bottom-sheet` |
| **Persona** | Rewrite → avatar/persona display | `Image`, `View` |
| **SpeechInput** | Rewrite → speech-to-text input | `expo-speech-recognition` or `@react-native-voice/voice` |
| **Transcription** | Rewrite → live transcription display | `Text` with streaming updates |
| **VoiceSelector** | Rewrite → voice picker with metadata | `@gorhom/bottom-sheet` + `FlatList` |

### 1.4 Workflow Components (7) — The Hard Part

| Web Component | RN Strategy | Key RN Primitives / Libraries |
|---|---|---|
| **Canvas** | Rewrite → infinite pannable/zoomable canvas | **`@shopify/react-native-skia`** + `react-native-gesture-handler` |
| **Node** | Rewrite → draggable node on Skia canvas | Skia `Group` + `RRect` + `Text` with gesture-driven position |
| **Edge** / **Connection** | Rewrite → bezier curve connections | Skia `Path` with cubic bezier rendering |
| **Controls** | Rewrite → zoom/pan control buttons | `Pressable` overlay buttons |
| **Panel** | Rewrite → floating panel overlay | `View` with absolute positioning |
| **Toolbar** | Rewrite → floating toolbar | `View` with horizontal `Pressable` buttons |

> **Note:** The Workflow category (Canvas/Node/Edge) is the most complex rewrite. The web version uses `@xyflow/react` which has no RN equivalent. Our approach uses `@shopify/react-native-skia` for GPU-accelerated 2D rendering with `react-native-gesture-handler` for pan/zoom/drag interactions. This is ambitious but achievable — Skia provides all the drawing primitives needed (paths, shapes, text) and runs on the GPU at 60fps.

### 1.5 Utility Components (2)

| Web Component | RN Strategy | Key RN Primitives / Libraries |
|---|---|---|
| **Image** | Rewrite → optimized image display | `expo-image` (blurhash, caching, transitions) |
| **OpenInChat** | Rewrite → deep link / navigation action | `expo-linking` or navigation library integration |

---

## 2. Deep-Dive: Critical Subsystems

### 2.1 PromptInput System (30+ sub-components)

The web PromptInput is the most component-rich module. Here's the RN architecture:

```
PromptInput (form wrapper)
├── PromptInputProvider (context for lifted state)
├── PromptInputHeader
├── PromptInputBody
│   └── PromptInputTextarea → TextInput (auto-growing)
├── PromptInputFooter
│   ├── PromptInputTools
│   │   ├── PromptInputButton → Pressable
│   │   ├── PromptInputSubmit → Pressable with status animation
│   │   ├── PromptInputSelect → @gorhom/bottom-sheet picker
│   │   └── PromptInputActionMenu → bottom sheet menu
│   │       ├── PromptInputActionAddAttachments → expo-document-picker / expo-image-picker
│   │       └── PromptInputActionAddScreenshot → expo-screen-capture
│   └── Attachments preview row
├── PromptInputHoverCard → long-press popover (react-native-popover)
├── PromptInputTabs → tab bar (custom or @react-navigation/material-top-tabs)
└── PromptInputCommand → command palette (bottom sheet + FlatList search)
```

**Key RN adaptations:**
- `<textarea>` → `TextInput` with `multiline`, auto-height via `onContentSizeChange`
- Drag-and-drop → replaced with `expo-document-picker` and `expo-image-picker`
- HoverCard → long-press popover or tooltip
- Command palette → bottom sheet with search `TextInput` + `FlatList`
- Web Speech API → `expo-speech-recognition` or `@react-native-voice/voice`
- Select/Dropdown → `@gorhom/bottom-sheet` with selection list

**Hooks to rewrite:**
- `usePromptInputAttachments` → same logic, backed by `expo-document-picker` / `expo-image-picker`
- `usePromptInputController` → same context pattern, works as-is in RN
- `usePromptInputReferencedSources` → portable, no changes needed

### 2.2 Streaming Markdown (MessageResponse)

This is the linchpin of the AI chat experience. The web version uses `streamdown` (DOM-based). Our RN version uses Software Mansion's native stack:

```
@ai-sdk/react (useChat)
  → streaming text chunks
    → react-native-streamdown (StreamdownText)
      → remend (worklet-thread markdown processing)
        → react-native-enriched-markdown (native Fabric renderer)
```

**Why this stack:**
- **react-native-enriched-markdown** renders markdown natively via `md4c` (C parser). No WebView.
- **react-native-streamdown** wraps it with streaming-aware processing on a worklet thread, keeping the JS thread free. Zero UI lag.
- Supports: GFM tables, task lists, fenced code blocks, inline LaTeX (`$...$`), block LaTeX (`$$...$$`), images, links.
- **New Architecture required** (Fabric) — compatible with Expo 55.

**Setup requirements:**
```bash
yarn add react-native-streamdown react-native-enriched-markdown react-native-worklets remend
```
**Babel config (babel.config.js):**
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-worklets/plugin', {
        bundleMode: true,
        workletizableModules: ['remend'],
      }],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

**Metro config for streaming + Uniwind (metro.config.js):**
```js
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

let config = getDefaultConfig(__dirname);

// Uniwind (Tailwind CSS)
config = withUniwindConfig(config, { cssEntryFile: './global.css' });

// Streamdown worklets: watch .worklets folder
config.watchFolders = [
  ...(config.watchFolders || []),
  require('path').resolve(__dirname, 'node_modules/remend/.worklets'),
];
config.resolver.nodeModulesPaths = [
  ...(config.resolver.nodeModulesPaths || []),
  require('path').resolve(__dirname, 'node_modules/remend/.worklets'),
];

module.exports = config;
```

**Gap: Syntax highlighting inside markdown code blocks.** The enriched-markdown library renders code blocks but doesn't do full syntax highlighting natively (no shiki equivalent). Options:
1. **Hybrid approach:** Render code blocks as `WebView` with shiki inside the native markdown flow.
2. **react-native-syntax-highlighter:** Pure RN solution using highlight.js themes, less accurate but fully native.
3. **Custom Skia renderer:** Use `@shopify/react-native-skia` Text to render colored tokens. Most ambitious, best performance.

**Recommendation:** Start with option 2 (pure native), add option 1 as an enhancement for users who need VS Code-grade highlighting.

### 2.3 Streaming Data Layer

The AI SDK's `useChat` hook **officially supports Expo** (documented quickstart). Here's what's needed:

**Polyfills (required for non-web platforms):**
```js
// polyfills.js — import in _layout.tsx before anything else
import { Platform } from 'react-native';
if (Platform.OS !== 'web') {
  require('@ungap/structured-clone');
  require('@stardazed/streams-text-encoding');
}
```

**Transport setup:**
```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';

const transport = new DefaultChatTransport({
  fetch: expoFetch as unknown as typeof globalThis.fetch,
  api: generateAPIUrl('/api/chat'),
});

const { messages, sendMessage, error, status } = useChat({ transport });
```

**Known issues & mitigations:**
- `@vercel/oidc` resolution error when importing `ai` on client → use `DefaultChatTransport` from a separate entry point or configure Metro to stub server-only modules
- Expo SDK 52+ required for `expo/fetch` streaming support (we're on 55, so fine)
- Hot reload doesn't reload API routes → restart dev server after changes
- `useChat` + `FlashList` can cause UI blocking during streaming → use `LegendList` or debounced state updates

### 2.4 ANSI Terminal Rendering

The web version uses `ansi-to-react` which renders to `<span>` elements. For RN, we build a lightweight ANSI parser:

```tsx
// Parses ANSI escape codes into styled Text segments
function AnsiText({ content }: { content: string }) {
  const segments = parseAnsi(content); // Extract color/style codes
  return (
    <Text className="font-mono text-sm">
      {segments.map((seg, i) => (
        <Text key={i} style={{ color: seg.color, fontWeight: seg.bold ? 'bold' : 'normal' }}>
          {seg.text}
        </Text>
      ))}
    </Text>
  );
}
```

This is straightforward — ANSI codes map to a small set of colors and styles. We write a ~100-line parser (or use `ansi-to-json` which is platform-agnostic).

### 2.5 Flow Graph Engine (Canvas/Node/Edge)

The most ambitious subsystem. Web uses `@xyflow/react`; we build on `@shopify/react-native-skia`:

**Architecture:**
```
FlowCanvas (Skia Canvas + GestureDetector)
├── Gesture Layer (pan, zoom, pinch via react-native-gesture-handler)
├── Edge Layer (Skia Paths — bezier curves between nodes)
├── Node Layer (Skia Groups — draggable, tappable)
│   ├── NodeContent (Skia RRect + Text + optional RN View overlay)
│   └── NodeHandles (connection points)
├── Controls Overlay (RN View positioned absolutely)
└── Minimap (optional, scaled-down Skia render)
```

**Why Skia:**
- GPU-accelerated, 60fps rendering even with 100+ nodes
- Full control over bezier paths, shapes, text rendering
- Works on iOS, Android, Web
- Gesture handler integration for drag, pan, pinch-to-zoom
- Can mix Skia drawing with native RN views via `SkiaDOM`

**Phased delivery:**
1. **Phase 1:** Static graph rendering (nodes + edges)
2. **Phase 2:** Pan/zoom navigation
3. **Phase 3:** Node dragging with edge re-routing
4. **Phase 4:** Interactive features (selection, context menus, adding/removing nodes)

---

## 3. Dependency Mapping

### 3.1 Web → React Native Library Substitutions

| Web Library | RN Replacement | Notes |
|---|---|---|
| `react-dom` | React Native renderer | Fundamental change |
| `shadcn/ui` + Radix UI | Custom components with Uniwind | Full rewrite of all primitives |
| `lucide-react` | `lucide-react-native` | Drop-in SVG icon swap |
| `@xyflow/react` | `@shopify/react-native-skia` + custom | See Section 2.5 |
| `media-chrome` | `expo-audio` / `expo-video` + custom controls | See Voice section |
| `ansi-to-react` | Custom ANSI parser → `Text` spans | See Section 2.4 |
| `streamdown` / `@streamdown/*` | `react-native-streamdown` | Software Mansion's native equivalent |
| `shiki` | `react-native-syntax-highlighter` (or WebView+shiki) | See Section 2.2 |
| `katex` | `react-native-enriched-markdown` (built-in LaTeX) | Native rendering, no WebView |
| `react-jsx-parser` | `react-native-webview` (sandboxed) | For JSXPreview component |
| Tailwind CSS | **Uniwind** | Build-time compiled, className prop |
| `motion` (Framer Motion) | **Moti** + `react-native-reanimated` v3 | Mount/unmount animations, 60fps native thread |
| `class-variance-authority` | Uniwind variants or custom utility | CVA patterns adapted for RN |
| `react-resizable-panels` | `react-native-gesture-handler` drag | Custom implementation |
| `stick-to-bottom` | Custom `ScrollView` / `FlashList` with `onContentSizeChange` | Auto-scroll behavior |

### 3.2 Portable Libraries (No Changes Needed)

| Library | Why It Works |
|---|---|
| `@ai-sdk/react` (`useChat`, `useCompletion`, etc.) | Officially supports Expo |
| `zod` | Pure JS, no DOM dependencies |
| TypeScript types | Fully reusable |
| `ai` (server-side) | Runs on Node.js backend, not in the app |

### 3.3 New Dependencies (RN-only)

| Library | Purpose | Expo Compatible |
|---|---|---|
| `uniwind` | Tailwind CSS v4 styling | Yes (Expo Go + dev client) |
| `react-native-reanimated` v3 | Animation engine | Yes |
| `moti` | Framer Motion-style animation API | Yes |
| `react-native-gesture-handler` | Touch/gesture handling | Yes |
| `@shopify/flash-list` or `LegendList` | Performant message list | Yes |
| `@gorhom/bottom-sheet` | Bottom sheets (selectors, menus) | Yes |
| `react-native-streamdown` | Streaming markdown | Yes (dev client, Fabric required) |
| `react-native-enriched-markdown` | Native markdown rendering | Yes (dev client, Fabric required) |
| `react-native-worklets` | Worklet thread for streaming | Yes (dev client) |
| `remend` | Streaming markdown processor | Yes |
| `@shopify/react-native-skia` | GPU-accelerated 2D (flow graphs) | Yes (dev client) |
| `expo-image` | Optimized image loading | Yes |
| `expo-document-picker` | File attachments | Yes |
| `expo-image-picker` | Image attachments | Yes |
| `expo-sharing` | Share/download conversations | Yes |
| `expo-audio` | Audio playback | Yes |
| `expo-video` | Video playback (SDK 55) | Yes |
| `expo-speech-recognition` | Speech-to-text | Yes (dev client) |
| `lucide-react-native` | Icons | Yes |
| `react-native-syntax-highlighter` | Code block highlighting | Yes |

---

## 4. Project Structure

```
expo-ai-elements/
├── src/
│   ├── index.ts                          # Main entry — re-exports everything
│   │
│   ├── chatbot/                          # Chatbot category
│   │   ├── conversation/
│   │   │   ├── Conversation.tsx
│   │   │   ├── ConversationContent.tsx
│   │   │   ├── ConversationEmptyState.tsx
│   │   │   ├── ConversationScrollButton.tsx
│   │   │   ├── ConversationDownload.tsx
│   │   │   ├── useStickToBottom.ts       # Custom hook for auto-scroll
│   │   │   └── index.ts
│   │   ├── message/
│   │   │   ├── Message.tsx
│   │   │   ├── MessageContent.tsx
│   │   │   ├── MessageResponse.tsx        # StreamdownText integration
│   │   │   ├── MessageActions.tsx
│   │   │   ├── MessageAction.tsx
│   │   │   ├── MessageBranch.tsx
│   │   │   ├── MessageBranchSelector.tsx
│   │   │   ├── MessageToolbar.tsx
│   │   │   └── index.ts
│   │   ├── prompt-input/
│   │   │   ├── PromptInput.tsx
│   │   │   ├── PromptInputTextarea.tsx    # Auto-growing TextInput
│   │   │   ├── PromptInputSubmit.tsx
│   │   │   ├── PromptInputSelect.tsx      # Bottom sheet picker
│   │   │   ├── PromptInputActionMenu.tsx  # Bottom sheet menu
│   │   │   ├── PromptInputAttachments.tsx
│   │   │   ├── PromptInputCommand.tsx     # Command palette
│   │   │   ├── PromptInputProvider.tsx
│   │   │   ├── usePromptInputAttachments.ts
│   │   │   ├── usePromptInputController.ts
│   │   │   └── index.ts
│   │   ├── reasoning/
│   │   ├── chain-of-thought/
│   │   ├── shimmer/
│   │   ├── sources/
│   │   ├── suggestion/
│   │   ├── model-selector/
│   │   ├── queue/
│   │   ├── checkpoint/
│   │   ├── confirmation/
│   │   ├── context/
│   │   ├── plan/
│   │   ├── task/
│   │   ├── tool/
│   │   └── attachments/
│   │
│   ├── code/                             # Code category
│   │   ├── code-block/
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── CodeBlockHeader.tsx
│   │   │   ├── CodeBlockCopy.tsx
│   │   │   └── index.ts
│   │   ├── agent/
│   │   ├── artifact/
│   │   ├── commit/
│   │   ├── environment-variables/
│   │   ├── file-tree/
│   │   ├── jsx-preview/                  # WebView-based
│   │   ├── package-info/
│   │   ├── sandbox/                      # WebView-based
│   │   ├── schema-display/
│   │   ├── snippet/
│   │   ├── stack-trace/
│   │   ├── terminal/                     # ANSI parser
│   │   ├── test-results/
│   │   └── web-preview/                  # WebView-based
│   │
│   ├── voice/                            # Voice category
│   │   ├── audio-player/
│   │   ├── mic-selector/
│   │   ├── persona/
│   │   ├── speech-input/
│   │   ├── transcription/
│   │   └── voice-selector/
│   │
│   ├── workflow/                          # Workflow category (Skia-based)
│   │   ├── canvas/
│   │   │   ├── FlowCanvas.tsx            # Skia Canvas + gesture handler
│   │   │   ├── FlowNode.tsx
│   │   │   ├── FlowEdge.tsx
│   │   │   ├── FlowControls.tsx
│   │   │   ├── FlowPanel.tsx
│   │   │   ├── FlowToolbar.tsx
│   │   │   ├── useFlowGraph.ts           # Graph state management
│   │   │   ├── useNodeDrag.ts            # Drag gesture hook
│   │   │   ├── usePanZoom.ts             # Pan/zoom gesture hook
│   │   │   └── index.ts
│   │   └── minimap/
│   │
│   ├── utilities/                         # Utility components
│   │   ├── image/
│   │   └── open-in-chat/
│   │
│   ├── primitives/                        # Shared RN primitives (replacing shadcn/ui)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Collapsible.tsx
│   │   ├── BottomSheet.tsx               # Wraps @gorhom/bottom-sheet
│   │   ├── Popover.tsx
│   │   ├── Modal.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Slider.tsx
│   │   ├── Separator.tsx
│   │   ├── Avatar.tsx
│   │   └── index.ts
│   │
│   ├── hooks/                             # Shared hooks
│   │   ├── useStreamingChat.ts           # Wraps @ai-sdk/react useChat with RN setup
│   │   ├── useClipboard.ts
│   │   ├── useHaptics.ts
│   │   └── index.ts
│   │
│   ├── theme/                             # Theming
│   │   ├── global.css                    # Uniwind @theme definitions
│   │   ├── tokens.ts                     # Design tokens (exported for non-Uniwind consumers)
│   │   └── index.ts
│   │
│   └── utils/                             # Utilities
│       ├── ansi-parser.ts
│       ├── messagesToMarkdown.ts
│       ├── generateAPIUrl.ts
│       ├── polyfills.ts
│       └── index.ts
│
├── example/                               # Example Expo app
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx                 # Chat demo
│   │   │   ├── code.tsx                  # Code components demo
│   │   │   ├── voice.tsx                 # Voice demo
│   │   │   └── workflow.tsx              # Flow graph demo
│   │   ├── api/
│   │   │   └── chat+api.ts              # Streaming API route
│   │   └── _layout.tsx                   # Polyfills + providers
│   ├── app.json
│   └── package.json
│
├── package.json
├── tsconfig.json
├── metro.config.js                        # Uniwind + Streamdown worklet config
├── babel.config.js                        # Reanimated + worklet plugins
├── global.css                             # Tailwind entry with @theme
└── ARCHITECTURE.md                        # This file
```

---

## 5. Styling Architecture (Uniwind)

### 5.1 Setup

```bash
bun add uniwind tailwindcss
```

```css
/* global.css */
@import 'tailwindcss';
@import 'uniwind';

@theme {
  /* AI Elements design tokens */
  --color-ai-primary: #0066ff;
  --color-ai-secondary: #6b7280;
  --color-ai-surface: #ffffff;
  --color-ai-surface-alt: #f9fafb;
  --color-ai-border: #e5e7eb;
  --color-ai-text: #111827;
  --color-ai-text-muted: #6b7280;
  --color-ai-success: #10b981;
  --color-ai-error: #ef4444;
  --color-ai-warning: #f59e0b;
  --color-ai-user-bubble: #0066ff;
  --color-ai-assistant-bubble: transparent;

  --radius-ai-message: 1rem;
  --radius-ai-input: 0.75rem;
  --radius-ai-button: 0.5rem;

  --font-mono: 'JetBrains Mono', monospace;
}
```

```js
// metro.config.js
const { withUniwindConfig } = require('uniwind/metro');
const { getDefaultConfig } = require('expo/metro-config');

let config = getDefaultConfig(__dirname);
config = withUniwindConfig(config, { cssEntryFile: './global.css' });
module.exports = config;
```

### 5.2 Component Styling Pattern

Every component uses Uniwind `className` with sensible defaults that consumers can override:

```tsx
// Example: Message component
import { View, Text } from 'react-native';

interface MessageProps {
  from?: 'user' | 'assistant' | 'system';
  className?: string;
  children?: React.ReactNode;
}

export function Message({ from = 'assistant', className, children }: MessageProps) {
  return (
    <View
      className={cn(
        'px-4 py-3',
        from === 'user' && 'bg-ai-user-bubble rounded-ai-message ml-12',
        from === 'assistant' && 'bg-ai-assistant-bubble',
        className
      )}
    >
      {children}
    </View>
  );
}
```

### 5.3 Theming for Consumers

Consumers override the theme via their own `global.css`:

```css
/* Consumer's global.css */
@import 'tailwindcss';
@import 'uniwind';

@theme {
  --color-ai-primary: #8b5cf6;       /* Purple brand */
  --color-ai-user-bubble: #8b5cf6;
  --radius-ai-message: 1.5rem;       /* Rounder bubbles */
}
```

Dark mode works automatically via Uniwind's `dark:` variant.

---

## 6. Animation Architecture (Moti + Reanimated)

### 6.1 Core Patterns

```tsx
// Message enter/exit animation
import { MotiView } from 'moti';

<MotiView
  from={{ opacity: 0, translateY: 20 }}
  animate={{ opacity: 1, translateY: 0 }}
  exit={{ opacity: 0, translateY: -10 }}
  transition={{ type: 'timing', duration: 300 }}
>
  <Message from="assistant">...</Message>
</MotiView>
```

```tsx
// Shimmer/skeleton loading
import { MotiView } from 'moti';

<MotiView
  from={{ opacity: 0.4 }}
  animate={{ opacity: 1 }}
  transition={{ loop: true, type: 'timing', duration: 1000 }}
  className="h-4 w-3/4 rounded bg-ai-surface-alt"
/>
```

```tsx
// Collapsible (Reasoning, Task, Tool)
import { AnimatePresence, MotiView } from 'moti';

<AnimatePresence>
  {isOpen && (
    <MotiView
      from={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      {children}
    </MotiView>
  )}
</AnimatePresence>
```

### 6.2 Streaming Text Animation

For smooth streaming text without jank:

```tsx
// StreamdownText handles this natively via worklet thread
// The enriched-markdown library has built-in streamingAnimation
<StreamdownText
  markdown={partialMarkdown}
  // streamingAnimation is handled internally by the native renderer
/>
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Weeks 1-3)
**Deliverable:** Working AI chat with streaming

- [ ] Project scaffolding (Expo 55, Uniwind, Metro/Babel config)
- [ ] Polyfills setup (`structuredClone`, `TextEncoderStream`, `TextDecoderStream`)
- [ ] `useStreamingChat` hook (wraps `useChat` with Expo transport)
- [ ] Primitives layer (Button, Badge, Collapsible, BottomSheet)
- [ ] `Conversation` + `ConversationContent` (with stick-to-bottom)
- [ ] `Message` + `MessageContent` + `MessageResponse` (streaming markdown)
- [ ] `PromptInput` + `PromptInputTextarea` + `PromptInputSubmit`
- [ ] Example app with basic chat working end-to-end

### Phase 2: Rich Chat (Weeks 4-6)
**Deliverable:** Feature-complete chat experience

- [ ] `MessageActions` (copy, retry, like/dislike)
- [ ] `MessageBranch` (response branching navigation)
- [ ] `Shimmer` (loading skeleton)
- [ ] `Suggestion` (suggestion pills)
- [ ] `Attachments` (file/image display)
- [ ] `PromptInputAttachments` (file picking, camera)
- [ ] `PromptInputActionMenu`
- [ ] `PromptInputSelect` (model selector)
- [ ] `PromptInputCommand` (command palette)
- [ ] `ConversationScrollButton`
- [ ] `ConversationDownload` (share as markdown)
- [ ] `Sources` + `InlineCitation`
- [ ] `ModelSelector`

### Phase 3: AI Agent UI (Weeks 7-9)
**Deliverable:** Full agent interaction components

- [ ] `Reasoning` + `ChainOfThought`
- [ ] `Task` + sub-components
- [ ] `Tool` + sub-components
- [ ] `Confirmation` (tool approval dialog)
- [ ] `Checkpoint`
- [ ] `Context`
- [ ] `Plan`
- [ ] `Queue`
- [ ] `Agent` display component

### Phase 4: Code Components (Weeks 10-12)
**Deliverable:** Developer-focused components

- [ ] `CodeBlock` (syntax highlighting)
- [ ] `Snippet` (inline code)
- [ ] `Terminal` (ANSI rendering)
- [ ] `FileTree`
- [ ] `StackTrace`
- [ ] `TestResults`
- [ ] `Commit`
- [ ] `EnvironmentVariables`
- [ ] `PackageInfo`
- [ ] `SchemaDisplay`
- [ ] `Artifact`
- [ ] `JSXPreview` (WebView)
- [ ] `Sandbox` (WebView)
- [ ] `WebPreview` (WebView)

### Phase 5: Voice (Weeks 13-14)
**Deliverable:** Voice interaction components

- [ ] `AudioPlayer` (expo-audio)
- [ ] `SpeechInput` (speech-to-text)
- [ ] `Transcription` (live transcription)
- [ ] `MicSelector`
- [ ] `VoiceSelector`
- [ ] `Persona`

### Phase 6: Workflow / Flow Graph (Weeks 15-18)
**Deliverable:** Interactive node graph

- [ ] `FlowCanvas` (Skia canvas + pan/zoom)
- [ ] `FlowNode` (draggable nodes)
- [ ] `FlowEdge` (bezier connections)
- [ ] `FlowControls`
- [ ] `FlowPanel`
- [ ] `FlowToolbar`
- [ ] Minimap
- [ ] Node selection and multi-select
- [ ] Add/remove nodes and edges

### Phase 7: Polish & Release (Weeks 19-20)
**Deliverable:** Production-ready library

- [ ] API documentation
- [ ] Performance optimization (profiling, memoization)
- [ ] Accessibility audit (VoiceOver, TalkBack)
- [ ] Dark mode testing across all components
- [ ] Example app with all component demos
- [ ] npm package publishing setup
- [ ] CI/CD pipeline

---

## 8. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| `react-native-streamdown` is very new (March 2026) | Medium | It's from Software Mansion (Expo maintainers). If issues arise, fall back to `react-native-enriched-markdown` directly with manual streaming logic. |
| Flow graph (Skia-based) complexity | High | Phase it last. If timeline slips, ship a WebView-based fallback using `@xyflow/react` inside a WebView. |
| `@ai-sdk/react` breaking changes on Expo | Medium | Pin versions. The `useChat` → `DefaultChatTransport` pattern is stable since AI SDK 5.x. |
| Uniwind limitations vs full Tailwind | Low | Uniwind compiles full Tailwind v4. Any gaps are mitigable with `StyleSheet.create` fallback. |
| `expo-speech-recognition` maturity | Medium | Fall back to `@react-native-voice/voice` which is battle-tested. |
| Performance with 1000+ messages | Medium | Use `FlashList` or `LegendList` with windowed rendering. Memoize `Message` components. |
| New Architecture (Fabric) requirement | Low | Expo 55 has New Architecture as default. Legacy architecture is frozen. |

---

## 9. Success Criteria

1. **API Parity:** Every component from web AI Elements has an RN equivalent with matching props API
2. **Streaming Performance:** Streaming markdown renders at 60fps with zero JS thread blocking
3. **Theming:** Full theme customization via Uniwind CSS variables
4. **Type Safety:** 100% TypeScript with exported type definitions
5. **Expo Compatibility:** Works with Expo SDK 55+ (dev client for native modules)
6. **Bundle Size:** Tree-shakeable — importing one component doesn't pull in the entire library
7. **Accessibility:** VoiceOver (iOS) and TalkBack (Android) support for all interactive components
