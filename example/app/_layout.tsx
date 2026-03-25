// Polyfills — wrap in try/catch for Expo Go compatibility
try { require('@ungap/structured-clone'); } catch {}
try { require('@stardazed/streams-text-encoding'); } catch {}

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTitle: 'AI Chat',
          headerLargeTitle: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
