# Changelog

All notable changes to `expo-ai-elements` are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed (BREAKING)

- **Native and host-singleton modules are now `peerDependencies` instead of hard
  `dependencies`.** Bundling `react`, `react-native`, `expo`, all `expo-*` modules,
  `react-native-reanimated`, `react-native-worklets`, `react-native-gesture-handler`,
  `react-native-screens`, `react-native-safe-area-context`, `@gorhom/bottom-sheet`,
  `react-native-svg`, `react-native-webview`, `react-native-streamdown`,
  `react-native-enriched-markdown`, `uniwind`, `lucide-react-native`, and
  `@react-native-community/slider` as direct dependencies shipped duplicate native
  runtimes and invalid-hook / "two copies of React" crashes into consumer apps.
  Consumers must now install these peers in their own app (a single copy in the tree).
  See the `peerDependencies` field for the full list and version ranges, and the
  README "Install" section.

### Added

- Declared `expo-constants` as a peer dependency — it is imported by
  `src/utils/generateAPIUrl.ts` but was previously undeclared.
- Declared `@rive-app/react-native` as an **optional** peer dependency
  (`peerDependenciesMeta.optional`). It is loaded via an optional runtime `require`
  in `src/voice/persona/Persona.tsx`; the `Persona` Rive avatar is the only feature
  that needs it.

### Required consumer setup

- **`BottomSheetModalProvider` (from `@gorhom/bottom-sheet`) must wrap your app root**
  (inside a `GestureHandlerRootView`). The `Select`, `Drawer`, and `DropdownMenu`
  primitives — and any components built on them — present a bottom-sheet modal and
  crash at render if no provider is mounted above them.

### Known limitations

- **`MicSelector` shows only a single default input device.** `expo-audio` does not
  yet expose input-device enumeration, so the picker cannot list multiple microphones;
  it renders the system default device only. This will improve once `expo-audio` gains
  an input-device API.
