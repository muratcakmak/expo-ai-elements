import "../global.css";

import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Menu, X } from 'lucide-react-native';

/** Header button (right side, clear of the native back button) that opens the modal menu. */
function HeaderMenuButton() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      hitSlop={8}
      onPress={() => router.push('/menu')}
      style={({ pressed }) => ({ opacity: pressed ? 0.4 : 1, paddingHorizontal: 4 })}
    >
      <Menu size={22} color="#0f172a" />
    </Pressable>
  );
}

/** Close button for the menu modal (which has no back button of its own). */
function HeaderCloseButton() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close menu"
      hitSlop={8}
      onPress={() => router.back()}
      style={({ pressed }) => ({ opacity: pressed ? 0.4 : 1, paddingHorizontal: 4 })}
    >
      <X size={22} color="#0f172a" />
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerTitle: 'AI Chat',
            headerLargeTitle: false,
            headerRight: () => <HeaderMenuButton />,
          }}
        >
          <Stack.Screen name="index" options={{ title: 'AI Elements' }} />
          <Stack.Screen name="showcase" options={{ title: 'Showcase' }} />
          <Stack.Screen name="markdown" options={{ title: 'Markdown' }} />
          <Stack.Screen name="stress" options={{ title: 'Stress' }} />
          <Stack.Screen name="sheets" options={{ title: 'Sheets' }} />
          <Stack.Screen name="chat" options={{ title: 'Mock Chat' }} />
          <Stack.Screen name="code" options={{ title: 'Code' }} />
          <Stack.Screen name="voice" options={{ title: 'Voice' }} />
          <Stack.Screen name="storybook" options={{ title: 'Storybook' }} />
          <Stack.Screen name="smoke" options={{ title: 'Smoke' }} />
          <Stack.Screen
            name="menu"
            options={{
              presentation: 'modal',
              title: 'Menu',
              headerRight: () => <HeaderCloseButton />,
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
