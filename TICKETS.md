# expo-ai-elements — Project Tickets

## Epic 0: Project Setup

### T-001: Scaffold Expo project with minimal-uniwind template
**Priority:** P0 — Blocker
**Estimate:** S

- Run `npx @react-native-reusables/cli@latest init -t minimal-uniwind`
- Upgrade to Expo SDK 55 (RN 0.83, React 19.2) if template ships older
- Run `npx expo prebuild` to generate `ios/` and `android/` directories
- Verify builds on iOS simulator and Android emulator
- Add to git, push initial commit

**Acceptance:**
- `npx expo run:ios` and `npx expo run:android` both build and launch
- Uniwind className styling works on a test `<View className="bg-red-500" />`
- Reusables `<Button>` renders correctly

### T-002: Configure monorepo structure for component library
**Priority:** P0 — Blocker
**Depends on:** T-001

- Set up `packages/elements/` as the component library package
- Configure `package.json` with proper exports, peer deps
- Set up TypeScript config extending root
- Configure barrel exports (`src/index.ts`)
- Verify importing a component from `@expo-ai-elements/elements` works in the app

**Acceptance:**
- App can import and render a component from the elements package
- TypeScript types resolve correctly

### T-003: Install core dependencies
**Priority:** P0 — Blocker
**Depends on:** T-001

- `react-native-enriched-markdown` (markdown + code highlighting + LaTeX)
- `react-native-streamdown` (streaming markdown)
- `ai` + `@ai-sdk/react` (Vercel AI SDK hooks)
- `react-native-reanimated` (if not already included)
- `expo-clipboard`
- `react-native-webview`
- Rebuild native projects after installing native deps

**Acceptance:**
- All packages install without conflicts
- Native rebuild succeeds on both platforms

---

## Epic 1: Core Chat Components

### T-010: Build `Shimmer` component
**Priority:** P0
**Depends on:** T-002

- Animated loading indicator for streaming AI responses
- Reanimated-based shimmer/pulse animation
- Configurable: width, height, color, speed
- Use Uniwind for styling

**Reference:** `ai-elements/packages/elements/src/registry/shimmer/`

**Acceptance:**
- Shimmer animates smoothly at 60fps on device
- Customizable via className prop

### T-011: Build `Message` component
**Priority:** P0
**Depends on:** T-002

- Message bubble with role-based styling (user/assistant/system)
- Avatar support using Reusables `Avatar`
- Timestamp display
- Composable: accepts children for content area
- Variants: user (right-aligned), assistant (left-aligned), system (centered)

**Reference:** `ai-elements/packages/elements/src/registry/message/`

**Acceptance:**
- All 3 role variants render correctly
- Avatar displays properly
- Dark/light mode works

### T-012: Build `MessageContent` component
**Priority:** P0
**Depends on:** T-011

- Renders markdown content inside a message bubble
- Uses `react-native-enriched-markdown` for rendering
- Supports: bold, italic, headers, lists, links, images, tables, code blocks, LaTeX
- Streaming mode: uses `react-native-streamdown` for token-by-token rendering with shimmer

**Reference:** `ai-elements/packages/elements/src/registry/message-content/`

**Acceptance:**
- Static markdown renders all supported elements
- Streaming mode shows tokens appearing smoothly
- Code blocks have syntax highlighting
- LaTeX math formulas render correctly

### T-013: Build `Conversation` component
**Priority:** P0
**Depends on:** T-011, T-012

- Scrollable chat container (`FlatList` or `FlashList`)
- Auto-scroll to bottom on new messages
- "Scroll to bottom" button when scrolled up
- Keyboard-avoiding behavior
- Inverted list for chat performance
- Pull-to-load-more for message history

**Reference:** `ai-elements/packages/elements/src/registry/conversation/`

**Acceptance:**
- Smooth scrolling with 100+ messages
- Auto-scroll works during streaming
- Keyboard doesn't cover input
- No jank on device

### T-014: Build `PromptInput` component
**Priority:** P0
**Depends on:** T-002

- Multi-line text input using Reusables `Textarea`
- Send button (disabled when empty)
- Stop button (visible during streaming)
- Auto-grow up to max height
- Shift+Enter for newline (on hardware keyboard)
- Composable: slots for left/right actions (attachments, model selector)

**Reference:** `ai-elements/packages/elements/src/registry/prompt-input/`

**Acceptance:**
- Input grows with content
- Send/stop buttons toggle correctly
- Works with software and hardware keyboards

### T-015: Build `Suggestion` component
**Priority:** P1
**Depends on:** T-002

- Tappable suggestion chip/pill
- Horizontal scrollable list of suggestions
- onPress fills the prompt input
- Uses Reusables `Badge` or `Button` variant

**Reference:** `ai-elements/packages/elements/src/registry/suggestion/`

**Acceptance:**
- Chips render in a horizontal scroll
- Tapping fills the input and optionally auto-sends

### T-016: Wire up AI SDK integration in example app
**Priority:** P0
**Depends on:** T-013, T-014

- Create example screen using `useChat` from `@ai-sdk/react`
- Connect to an API endpoint (OpenAI or Anthropic)
- Demonstrate full chat flow: send message -> streaming response -> display
- Show Conversation + Message + MessageContent + PromptInput working together

**Acceptance:**
- End-to-end chat works with a real LLM API
- Streaming responses render token-by-token
- Stop generation works

---

## Epic 2: Code & Technical Components

### T-020: Build `CodeBlock` component
**Priority:** P0
**Depends on:** T-012

- Syntax-highlighted code display
- Language label header
- Copy-to-clipboard button (using `expo-clipboard`)
- Line numbers (optional)
- Horizontal scroll for long lines
- Leverages `react-native-enriched-markdown` code block rendering or custom highlighter

**Reference:** `ai-elements/packages/elements/src/registry/code-block/`

**Acceptance:**
- Syntax highlighting works for JS/TS/Python/Swift/Go at minimum
- Copy button works
- Long code scrolls horizontally without layout break

### T-021: Build `Terminal` component
**Priority:** P1
**Depends on:** T-002

- Monospace text display with dark background
- ANSI color code support (if feasible)
- Auto-scroll to bottom
- Optional header with title

**Reference:** `ai-elements/packages/elements/src/registry/terminal/`

**Acceptance:**
- Renders terminal-style output
- Monospace font displays correctly on both platforms

### T-022: Build `StackTrace` component
**Priority:** P1
**Depends on:** T-002

- Collapsible error stack display
- Error message header (red/warning styling)
- Expandable stack frames
- File path + line number per frame
- Uses Reusables `Collapsible`

**Reference:** `ai-elements/packages/elements/src/registry/stack-trace/`

**Acceptance:**
- Shows error summary collapsed by default
- Expands to show full stack trace
- File paths are readable

### T-023: Build `TestResults` component
**Priority:** P2
**Depends on:** T-002

- Pass/fail test result display
- Green checkmark / red X per test
- Summary header (X passed, Y failed)
- Collapsible failure details
- Uses Reusables `Collapsible`, `Badge`

**Reference:** `ai-elements/packages/elements/src/registry/test-results/`

**Acceptance:**
- Visually distinguishes pass/fail
- Failure details expandable

---

## Epic 3: AI Reasoning Components

### T-030: Build `Reasoning` component
**Priority:** P0
**Depends on:** T-010, T-012

- Expandable "thinking" section
- Shimmer animation while reasoning is in progress
- Collapsible to show/hide reasoning text
- Streaming support for reasoning tokens
- Visual distinction from regular message content (indented, different bg)

**Reference:** `ai-elements/packages/elements/src/registry/reasoning/`

**Acceptance:**
- Shows shimmer while model is thinking
- Reasoning text streams in
- Collapses/expands smoothly with Reanimated

### T-031: Build `ChainOfThought` component
**Priority:** P1
**Depends on:** T-030

- Numbered/bulleted thought steps
- Each step shows status (pending/active/complete)
- Active step has shimmer/pulse animation
- Sequential reveal as steps complete

**Reference:** `ai-elements/packages/elements/src/registry/chain-of-thought/`

**Acceptance:**
- Steps appear sequentially
- Active step visually distinct
- Completed steps show checkmark

### T-032: Build `Tool` component
**Priority:** P0
**Depends on:** T-002

- Tool call visualization
- Shows: tool name, input arguments, execution status, result
- Collapsible args/result sections
- Status states: pending, running (with spinner), success, error
- Uses Reusables `Card`, `Collapsible`, `Badge`

**Reference:** `ai-elements/packages/elements/src/registry/tool/`

**Acceptance:**
- All status states render correctly
- Args display as formatted JSON
- Result section expandable

### T-033: Build `Plan` component
**Priority:** P1
**Depends on:** T-002

- Agent plan display with ordered steps
- Each step: title, description, status (pending/in-progress/done/skipped)
- Progress indicator for overall plan
- Uses Reusables `Progress`, `Card`

**Reference:** `ai-elements/packages/elements/src/registry/plan/`

**Acceptance:**
- Plan steps render with correct status icons
- Progress bar reflects completion

### T-034: Build `Task` and `Queue` components
**Priority:** P2
**Depends on:** T-033

- `Task`: individual task card with status, title, description
- `Queue`: ordered list of tasks with drag-reorder (optional)
- Status: queued, running, completed, failed, cancelled

**Reference:** `ai-elements/packages/elements/src/registry/task/`, `queue/`

**Acceptance:**
- Task cards show all status variants
- Queue renders ordered list

### T-035: Build `Agent` component
**Priority:** P2
**Depends on:** T-032, T-033

- Agent execution status display
- Shows agent name, current action, tools being used
- Integrates Plan and Tool components
- Status: idle, thinking, acting, waiting, complete, error

**Reference:** `ai-elements/packages/elements/src/registry/agent/`

**Acceptance:**
- All agent states render correctly
- Composes Plan + Tool sub-components

---

## Epic 4: Content & Artifact Components

### T-040: Build `Artifact` component
**Priority:** P1
**Depends on:** T-002

- Tabbed container for AI-generated content
- Header with title and type indicator
- Supports different content types: code, text, image, web
- Action bar: copy, download, open externally
- Uses Reusables `Tabs`, `Card`

**Reference:** `ai-elements/packages/elements/src/registry/artifact/`

**Acceptance:**
- Tabs switch content correctly
- Action buttons work
- Different content types render properly

### T-041: Build `FileTree` component
**Priority:** P1
**Depends on:** T-002

- Recursive file/folder tree display
- Expand/collapse folders
- File type icons
- Selectable files (optional)
- Uses Reusables `Collapsible`

**Reference:** `ai-elements/packages/elements/src/registry/file-tree/`

**Acceptance:**
- Nested folders expand/collapse
- File icons display by extension
- Handles 3+ levels of nesting

### T-042: Build `InlineCitation` and `Sources` components
**Priority:** P1
**Depends on:** T-002

- `InlineCitation`: superscript citation number, tappable to show source
- `Sources`: list of referenced sources with title, URL, snippet
- Bottom sheet or popover for citation details
- Uses Reusables `Popover` or `Dialog`

**Reference:** `ai-elements/packages/elements/src/registry/inline-citation/`, `sources/`

**Acceptance:**
- Citation numbers render inline with text
- Tapping shows source details
- Sources list renders with all fields

### T-043: Build `WebPreview` component
**Priority:** P2
**Depends on:** T-003

- WebView wrapper for previewing web content
- URL bar header
- Loading indicator
- Optional: screenshot mode (static image of page)
- Uses `react-native-webview`

**Reference:** `ai-elements/packages/elements/src/registry/web-preview/`

**Acceptance:**
- Loads and displays web content
- Loading state visible
- Handles errors gracefully

### T-044: Build `Attachments` component
**Priority:** P1
**Depends on:** T-002

- File attachment display (thumbnail + filename + size)
- Image attachments show preview
- Add attachment button (camera, gallery, files)
- Remove attachment button
- Horizontal scroll for multiple attachments
- Uses `expo-image-picker`, `expo-document-picker`

**Reference:** `ai-elements/packages/elements/src/registry/attachments/`

**Acceptance:**
- Images show thumbnails
- Documents show icon + name
- Add/remove works

### T-045: Build `SchemaDisplay` component
**Priority:** P2
**Depends on:** T-020

- JSON/data schema viewer
- Syntax-highlighted JSON
- Collapsible nested objects
- Type indicators (string, number, boolean, array, object)

**Reference:** `ai-elements/packages/elements/src/registry/schema-display/`

**Acceptance:**
- JSON renders with syntax highlighting
- Nested objects collapsible

---

## Epic 5: Advanced Components

### T-050: Build `SpeechInput` component
**Priority:** P2
**Depends on:** T-014

- Speech-to-text input using `expo-speech` or `@react-native-voice/voice`
- Mic button with recording animation
- Waveform or pulse animation during recording
- Transcribed text fills prompt input
- Permission handling for microphone

**Reference:** `ai-elements/packages/elements/src/registry/speech-input/`

**Acceptance:**
- Records audio and transcribes to text
- Animation plays during recording
- Handles mic permission denial gracefully

### T-051: Build `Node`, `Edge`, `Connection` graph components
**Priority:** P3
**Depends on:** T-002

- Basic graph/flowchart visualization
- `Node`: positioned box with label and ports
- `Edge`: line/curve connecting two nodes
- `Connection`: interactive edge creation
- SVG-based rendering
- Pan and zoom support

**Reference:** `ai-elements/packages/elements/src/registry/node/`, `edge/`, `connection/`

**Acceptance:**
- Renders a basic node graph
- Nodes and edges display correctly
- Pan/zoom works on touch

### T-052: Build `OpenInChat` component
**Priority:** P3
**Depends on:** T-002

- Deep link buttons to external AI apps (ChatGPT, Claude, Gemini)
- Opens app or browser with pre-filled prompt
- Icon + label for each supported app

**Reference:** `ai-elements/packages/elements/src/registry/open-in-chat/`

**Acceptance:**
- Buttons render with correct app icons
- Deep links open target apps

### T-053: Build `Checkpoint` component
**Priority:** P3
**Depends on:** T-002

- Visual marker in conversation for execution checkpoints
- Timestamp + label
- Horizontal rule style with metadata

**Reference:** `ai-elements/packages/elements/src/registry/checkpoint/`

---

## Epic 6: Documentation & Distribution

### T-060: Create example showcase app
**Priority:** P1
**Depends on:** Epic 1, Epic 2

- Screen per component with interactive demos
- Navigation between component screens
- Demonstrates real AI chat flow end-to-end
- Dark/light mode toggle

### T-061: Set up shadcn-style CLI for component installation
**Priority:** P2
**Depends on:** All component tickets

- Registry JSON files per component
- CLI command: `npx expo-ai-elements add <component>`
- Installs component source + required deps
- Similar to `@react-native-reusables/cli`

### T-062: Write component documentation
**Priority:** P2
**Depends on:** All component tickets

- Props documentation per component
- Usage examples
- Copy-pasteable code snippets

---

## Priority Legend

| Priority | Meaning |
|---|---|
| P0 | Must have — core functionality |
| P1 | Should have — important for completeness |
| P2 | Nice to have — enhances the library |
| P3 | Future — can be deferred |

## Size Legend

| Size | Meaning |
|---|---|
| S | < 2 hours |
| M | 2-4 hours |
| L | 4-8 hours |
| XL | 1-2 days |
