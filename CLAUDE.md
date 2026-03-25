# expo-ai-elements

React Native port of Vercel AI Elements. 48 components for Expo SDK 55.

## Rules

1. **Never declare done until the app runs without errors in the iOS simulator.**
2. **Verify every external package exists** (`npm view <pkg>`) before importing it.
3. **After writing any component, test the bundle**: `curl http://localhost:8090/app/_layout.bundle?platform=ios` — if it returns errors, fix immediately.
4. **Use `/context7` for library docs** — never assume an API.
5. **Add components incrementally** — one at a time, verify each renders, then next.
6. **Don't ask "want me to continue?"** — just keep going until everything works.

## Project Structure

- `src/` — Library source (119 files, 48 components)
- `src/primitives/` — RN equivalents of shadcn-ui (Button, Collapsible, Select, etc.)
- `src/chatbot/` — Chat components (Conversation, Message, PromptInput, etc.)
- `src/code/` — Code display (CodeBlock, Terminal, FileTree, etc.)
- `src/voice/` — Voice/media (AudioPlayer, SpeechInput, etc.)
- `src/workflow/` — Flow graph (Canvas via WebView)
- `src/utilities/` — Image, OpenInChat
- `example/` — Expo Router example app

## Key Deps

- Expo SDK 55 (React 19.2.0, RN 0.83.2)
- Uniwind (Tailwind CSS v4 for RN)
- Moti + Reanimated 4.x (animations)
- @gorhom/bottom-sheet (overlays)
- expo-audio, expo-av, expo-clipboard, expo-image, expo-document-picker

## Running

```bash
cd example && npx expo start --port 8090 --clear
xcrun simctl openurl booted "exp://10.0.0.45:8090"
```
